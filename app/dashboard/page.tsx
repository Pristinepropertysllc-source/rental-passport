import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { Nav } from '@/components/Nav';
import { ProgressBar } from '@/components/ProgressBar';
import { overallCompletion, sectionCompletion, applicationComplete } from '@/lib/passport';
import { PACKAGES, isPackageKey } from '@/lib/packages';
import { SCREENING_CATEGORIES } from '@/lib/screening';

const SECTION_LABELS: Record<string, string> = {
  personal: 'Personal Information',
  contact: 'Contact Information',
  application: 'Application Details',
  household: 'Household Information',
  employment: 'Employment & Income',
  rentalHistory: 'Rental History',
  references: 'References',
  documents: 'Documents Uploaded',
  screeningPayment: 'Screening Payment'
};

export default async function DashboardPage() {
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
      employment: true,
      screeningItems: true
    }
  });
  if (!passport) redirect('/passport');

  const shares = await db.share.findMany({
    where: { tenantId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  const percent = overallCompletion(passport);
  const sections = sectionCompletion(passport);
  const appComplete = applicationComplete(passport);
  const unlocked = appComplete && passport.packagePaid;
  const displayName = [passport.firstName, passport.lastName].filter(Boolean).join(' ') || user.email;

  return (
    <>
      <Nav email={user.email} role="TENANT" />
      <div className="shell" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {!unlocked ? (
          <>
            <h1>Welcome, {displayName}</h1>
            <p className="muted">Complete your Rental Passport to start applying to properties.</p>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <h2 style={{ margin: 0 }}>Rental Passport Completion</h2>
                <strong>{percent}%</strong>
              </div>
              <ProgressBar percent={percent} />

              <div className="section-list" style={{ marginTop: 20 }}>
                <div className="section-row">
                  <span>✓ Account Created</span>
                  <span className="badge badge-approved">Complete</span>
                </div>
                {Object.entries(sections).map(([key, s]) => (
                  <div className="section-row" key={key}>
                    <span>{s.complete ? '✓' : '⬜'} {SECTION_LABELS[key] ?? key}</span>
                    <span className={`badge ${s.complete ? 'badge-approved' : 'badge-pending'}`}>
                      {s.complete ? 'Complete' : 'Incomplete'}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                {!appComplete ? (
                  <Link className="btn btn-primary" href="/passport">
                    Continue application
                  </Link>
                ) : !passport.packagePaid ? (
                  <Link className="btn btn-primary" href="/passport/checkout">
                    Complete payment
                  </Link>
                ) : null}
              </div>
            </div>

            {appComplete && !passport.packagePaid && (
              <div className="card" style={{ background: '#eaf0fb', borderColor: '#2b5aa0' }}>
                <strong>Your Rental Passport is ready.</strong> Complete payment to begin
                verification.
                <div style={{ marginTop: 12 }}>
                  <Link className="btn btn-primary" href="/passport/checkout">
                    Choose a screening package
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h1>{displayName}&apos;s Rental Passport</h1>
            <p className="muted">Your application is complete and verification is underway.</p>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <h2 style={{ margin: 0 }}>Rental Passport Status</h2>
                <span className="badge badge-approved">Completed: 100%</span>
              </div>
              <p className="muted" style={{ fontSize: 14 }}>
                {passport.packageType && isPackageKey(passport.packageType)
                  ? PACKAGES[passport.packageType].name
                  : 'Screening package'}{' '}
                purchased.
              </p>

              <h3 style={{ fontSize: 15, marginBottom: 8 }}>Verification Status</h3>
              <div className="section-list" style={{ marginBottom: 20 }}>
                {SCREENING_CATEGORIES.map((cat) => {
                  const item = passport.screeningItems.find((i) => i.category === cat.key);
                  const status = item?.status || 'PENDING';
                  const isGood = status === 'COMPLETED' || status === 'VERIFIED';
                  return (
                    <div className="section-row" key={cat.key}>
                      <span>
                        {isGood ? '✓' : '—'} {cat.label}
                      </span>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {item?.documentId && (
                          <a href={`/api/doc/${item.documentId}`} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
                            View
                          </a>
                        )}
                        <span className={`badge ${isGood ? 'badge-approved' : 'badge-pending'}`}>{status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="muted" style={{ fontSize: 13 }}>
                Screening results are added by our team after your report runs at{' '}
                <a href="https://www.chcked.com/newreport" target="_blank" rel="noreferrer">
                  chcked.com
                </a>
                .
              </p>

              <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link className="btn btn-primary" href="/passport">
                  View / edit passport
                </Link>
                <Link className="btn btn-secondary" href="/passport/print">
                  Print passport
                </Link>
                <Link className="btn btn-secondary" href="/passport/share">
                  Share with a landlord
                </Link>
              </div>
            </div>

            <div className="card">
              <h2>Applications sent</h2>
              {shares.length === 0 ? (
                <p className="muted">You haven&apos;t shared your passport with any landlords yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Landlord</th>
                      <th>Sent</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shares.map((share) => (
                      <tr key={share.id}>
                        <td>{share.landlordEmail}</td>
                        <td>{share.createdAt.toLocaleDateString()}</td>
                        <td>
                          <span className={`badge badge-${share.status.toLowerCase()}`}>{share.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
