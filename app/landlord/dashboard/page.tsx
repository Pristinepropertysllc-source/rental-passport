import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { Nav } from '@/components/Nav';
import { InviteEmailLink } from '@/components/InviteEmailLink';
import { createLandlordInviteAction } from '@/lib/actions/landlord';

export default async function LandlordDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'LANDLORD') redirect('/dashboard');

  // Matches shares linked directly to this account, plus email-invite shares
  // sent to this address before the landlord had registered.
  const shares = await db.share.findMany({
    where: { OR: [{ landlordId: user.id }, { landlordEmail: user.email }] },
    include: { passport: true, tenant: true },
    orderBy: { createdAt: 'desc' }
  });

  const invites = await db.landlordInvite.findMany({
    where: { landlordId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <Nav email={user.email} role="LANDLORD" />
      <div className="shell" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1>Applicants</h1>
        <p className="muted">Rental Passport applications shared with you.</p>

        <div className="card">
          <h2>Invite an applicant</h2>
          <p className="muted" style={{ fontSize: 14, marginTop: 0 }}>
            Send a link inviting a prospective renter to build their Rental Passport. Once they
            finish their application and pay for screening, it&apos;s automatically shared with
            you here &mdash; no extra step needed.
          </p>
          <form action={createLandlordInviteAction}>
            <div className="field">
              <label>Property (optional)</label>
              <input name="propertyName" placeholder="123 Main St, Apt 2" />
            </div>
            <button className="btn btn-primary" type="submit">
              Create invite link
            </button>
          </form>

          {invites.length > 0 && (
            <div className="section-list" style={{ marginTop: 20 }}>
              {invites.map((invite) => (
                <div
                  className="section-row"
                  key={invite.id}
                  style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}
                >
                  <strong>{invite.propertyName || 'General application'}</strong>
                  <div className="muted" style={{ fontSize: 13 }}>
                    Created {invite.createdAt.toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <code style={{ fontSize: 12 }}>/apply/{invite.token}</code>
                    <InviteEmailLink token={invite.token} propertyName={invite.propertyName} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          {shares.length === 0 ? (
            <p className="muted">
              No applications yet. When a tenant shares their Rental Passport with{' '}
              {user.email}, it will show up here.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Income</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shares.map((share) => (
                  <tr key={share.id}>
                    <td>
                      {[share.passport.firstName, share.passport.lastName].filter(Boolean).join(' ') ||
                        share.tenant.email}
                    </td>
                    <td>{share.passport.annualIncome || '—'}</td>
                    <td>{share.createdAt.toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${share.status.toLowerCase()}`}>
                        {share.status}
                      </span>
                    </td>
                    <td>
                      <Link className="btn btn-secondary btn-sm" href={`/share/${share.token}`}>
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
