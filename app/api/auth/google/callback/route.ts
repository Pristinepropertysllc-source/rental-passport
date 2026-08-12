import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const savedState = req.cookies.get('google_oauth_state')?.value;
  const packageParam = req.cookies.get('signup_package')?.value || '';

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL('/login?error=google', req.url));
  }

  const redirectUri = `${req.nextUrl.origin}/api/auth/google/callback`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });
  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/login?error=google', req.url));
  }
  const tokenData = await tokenRes.json();

  const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  if (!profileRes.ok) {
    return NextResponse.redirect(new URL('/login?error=google', req.url));
  }
  const profile = await profileRes.json();
  const googleId = String(profile.sub || '');
  const email = String(profile.email || '').trim().toLowerCase();
  if (!googleId || !email) {
    return NextResponse.redirect(new URL('/login?error=google', req.url));
  }

  let user = await db.user.findUnique({ where: { googleId } });

  if (!user) {
    const existingByEmail = await db.user.findUnique({ where: { email } });
    if (existingByEmail) {
      user = await db.user.update({ where: { id: existingByEmail.id }, data: { googleId } });
    }
  }

  if (!user) {
    const packageType = packageParam === 'ESSENTIAL' || packageParam === 'COMPLETE' ? packageParam : null;
    user = await db.user.create({
      data: { email, googleId, role: 'TENANT' }
    });

    const inviteToken = req.cookies.get('signup_invite')?.value || '';
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

  const destination =
    user.role === 'TENANT' ? '/dashboard' : user.role === 'ADMIN' ? '/admin/tenants' : '/landlord/dashboard';
  const res = NextResponse.redirect(new URL(destination, req.url));
  res.cookies.delete('google_oauth_state');
  res.cookies.delete('signup_package');
  res.cookies.delete('signup_invite');
  return res;
}
