import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { Nav } from '@/components/Nav';
import { PACKAGES, isPackageKey } from '@/lib/packages';
import { setPackageAction } from '@/lib/actions/passport';
import { applicationComplete } from '@/lib/passport';

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
            <h2>Choose your package</h2>
            <p className="muted" style={{ fontSize: 14 }}>
              Pick a screening package to continue to payment.
            </p>
            <div className="section-list">
              {Object.values(PACKAGES).map((pkg) => (
                <form action={setPackageAction} key={pkg.key}>
                  <input type="hidden" name="packageType" value={pkg.key} />
                  <div className="section-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                    <strong>{pkg.name}</strong>
                    <span className="muted" style={{ fontSize: 13 }}>{pkg.description}</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700 }}>{pkg.priceLabel}</span>
                      <button className="btn btn-primary btn-sm" type="submit">Select</button>
                    </div>
                  </div>
                </form>
              ))}
            </div>
          </div>
        ) : (
          <div className="card">
            <h2>{selectedPackage.name}</h2>
            <p className="muted" style={{ fontSize: 14 }}>{selectedPackage.description}</p>
            <p style={{ fontSize: 24, fontWeight: 700, margin: '14px 0' }}>{selectedPackage.priceLabel}</p>
            <form action="/api/checkout-package" method="POST">
              <button className="btn btn-primary" type="submit">
                Pay {selectedPackage.priceLabel.split('/')[0]} &amp; continue
              </button>
            </form>
            <form action={setPackageAction} style={{ marginTop: 10 }}>
              <input
                type="hidden"
                name="packageType"
                value={selectedPackage.key === 'ESSENTIAL' ? 'COMPLETE' : 'ESSENTIAL'}
              />
              <button className="btn btn-secondary btn-sm" type="submit">
                Switch to {selectedPackage.key === 'ESSENTIAL' ? PACKAGES.COMPLETE.name : PACKAGES.ESSENTIAL.name}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
