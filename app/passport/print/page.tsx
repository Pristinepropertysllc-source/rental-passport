import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { PrintableApplication } from '@/components/PrintableApplication';
import { PrintButton } from '@/components/PrintButton';
import { ScreeningResultsCard } from '@/components/ScreeningResultsCard';
import { applicationComplete } from '@/lib/passport';

export default async function PrintPassportPage() {
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
  if (!applicationComplete(passport)) redirect('/dashboard');
  if (!passport.packagePaid) redirect('/passport/checkout');

  const applicantName = [passport.firstName, passport.lastName].filter(Boolean).join(' ') || user.email;

  return (
    <div className="shell" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <PrintButton />
      <ScreeningResultsCard screeningItems={passport.screeningItems} passportId={passport.id} />
      <PrintableApplication passport={passport} applicantName={applicantName} email={user.email} />

      <div className="card no-print">
        <h2>Documents</h2>
        {passport.documents.length === 0 ? (
          <p className="muted">None uploaded.</p>
        ) : (
          <div className="doc-list">
            {passport.documents.map((doc) => (
              <div className="doc-row" key={doc.id}>
                <span><span className="tag">{doc.type}</span> {doc.filename}</span>
                <a href={`/api/doc/${doc.id}`} target="_blank" rel="noreferrer">
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
