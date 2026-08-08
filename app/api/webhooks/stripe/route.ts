import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      id: string;
      metadata: Record<string, string> | null;
    };
    const metadata = session.metadata || {};

    if (metadata.kind === 'package' && metadata.passportId && metadata.packageType) {
      await db.passport.update({
        where: { id: metadata.passportId },
        data: {
          packagePaid: true,
          packageType: metadata.packageType,
          packageStripeSessionId: session.id
        }
      });
      return NextResponse.json({ received: true });
    }

    const { tenantId, passportId, landlordEmail, expiresInDays } = metadata;

    if (tenantId && passportId && landlordEmail) {
      const existingLandlord = await db.user.findUnique({ where: { email: landlordEmail } });
      const token = randomBytes(16).toString('hex');
      const days = Number.parseInt(expiresInDays || '', 10);
      const expiresAt = Number.isFinite(days) && days > 0 ? new Date(Date.now() + days * 86400000) : null;

      await db.share.create({
        data: {
          token,
          passportId,
          tenantId,
          landlordEmail,
          landlordId: existingLandlord && existingLandlord.role === 'LANDLORD' ? existingLandlord.id : null,
          expiresAt,
          feePaid: true,
          stripeSessionId: session.id
        }
      });
    }
  }

  return NextResponse.json({ received: true });
}
