import { NextRequest, NextResponse } from 'next/server';
import { stripe, APPLICATION_FEE_CENTS } from '@/lib/stripe';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'TENANT') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const passport = await db.passport.findUnique({ where: { userId: user.id } });
  if (!passport) {
    return NextResponse.redirect(new URL('/passport', req.url));
  }

  const formData = await req.formData();
  const landlordEmail = String(formData.get('landlordEmail') || '')
    .trim()
    .toLowerCase();
  const expiresInDays = String(formData.get('expiresInDays') || '');

  if (!landlordEmail) {
    return NextResponse.redirect(new URL('/passport/share', req.url));
  }

  const origin = req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'Rental Passport application fee' },
          unit_amount: APPLICATION_FEE_CENTS
        },
        quantity: 1
      }
    ],
    metadata: {
      tenantId: user.id,
      passportId: passport.id,
      landlordEmail,
      expiresInDays
    },
    success_url: `${origin}/passport/share?paid=1`,
    cancel_url: `${origin}/passport/share?canceled=1`
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}
