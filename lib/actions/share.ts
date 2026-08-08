'use server';

import { randomBytes } from 'crypto';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/session';

// Creates a share record and, if a registered landlord account already
// exists with that email, links it directly. Otherwise it's an
// email-invite share: the landlord can view the read-only link now, and
// if they later register with that email it will show up in their
// dashboard too.
//
// NOTE: this does not actually send an email (no SendGrid/Twilio key
// configured in this starter). It returns the share so the UI can show a
// copyable link. Wire up an email provider before relying on delivery.
export async function createShareAction(formData: FormData) {
  const user = await requireUser();
  const passport = await db.passport.findUnique({ where: { userId: user.id } });
  if (!passport) throw new Error('No passport found');

  const landlordEmail = String(formData.get('landlordEmail') || '')
    .trim()
    .toLowerCase();
  if (!landlordEmail) return;

  const expiresInDaysRaw = String(formData.get('expiresInDays') || '');
  const expiresInDays = Number.parseInt(expiresInDaysRaw, 10);
  const expiresAt =
    Number.isFinite(expiresInDays) && expiresInDays > 0
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

  const existingLandlord = await db.user.findUnique({ where: { email: landlordEmail } });
  const token = randomBytes(16).toString('hex');

  await db.share.create({
    data: {
      token,
      passportId: passport.id,
      tenantId: user.id,
      landlordEmail,
      landlordId: existingLandlord && existingLandlord.role === 'LANDLORD' ? existingLandlord.id : null,
      expiresAt
    }
  });

  revalidatePath('/passport/share');
  revalidatePath('/dashboard');
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
