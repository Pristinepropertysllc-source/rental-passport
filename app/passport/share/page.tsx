import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { Nav } from '@/components/Nav';
import { EmailShareLink } from '@/components/EmailShareLink';
import { createShareAction, revokeShareAction } from '@/lib/actions/share';
import { applicationComplete } from '@/lib/passport';

export default async function SharePage({
  searchParams
}: {
  searchParams: { paid?: string };
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
  if (!applicationComplete(passport)) redirect('/dashboard');
  if (!passport.packagePaid) redirect('/passport/checkout');

  const shares = await db.share.findMany({
    where: { tenantId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <Nav email={user.email} role="TENANT" />
      <div className="shell" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1>Share your passport</h1>
        <p className="muted">
          Invite a landlord by email. They&apos;ll get a secure read-only link to your
          Rental Passport &mdash; no new application for them to fill out, and no
          account required for them to view it.
        </p>

        {searchParams.paid === '1' && (
          <div className="card" style={{ background: '#e6f2e6', borderColor: 'var(--ok)' }}>
            <strong style={{ color: 'var(--ok)' }}>Payment received.</strong> You can now share
            your passport with landlords at no additional cost.
          </div>
        )}

        <div className="card">
          <h2>Invite a landlord</h2>
          <form action={createShareAction}>
            <div className="grid-2">
              <div className="field">
                <label>Landlord email</label>
                <input name="landlordEmail" type="email" required />
              </div>
              <div className="field">
                <label>Link expires in (days, optional)</label>
                <input name="expiresInDays" type="number" min={1} placeholder="30" />
              </div>
            </div>
            <button className="btn btn-primary" type="submit">
              Send invite
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Shared with</h2>
          {shares.length === 0 ? (
            <p className="muted">No shares yet.</p>
          ) : (
            <div className="section-list">
              {shares.map((share) => {
                const link = `/share/${share.token}`;
                return (
                  <div className="section-row" key={share.id} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{share.landlordEmail}</strong>
                      <span className={`badge badge-${share.status.toLowerCase()}`}>
                        {share.status}
                      </span>
                    </div>
                    <div className="muted" style={{ fontSize: 13 }}>
                      Sent {share.createdAt.toLocaleDateString()}
                      {share.expiresAt ? ` · expires ${share.expiresAt.toLocaleDateString()}` : ''}
                      {share.viewedAt ? ` · viewed ${share.viewedAt.toLocaleDateString()}` : ''}
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <code style={{ fontSize: 12 }}>{link}</code>
                      <EmailShareLink landlordEmail={share.landlordEmail} token={share.token} />
                      <form action={revokeShareAction}>
                        <input type="hidden" name="id" value={share.id} />
                        <button className="btn btn-danger btn-sm" type="submit">
                          Revoke access
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
