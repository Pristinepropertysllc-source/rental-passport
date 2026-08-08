import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { markShareViewedAction, respondToShareAction } from '@/lib/actions/share';
import { PrintableApplication } from '@/components/PrintableApplication';
import { PrintButton } from '@/components/PrintButton';

export default async function SharedPassportPage({ params }: { params: { token: string } }) {
  const share = await db.share.findUnique({
    where: { token: params.token },
    include: {
      passport: {
        include: {
          references: true,
          documents: true,
          occupants: true,
          pets: true,
          vehicles: true,
          rentalHistory: true,
          employment: true
        }
      },
      tenant: true
    }
  });

  if (!share) notFound();
  if (share.expiresAt && share.expiresAt < new Date()) {
    return (
      <div className="shell" style={{ paddingTop: 60 }}>
        <div className="card">
          <h1 style={{ fontSize: 20 }}>This link has expired</h1>
          <p className="muted">Ask the applicant to send a new invite.</p>
        </div>
      </div>
    );
  }

  await markShareViewedAction(params.token);
  const { passport } = share;
  const viewer = await getCurrentUser();
  const canRespond =
    viewer &&
    viewer.role === 'LANDLORD' &&
    (viewer.email === share.landlordEmail || viewer.id === share.landlordId);

  const applicantName = [passport.firstName, passport.lastName].filter(Boolean).join(' ') || share.tenant.email;

  return (
    <div className="shell" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span className={`badge badge-${share.status.toLowerCase()}`}>{share.status}</span>
        <PrintButton />
      </div>

      <PrintableApplication passport={passport} applicantName={applicantName} email={share.tenant.email} />

      <div className="card no-print">
        <h2>Documents</h2>
        {passport.documents.length === 0 ? (
          <p className="muted">None uploaded.</p>
        ) : (
          <div className="doc-list">
            {passport.documents.map((doc) => (
              <div className="doc-row" key={doc.id}>
                <span><span className="tag">{doc.type}</span> {doc.filename}</span>
                <a href={`/api/doc/${doc.id}?share=${share.token}`} target="_blank" rel="noreferrer">View</a>
              </div>
            ))}
          </div>
        )}
      </div>

      {canRespond && share.status !== 'APPROVED' && share.status !== 'DENIED' && (
        <div className="card no-print">
          <h2>Decision</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <form action={respondToShareAction}>
              <input type="hidden" name="id" value={share.id} />
              <input type="hidden" name="decision" value="APPROVED" />
              <button className="btn btn-primary" type="submit">Approve applicant</button>
            </form>
            <form action={respondToShareAction}>
              <input type="hidden" name="id" value={share.id} />
              <input type="hidden" name="decision" value="DENIED" />
              <button className="btn btn-danger" type="submit">Deny</button>
            </form>
          </div>
          {viewer?.email !== share.landlordEmail && (
            <p className="muted no-print" style={{ fontSize: 13, marginTop: 10 }}>
              Logged in as {viewer?.email}. To respond as {share.landlordEmail}, log in with that account.
            </p>
          )}
        </div>
      )}

      {!viewer && (
        <p className="muted no-print" style={{ fontSize: 13 }}>
          Viewing as a guest. Log in or create a landlord account to approve or deny this applicant and keep it
          in your dashboard.
        </p>
      )}
    </div>
  );
}
