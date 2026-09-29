import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { overallCompletion } from '@/lib/passport';

const MILESTONES: { key: string; hours: number; subject: string; body: (continueUrl: string) => string }[] = [
  {
    key: '24h',
    hours: 24,
    subject: 'Your Rental Passport application is waiting for you',
    body: (url) => `
      <p>Hi there,</p>
      <p>You started building your Rental Passport yesterday, but it looks like it isn't finished yet.</p>
      <p>It only takes a few more minutes to pick up where you left off.</p>
      <p style="margin: 24px 0;"><a href="${url}" style="background:#2f5d50;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Continue My Application &rarr;</a></p>
    `
  },
  {
    key: '3d',
    hours: 72,
    subject: "Don't lose your progress on Rental Passport",
    body: (url) => `
      <p>Hi there,</p>
      <p>It's been a few days since you started your Rental Passport application. Your progress is saved and waiting for you whenever you're ready to finish.</p>
      <p style="margin: 24px 0;"><a href="${url}" style="background:#2f5d50;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Continue My Application &rarr;</a></p>
    `
  },
  {
    key: '7d',
    hours: 168,
    subject: 'Be ready before your next rental search',
    body: (url) => `
      <p>Hi there,</p>
      <p>A completed Rental Passport means you're ready to apply the moment you find a place you like &mdash; no scrambling for documents or information.</p>
      <p>Your application is still incomplete. Want to finish it up?</p>
      <p style="margin: 24px 0;"><a href="${url}" style="background:#2f5d50;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Continue My Application &rarr;</a></p>
    `
  },
  {
    key: '10d',
    hours: 240,
    subject: 'Your Rental Passport is still incomplete',
    body: (url) => `
      <p>Hi there,</p>
      <p>It's been 10 days since you started your Rental Passport. If you're still planning to use it, your progress is saved and ready whenever you are.</p>
      <p style="margin: 24px 0;"><a href="${url}" style="background:#2f5d50;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Continue My Application &rarr;</a></p>
    `
  },
  {
    key: '15d',
    hours: 360,
    subject: 'Last reminder: finish your Rental Passport',
    body: (url) => `
      <p>Hi there,</p>
      <p>This is our last reminder about your unfinished Rental Passport application. If you still need it, it's just a few minutes away from being ready to share with landlords.</p>
      <p style="margin: 24px 0;"><a href="${url}" style="background:#2f5d50;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Continue My Application &rarr;</a></p>
    `
  }
];

async function sendReminderEmail(email: string, subject: string, bodyHtml: string) {
  if (!process.env.RESEND_API_KEY) return;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Rental Passport <noreply@myrentalpassport.net>',
      to: email,
      subject,
      html: `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;color:#1e1c1a;line-height:1.6;">${bodyHtml}</div>`
    })
  });
}

export async function GET(req: NextRequest) {
  // Vercel Cron sends this exact header automatically when CRON_SECRET is
  // set as an environment variable, so this rejects anyone else hitting the
  // endpoint directly.
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const candidates = await db.passport.findMany({
    where: { packagePaid: false },
    include: {
      user: true,
      occupants: true,
      pets: true,
      vehicles: true,
      rentalHistory: true,
      employment: true,
      references: true,
      documents: true
    }
  });

  const now = Date.now();
  let sentCount = 0;

  for (const passport of candidates) {
    if (overallCompletion(passport) === 100) continue;

    const hoursElapsed = (now - passport.createdAt.getTime()) / (1000 * 60 * 60);
    const alreadySent = passport.remindersSent || [];
    const newlySent: string[] = [];

    for (const milestone of MILESTONES) {
      if (hoursElapsed >= milestone.hours && !alreadySent.includes(milestone.key)) {
        await sendReminderEmail(
          passport.user.email,
          milestone.subject,
          milestone.body('https://www.myrentalpassport.net/passport')
        );
        newlySent.push(milestone.key);
        sentCount++;
      }
    }

    if (newlySent.length > 0) {
      await db.passport.update({
        where: { id: passport.id },
        data: { remindersSent: [...alreadySent, ...newlySent] }
      });
    }
  }

  return NextResponse.json({ checked: candidates.length, emailsSent: sentCount });
}
