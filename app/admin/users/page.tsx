import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { Nav } from '@/components/Nav';
import { promoteToAdminAction, demoteAdminAction, deleteUserAction } from '@/lib/actions/admin';
import { ConfirmDeleteForm } from '@/components/ConfirmDeleteForm';

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'ADMIN') redirect('/login');

  const q = (searchParams.q || '').trim();

  const users = q
    ? await db.user.findMany({
        where: { email: { contains: q, mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' },
        take: 25
      })
    : [];

  const admins = await db.user.findMany({
    where: { role: 'ADMIN' },
    orderBy: { createdAt: 'asc' }
  });

  return (
    <>
      <Nav email={admin.email} role="ADMIN" />
      <div className="shell" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1>Admin users</h1>
        <p className="muted">
          Promote a user to admin, or remove admin access. Only existing admins can do this.
        </p>

        <div className="card">
          <h2>Current admins</h2>
          <table>
            <thead>
              <tr><th>Email</th><th></th></tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id}>
                  <td>{a.email}{a.id === admin.id ? ' (you)' : ''}</td>
                  <td>
                    {a.id !== admin.id && (
                      <form action={demoteAdminAction}>
                        <input type="hidden" name="userId" value={a.id} />
                        <button className="btn btn-danger btn-sm" type="submit">
                          Remove admin access
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Promote a user</h2>
          <form style={{ marginBottom: 16 }}>
            <div className="field">
              <label>Search by email</label>
              <input name="q" defaultValue={q} placeholder="user@example.com" />
            </div>
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </form>

          {q && (
            users.length === 0 ? (
              <p className="muted">No users found matching &quot;{q}&quot;.</p>
            ) : (
              <table>
                <thead>
                  <tr><th>Email</th><th>Role</th><th></th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        {u.role !== 'ADMIN' && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <form action={promoteToAdminAction}>
                              <input type="hidden" name="email" value={u.email} />
                              <button className="btn btn-secondary btn-sm" type="submit">
                                Make admin
                              </button>
                            </form>
                            <ConfirmDeleteForm
                              action={deleteUserAction}
                              hiddenName="userId"
                              hiddenValue={u.id}
                              buttonLabel="Delete account"
                              confirmMessage={`Permanently delete ${u.email}? This deletes their application, documents, and messages, and cannot be undone.`}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </>
  );
}
