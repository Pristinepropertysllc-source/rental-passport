'use server';

import bcrypt from 'bcryptjs';
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
  redirect(role === 'TENANT' ? '/dashboard' : '/landlord/dashboard');
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
