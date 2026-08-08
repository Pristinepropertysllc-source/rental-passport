import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { Nav } from '@/components/Nav';

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

  return (
    <>
      <Nav email={user.email} role="LANDLORD" />
      <div className="shell" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1>Applicants</h1>
        <p className="muted">Rental Passport applications shared with you.</p>

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
