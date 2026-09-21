import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { PACKAGES, isPackageKey } from '@/lib/packages';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'TENANT') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const passport = await db.passport.findUnique({ where: { userId: user.id } });
  if (!passport || !passport.packageType || !isPackageKey(passport.packageType)) {
    return NextResponse.redirect(new URL('/passport/checkout', req.url));
  }
  // Guard against double-charging: the checkout PAGE already redirects away
  // once paid, but that only protects a fresh page load. A stale
  // browser-cached page (e.g. after hitting "back" from Stripe) or a
  // resubmitted request could still hit this endpoint directly, so check
  // again here before ever creating a new Stripe session.
  if (passport.packagePaid) {
    return NextResponse.redirect(new URL('/passport/share', req.url));
  }

  const pkg = PACKAGES[passport.packageType];
  const origin = req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: pkg.name, description: pkg.description },
          unit_amount: pkg.priceCents
        },
        quantity: 1
      }
    ],
    metadata: {
      kind: 'package',
      passportId: passport.id,
      packageType: pkg.key
    },
    success_url: `${origin}/passport/share?paid=1`,
    cancel_url: `${origin}/passport/checkout?canceled=1`
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}
