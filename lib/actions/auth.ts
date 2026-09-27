'use server';

import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { createSession, destroySession } from '@/lib/session';

export type FormState = { error?: string } | undefined;

export async function registerAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get('email') || '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') || '');
  const role = formData.get('role') === 'LANDLORD' ? 'LANDLORD' : 'TENANT';

  if (!email || !password) return { error: 'Email and password are required.' };
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: 'An account with that email already exists.' };

  const hashed = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { email, password: hashed, role }
  });

  if (role === 'TENANT') {
    await sendWelcomeEmail(email);

    const packageParam = String(formData.get('package') || '');
    const packageType = packageParam === 'ESSENTIAL' || packageParam === 'COMPLETE' ? packageParam : null;

    const inviteToken = String(formData.get('invite') || '');
    let propertyApplyingTo: string | null = null;
    let autoShareLandlordId: string | null = null;
    let autoShareLandlordEmail: string | null = null;

    if (inviteToken) {
      const invite = await db.landlordInvite.findUnique({
        where: { token: inviteToken },
        include: { landlord: true }
      });
      if (invite && (!invite.expiresAt || invite.expiresAt > new Date())) {
        propertyApplyingTo = invite.propertyName;
        autoShareLandlordId = invite.landlordId;
        autoShareLandlordEmail = invite.landlord.email;
      }
    }

    await db.passport.create({
      data: { userId: user.id, packageType, propertyApplyingTo, autoShareLandlordId, autoShareLandlordEmail }
    });
  }

  await createSession(user.id);
  if (role === 'TENANT') {
    redirect('/dashboard?registered=1');
  }
  redirect('/landlord/dashboard');
}

export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get('email') || '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') || '');

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return { error: 'Invalid email or password.' };
  if (!user.password) {
    return { error: 'This account uses Google sign-in. Use "Continue with Google" instead.' };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { error: 'Invalid email or password.' };

  await createSession(user.id);
  const destination =
    user.role === 'TENANT' ? '/dashboard' : user.role === 'ADMIN' ? '/admin/tenants' : '/landlord/dashboard';
  redirect(destination);
}

export async function logoutAction() {
  await destroySession();
  redirect('/login');
}

async function sendResetEmail(email: string, resetLink: string) {
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
      subject: 'Reset your Rental Passport password',
      html: `<p>We received a request to reset your Rental Passport password.</p><p><a href="${resetLink}">Click here to reset your password</a></p><p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>`
    })
  });
}

export async function sendWelcomeEmail(email: string) {
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
      subject: 'Welcome to Rental Passport!',
      html: `
        <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #2f5d50;">Welcome to Rental Passport!</h2>
          <p>Let's get your rental application ready to share.</p>
          <p>You've created your account. Now you can build your Rental Passport step by step:</p>
          <p style="font-size: 14px; color: #5b5852;">
            1. Application &rarr; 2. Documents &rarr; 3. Screening &rarr; 4. Ready to Share
          </p>
          <p>Once completed, your rental information, documents, and screening information will be organized in one place so you're ready when you find a rental you're interested in.</p>
          <p style="margin: 24px 0;">
            <a href="https://www.myrentalpassport.net/passport" style="background: #2f5d50; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Start My Rental Passport &rarr;
            </a>
          </p>
          <p style="font-size: 13px; color: #5b5852;">Most renters can complete setup in about 10&ndash;15 minutes. You can save your progress and come back anytime.</p>
        </div>
      `
    })
  });
}

export async function requestPasswordResetAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  if (!email) return { error: 'Please enter your email.' };

  const user = await db.user.findUnique({ where: { email } });

  // Only send if a real password-based account exists -- but always show
  // the same success message either way, so this can't be used to check
  // which emails have accounts (user enumeration).
  if (user && user.password) {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await db.passwordResetToken.create({ data: { token, userId: user.id, expiresAt } });

    const resetLink = `https://www.myrentalpassport.net/reset-password/${token}`;
    await sendResetEmail(email, resetLink);
  }

  return { error: undefined };
}

export async function resetPasswordAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const token = String(formData.get('token') || '');
  const password = String(formData.get('password') || '');

  if (!token) return { error: 'Invalid or missing reset link.' };
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' };

  const resetToken = await db.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.expiresAt < new Date()) {
    return { error: 'This reset link is invalid or has expired. Request a new one.' };
  }

  const hashed = await bcrypt.hash(password, 10);
  await db.user.update({ where: { id: resetToken.userId }, data: { password: hashed } });
  await db.passwordResetToken.delete({ where: { token } });

  redirect('/login?reset=1');
}
