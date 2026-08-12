import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { overallCompletion } from '@/lib/passport';
import { SCREENING_CATEGORIES, SCREENING_STATUSES } from '@/lib/screening';
import { Nav } from '@/components/Nav';
import { PrintableApplication } from '@/components/PrintableApplication';
import { AdminScreeningUpload } from '@/components/AdminScreeningUpload';
import {
  updateScreeningStatusAction,
  updateAdminNotesAction
} from '@/lib/actions/admin';

export default async function AdminTenantDetailPage({ params }: { params: { id: string } }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'ADMIN') redirect('/login');

  const tenant = await db.user.findUnique({
    where: { id: params.id },
    include: {
      passport: {
        include: {
          references: true,
          documents: true,
          occupants: true,
          pets: true,
          vehicles: true,
          rentalHistory: true,
          employment: true,
          screeningItems: true,
          auditLogs: { orderBy: { createdAt: 'desc' }, take: 30 }
        }
      }
    }
  });
  if (!tenant || !tenant.passport) notFound();

  const passport = tenant.passport;
  const percent = overallCompletion(passport);
  const applicantName = [passport.firstName, passport.lastName].filter(Boolean).join(' ') || tenant.email;
  const itemFor = (category: string) => passport.screeningItems.find((i) => i.category === category);

  return (
    <>
      <Nav email={admin.email} role="ADMIN" />
      <div className="shell" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <Link href="/admin/tenants" className="muted" style={{ fontSize: 13 }}>
        &larr; Back to tenants
      </Link>
      <h1>{[passport.firstName, passport.lastName].filter(Boolean).join(' ') || tenant.email}</h1>
      <p className="muted">{tenant.email}</p>

      <div className="card">
        <h2>Overview</h2>
        <table>
          <tbody>
            <tr><td>Application completion</td><td>{percent}%</td></tr>
            <tr><td>Package</td><td>{passport.packageType || '—'}</td></tr>
            <tr><td>Payment status</td><td>{passport.packagePaid ? 'Paid' : 'Unpaid'}</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Full application</h2>
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
          Use this to run the screening report at{' '}
          <a href="https://www.chcked.com/newreport" target="_blank" rel="noreferrer">
            chcked.com
          </a>
          . Contains sensitive data (SSN) &mdash; admin access only.
        </p>
        <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <PrintableApplication passport={passport} applicantName={applicantName} email={tenant.email} />
        </div>
      </div>

      <div className="card">
        <h2>Uploaded documents</h2>
        {passport.documents.length === 0 ? (
          <p className="muted">None uploaded.</p>
        ) : (
          <div className="doc-list">
            {passport.documents.map((d) => (
              <div className="doc-row" key={d.id}>
                <span><span className="tag">{d.type}</span> {d.filename}</span>
                <a href={`/api/doc/${d.id}`} target="_blank" rel="noreferrer">View</a>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Screening report</h2>
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
          Upload the combined report from CHCKED once &mdash; it covers Credit, Background, and
          Landlord Search, and marks all three as completed.
        </p>
        <div style={{ marginBottom: 20 }}>
          <AdminScreeningUpload passportId={passport.id} />
        </div>

        {SCREENING_CATEGORIES.map((cat) => {
          const item = itemFor(cat.key);
          return (
            <div
              key={cat.key}
              style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}
            >
              <strong>{cat.label}</strong>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '8px 0' }}>
                <span className="muted" style={{ fontSize: 13 }}>Status:</span>
                <form action={updateScreeningStatusAction} style={{ display: 'flex', gap: 8 }}>
                  <input type="hidden" name="passportId" value={passport.id} />
                  <input type="hidden" name="category" value={cat.key} />
                  <select name="status" defaultValue={item?.status || 'PENDING'}>
                    {SCREENING_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button className="btn btn-secondary btn-sm" type="submit">
                    Update status
                  </button>
                </form>
              </div>
              {item?.documentId && (
                <a href={`/api/doc/${item.documentId}`} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
                  View report
                </a>
              )}
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2>Internal notes</h2>
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
          Visible to admins only &mdash; never shown to the tenant or landlords.
        </p>
        <form action={updateAdminNotesAction}>
          <input type="hidden" name="passportId" value={passport.id} />
          <textarea
            name="notes"
            defaultValue={passport.internalNotes || ''}
            rows={4}
            style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'inherit' }}
          />
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} type="submit">
            Save notes
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Account activity</h2>
        {passport.auditLogs.length === 0 ? (
          <p className="muted">No activity yet.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Action</th><th>By</th><th>When</th></tr>
            </thead>
            <tbody>
              {passport.auditLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.action}</td>
                  <td>{log.adminEmail}</td>
                  <td>{log.createdAt.toLocaleString()}</td>
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
