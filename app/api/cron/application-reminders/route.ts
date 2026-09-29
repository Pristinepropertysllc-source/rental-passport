import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { overallCompletion } from '@/lib/passport';

const MILESTONES: { key: string; hours: number; subject: string; body: (continueUrl: string) => string }[] = [
  {
    key: '24h',
    hours: 24,
    subject: 'Pick up right where you left off',
    body: (url) => `
      <p>Hi there,</p>
      <p>Yesterday you started building your Rental Passport &mdash; and honestly, that's the hardest part. The rest only takes a few minutes.</p>
      <p>Whenever you're ready, your progress is saved and waiting for you.</p>
      ${emailButton(url, "Continue My Application \u2192")}
      <p style="margin-top: 28px; color: #5b5852;">Talk soon,<br />The Rental Passport Team</p>
    `
  },
  {
    key: '3d',
    hours: 72,
    subject: 'Your Rental Passport is still saved and ready',
    body: (url) => `
      <p>Hi there,</p>
      <p>Just a quick note &mdash; your Rental Passport application is still sitting exactly where you left it a few days ago.</p>
      <p>No need to start over. Pick up right where you left off whenever you have a few minutes.</p>
      ${emailButton(url, "Continue My Application \u2192")}
      <p style="margin-top: 28px; color: #5b5852;">We're here if you need anything,<br />The Rental Passport Team</p>
    `
  },
  {
    key: '7d',
    hours: 168,
    subject: 'Be ready before your next rental search',
    body: (url) => `
      <p>Hi there,</p>
      <p>Here's the idea behind Rental Passport: build it once, so you're ready the moment you find a place you actually want.</p>
      <p>Your application is still open &mdash; finishing it now means one less thing to worry about later.</p>
      ${emailButton(url, "Continue My Application \u2192")}
      <p style="margin-top: 28px; color: #5b5852;">Best,<br />The Rental Passport Team</p>
    `
  },
  {
    key: '10d',
    hours: 240,
    subject: 'Still thinking about finishing your Rental Passport?',
    body: (url) => `
      <p>Hi there,</p>
      <p>It's been a little while since you started your Rental Passport, so we wanted to check in.</p>
      <p>If you're still planning to use it, everything you've entered so far is saved &mdash; pick up right where you left off in just a few minutes.</p>
      ${emailButton(url, "Continue My Application \u2192")}
      <p>And if your plans have changed, no worries at all &mdash; we just wanted to make sure you knew it was still here.</p>
      <p style="margin-top: 28px; color: #5b5852;">The Rental Passport Team</p>
    `
  },
  {
    key: '15d',
    hours: 360,
    subject: 'One last note about your Rental Passport',
    body: (url) => `
      <p>Hi there,</p>
      <p>This is the last note we'll send about your unfinished Rental Passport application.</p>
      <p>If you'd still like to use it, your information is saved and ready whenever you are &mdash; it only takes a few minutes to finish.</p>
      ${emailButton(url, "Continue My Application \u2192")}
      <p>If it's no longer something you need, that's completely fine too &mdash; we just didn't want it to go unfinished without letting you know.</p>
      <p style="margin-top: 28px; color: #5b5852;">Thanks for giving Rental Passport a try,<br />The Rental Passport Team</p>
    `
  }
];

import { emailWrapper, emailButton } from '@/lib/emailTemplate';

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
      html: emailWrapper(bodyHtml)
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

  // Manual test mode: sends one specific milestone email directly to a given
  // address, without touching any real passport data. Used to verify email
  // delivery/content without needing a genuinely 24h+-old test account.
  const testEmail = req.nextUrl.searchParams.get('testEmail');
  const testMilestone = req.nextUrl.searchParams.get('milestone') || '24h';
  if (testEmail) {
    const milestone = MILESTONES.find((m) => m.key === testMilestone);
    if (!milestone) {
      return NextResponse.json({ error: `Unknown milestone "${testMilestone}"` }, { status: 400 });
    }
    await sendReminderEmail(testEmail, milestone.subject, milestone.body('https://www.myrentalpassport.net/passport'));
    return NextResponse.json({ test: true, sentTo: testEmail, milestone: milestone.key });
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
