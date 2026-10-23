'use server';

import { randomBytes } from 'crypto';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { emailWrapper, emailButton } from '@/lib/emailTemplate';
import { buildShareMessage, shareLink } from '@/lib/shareMessage';
import { screeningDate, formatLongDate } from '@/lib/screeningDate';

export type CreateShareState = {
  success?: boolean;
  error?: string;
  share?: {
    token: string;
    link: string;
    message: string;
    landlordName: string;
    landlordEmail: string;
    landlordPhone: string;
    emailed: boolean;
  };
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Same Resend setup as app/api/cron/application-reminders. Returns true if
// Resend accepted the message; never throws, so a mail problem can't block
// the share from being created.
async function sendShareEmail(to: string, subject: string, message: string, link: string, replyTo?: string) {
  if (!process.env.RESEND_API_KEY) return false;
  try {
    const body = `
      <p style="white-space:pre-line;">${escapeHtml(message)}</p>
      ${emailButton(link, 'View Rental Passport →')}
    `;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Rental Passport <noreply@myrentalpassport.net>',
        to,
        subject,
        html: emailWrapper(body),
        ...(replyTo ? { reply_to: replyTo } : {})
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Creates a share link for one landlord/property. If the renter typed an
// email, we also email the link from the site. Text, email-it-yourself,
// the phone's Share sheet and Copy link are handled by the buttons shown
// after this returns.
export async function createShareAction(
  _prevState: CreateShareState | undefined,
  formData: FormData
): Promise<CreateShareState> {
  const user = await requireUser();
  const passport = await db.passport.findUnique({
    where: { userId: user.id },
    include: { screeningItems: true, documents: true }
  });
  if (!passport) throw new Error('No passport found');

  const landlordName = String(formData.get('landlordName') || '').trim().slice(0, 200);
  if (!landlordName) return { error: 'Please enter the landlord or property name.' };

  const landlordEmail = String(formData.get('landlordEmail') || '')
    .trim()
    .toLowerCase();
  const landlordPhone = String(formData.get('landlordPhone') || '').trim().slice(0, 40);

  const expiresInDaysRaw = String(formData.get('expiresInDays') || '');
  const expiresInDays = Number.parseInt(expiresInDaysRaw, 10);
  const expiresAt =
    Number.isFinite(expiresInDays) && expiresInDays > 0
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

  const existingLandlord = landlordEmail ? await db.user.findUnique({ where: { email: landlordEmail } }) : null;
  const token = randomBytes(16).toString('hex');

  const created = await db.share.create({
    data: {
      token,
      passportId: passport.id,
      tenantId: user.id,
      landlordEmail, // empty string when no email was given
      landlordName,
      landlordPhone: landlordPhone || null,
      landlordId: existingLandlord && existingLandlord.role === 'LANDLORD' ? existingLandlord.id : null,
      expiresAt
    }
  });

  const date = screeningDate(passport.screeningItems, passport.documents);
  const link = shareLink(token);
  const message = buildShareMessage({
    firstName: passport.firstName,
    property: landlordName,
    screeningDate: date ? formatLongDate(date) : null,
    link
  });

  let emailed = false;
  if (landlordEmail) {
    const who = passport.firstName || 'A renter';
    emailed = await sendShareEmail(
      landlordEmail,
      `${who} shared their Rental Passport with you`,
      message,
      link,
      user.email
    );
    if (emailed) {
      await db.share.update({ where: { id: created.id }, data: { sentVia: 'EMAIL', sentAt: new Date() } });
    }
  }

  revalidatePath('/passport/share');
  revalidatePath('/dashboard');
  return {
    success: true,
    share: { token, link, message, landlordName, landlordEmail, landlordPhone, emailed }
  };
}

// Remembers how (and when) the renter sent the link, for the "Shared with" list.
export async function recordShareSentAction(token: string, method: string) {
  const user = await requireUser();
  if (!['TEXT', 'EMAIL', 'SHARE', 'COPY'].includes(method)) return;
  const share = await db.share.findUnique({ where: { token } });
  if (!share || share.tenantId !== user.id) return;
  await db.share.update({ where: { id: share.id }, data: { sentVia: method, sentAt: new Date() } });
  revalidatePath('/passport/share');
}

export async function revokeShareAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get('id') || '');
  const share = await db.share.findUnique({ where: { id } });
  if (!share || share.tenantId !== user.id) return;

  await db.share.delete({ where: { id } });
  revalidatePath('/passport/share');
  revalidatePath('/dashboard');
}

// Called from the landlord's read-only view to mark it seen.
export async function markShareViewedAction(token: string) {
  const share = await db.share.findUnique({ where: { token } });
  if (!share) return;
  if (share.status === 'SENT') {
    await db.share.update({
      where: { token },
      data: { status: 'VIEWED', viewedAt: new Date() }
    });
  }
}

export async function respondToShareAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get('id') || '');
  const decision = formData.get('decision') === 'APPROVED' ? 'APPROVED' : 'DENIED';

  const share = await db.share.findUnique({ where: { id } });
  if (!share) return;
  // Only the invited landlord (by email match) or the linked landlord account may respond.
  if (share.landlordId && share.landlordId !== user.id) return;
  if (!share.landlordId && share.landlordEmail !== user.email) return;

  await db.share.update({
    where: { id },
    data: { status: decision, landlordId: user.id }
  });

  revalidatePath('/landlord/dashboard');
}
