import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { Nav } from '@/components/Nav';
import { PACKAGES, isPackageKey } from '@/lib/packages';
import { setPackageAction } from '@/lib/actions/passport';
import { applicationComplete } from '@/lib/passport';
import { MountEventTracker } from '@/components/pixel/PixelTrackers';
import { PayForm } from '@/components/pixel/PayForm';

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: { canceled?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'TENANT') redirect('/landlord/dashboard');

  const passport = await db.passport.findUnique({
    where: { userId: user.id },
    include: {
      references: true,
      documents: true,
      occupants: true,
      pets: true,
      vehicles: true,
      rentalHistory: true,
      employment: true
    }
  });
  if (!passport) redirect('/passport');

  if (passport.packagePaid) redirect('/passport/share');
  if (!applicationComplete(passport)) redirect('/dashboard');

  const selectedPackage = passport.packageType && isPackageKey(passport.packageType)
    ? PACKAGES[passport.packageType]
    : null;

  return (
    <>
      <Nav email={user.email} role="TENANT" />
      <div className="shell" style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 560 }}>
        <h1>Checkout</h1>

        {searchParams.canceled === '1' && (
          <div className="error-banner">Payment canceled &mdash; you can try again below.</div>
        )}

        {!selectedPackage ? (
          <div className="card">
            <h2>Confirm your package</h2>
            <p className="muted" style={{ fontSize: 14 }}>
              Continue to payment for your screening package.
            </p>
            <form action={setPackageAction}>
              <input type="hidden" name="packageType" value="COMPLETE" />
              <div className="section-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                <strong>{PACKAGES.COMPLETE.name}</strong>
                <span className="muted" style={{ fontSize: 13 }}>{PACKAGES.COMPLETE.description}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700 }}>{PACKAGES.COMPLETE.priceLabel}</span>
                  <button className="btn btn-primary btn-sm" type="submit">Continue</button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="card">
              <MountEventTracker
                event="InitiateCheckout"
                params={{ value: selectedPackage.priceCents / 100, currency: 'USD' }}
              />
              <h2>{selectedPackage.name}</h2>
              <p className="muted" style={{ fontSize: 14 }}>{selectedPackage.description}</p>

              <p style={{ fontSize: 14, fontWeight: 600, margin: '16px 0 10px' }}>Your screening report covers:</p>
              <ul className="check-list">
                <li>Credit report</li>
                <li>Criminal history</li>
                <li>Eviction history</li>
                <li>Employment and income verification</li>
                <li>Current address and rental history</li>
              </ul>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '18px 0 4px' }}>
                <span style={{ fontSize: 28, fontWeight: 700 }}>{selectedPackage.priceLabel.split('/')[0]}</span>
                <span className="muted" style={{ fontSize: 14 }}>one-time payment</span>
              </div>
              <p className="muted" style={{ fontSize: 14, marginBottom: 16 }}>
                No subscriptions and no per-property fees. Share your Rental Passport with as many landlords as you need.
              </p>
              <PayForm
                label={`Pay ${selectedPackage.priceLabel.split('/')[0]} & continue`}
                value={selectedPackage.priceCents / 100}
              />
              <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>
                🔒 Secure payment through Stripe. Rental Passport never sees or stores your card number.
              </p>
            </div>

            <div className="card">
              <h2 style={{ fontSize: 18 }}>What happens next</h2>
              <ol style={{ margin: '10px 0 0', paddingLeft: 20, fontSize: 14, display: 'grid', gap: 8 }}>
                <li>After payment, your screening starts.</li>
                <li>When it&rsquo;s complete, your results appear on your dashboard.</li>
                <li>
                  Share your Rental Passport with landlords using a secure link. You decide who sees it and can revoke
                  access any time.
                </li>
              </ol>
              <p className="muted" style={{ fontSize: 13, marginTop: 14 }}>
                Questions before you pay? Call or text us at <a href="tel:+12405207174">(240) 520-7174</a>.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
