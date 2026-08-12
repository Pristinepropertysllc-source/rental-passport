import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function GET(req: NextRequest) {
  const state = randomBytes(16).toString('hex');
  const packageParam = req.nextUrl.searchParams.get('package') || '';
  const inviteParam = req.nextUrl.searchParams.get('invite') || '';
  const redirectUri = `${req.nextUrl.origin}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account'
  });

  const res = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  res.cookies.set('google_oauth_state', state, {
    httpOnly: true,
    maxAge: 600,
    path: '/',
    sameSite: 'lax'
  });
  if (packageParam) {
    res.cookies.set('signup_package', packageParam, {
      httpOnly: true,
      maxAge: 600,
      path: '/',
      sameSite: 'lax'
    });
  }
  if (inviteParam) {
    res.cookies.set('signup_invite', inviteParam, {
      httpOnly: true,
      maxAge: 600,
      path: '/',
      sameSite: 'lax'
    });
  }
  return res;
}
