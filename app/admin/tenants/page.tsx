import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { overallCompletion } from '@/lib/passport';
import { Nav } from '@/components/Nav';

export default async function AdminTenantsPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'ADMIN') redirect('/login');

  const q = (searchParams.q || '').trim();

  const tenants = await db.user.findMany({
    where: {
      role: 'TENANT',
      ...(q
        ? {
            OR: [
              { email: { contains: q, mode: 'insensitive' } },
              { passport: { firstName: { contains: q, mode: 'insensitive' } } },
              { passport: { lastName: { contains: q, mode: 'insensitive' } } },
              { passport: { id: { equals: q } } }
            ]
          }
        : {})
    },
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
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <>
      <Nav email={admin.email} role="ADMIN" />
      <div className="shell" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1>Tenants</h1>
        <p className="muted">Admin &middot; {admin.email}</p>

      <div className="card">
        <form>
          <div className="field">
            <label>Search by name, email, or application ID</label>
            <input name="q" defaultValue={q} />
          </div>
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>
      </div>

      <div className="card">
        {tenants.length === 0 ? (
          <p className="muted">No tenants found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Completion</th>
                <th>Payment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id}>
                  <td>
                    {t.passport
                      ? [t.passport.firstName, t.passport.lastName].filter(Boolean).join(' ') || '—'
                      : '—'}
                  </td>
                  <td>{t.email}</td>
                  <td>{t.passport ? `${overallCompletion(t.passport)}%` : 'No passport'}</td>
                  <td>
                    {t.passport?.packagePaid ? (
                      <span className="badge badge-approved">Paid</span>
                    ) : (
                      <span className="badge badge-pending">Unpaid</span>
                    )}
                  </td>
                  <td>
                    {t.passport && (
                      <Link className="btn btn-secondary btn-sm" href={`/admin/tenants/${t.id}`}>
                        Open
                      </Link>
                    )}
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
