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
      subject: 'Welcome to Rental Passport — Your rental application starts here.',
      html: `
        <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #1e1c1a; line-height: 1.6;">
          <p>Hi there,</p>
          <p>Welcome to Rental Passport! &#127881;</p>
          <p>Thank you for creating your account. You are now one step closer to making the rental application process easier.</p>
          <p>Rental Passport was created to solve a problem I saw every day in the real estate industry: renters having to fill out the same applications repeatedly, gather the same documents over and over, and pay multiple application fees just to apply for different rental properties.</p>
          <p>My goal was to create a simpler way for renters to be prepared.</p>
          <p>With Rental Passport, you can create one reusable rental profile that helps you organize your information, documents, and screening results so you can be ready when you find your next home.</p>

          <p style="font-weight: 600; margin-bottom: 8px;">Your next steps:</p>
          <p style="margin: 4px 0;">&#9989; Complete your Rental Passport application</p>
          <p style="margin: 4px 0;">&#9989; Add your personal, employment, and rental history</p>
          <p style="margin: 4px 0;">&#9989; Upload your important documents</p>
          <p style="margin: 4px 0;">&#9989; Complete your screening for $54.99</p>
          <p style="margin: 4px 0 16px;">&#9989; Share your completed Rental Passport with landlords and property managers</p>

          <p>Once completed, your Rental Passport helps you have your information ready instead of scrambling when you find a rental opportunity.</p>

          <p style="margin: 24px 0;">
            <a href="https://www.myrentalpassport.net/passport" style="background: #2f5d50; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              Continue Application &rarr;
            </a>
          </p>

          <hr style="border: none; border-top: 1px solid #e4e2dd; margin: 28px 0;" />

          <p style="font-weight: 600;">About the Founder</p>
          <p>My name is Granit Pllana, and I am a Realtor, commercial real estate agent, property manager, business owner, and the founder of Rental Passport.</p>
          <p>Through my experience working with renters, landlords, and property owners, I saw how frustrating the rental process can be for everyone involved. Renters often have to repeat the same steps for every property, while landlords and property managers need accurate information to make better decisions.</p>
          <p>Rental Passport was built to make the process more organized, efficient, and convenient for both renters and housing providers.</p>
          <p style="font-weight: 600;">My mission is simple: make renting easier by helping renters apply once, stay organized, and be ready for more opportunities.</p>
          <p>If you ever have questions, need help completing your Rental Passport, or want to connect directly, you can message me on Facebook:</p>
          <p><a href="https://www.facebook.com/GranitPllanaRealtor" style="color: #2f5d50;">Facebook &mdash; Granit Pllana Realtor</a></p>
          <p>I am happy to help answer questions and make sure you have the best experience using Rental Passport.</p>
          <p>Thank you for being part of changing the way people rent.</p>

          <p style="margin-top: 24px;">The Rental Passport Team<br /><strong>Apply Once. Rent Anywhere.</strong></p>
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
