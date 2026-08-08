import Link from 'next/link';
import { logoutAction } from '@/lib/actions/auth';

export function Nav({ email, role }: { email: string; role: 'TENANT' | 'LANDLORD' | 'ADMIN' }) {
  const homeHref = role === 'TENANT' ? '/dashboard' : role === 'LANDLORD' ? '/landlord/dashboard' : '/admin/tenants';

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <Link className="brand" href={homeHref}>
          Rental Passport
        </Link>
        <div className="nav-links">
          {role === 'TENANT' && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/passport">My Passport</Link>
              <Link href="/passport/print">Print</Link>
              <Link href="/passport/share">Share</Link>
            </>
          )}
          {role === 'LANDLORD' && <Link href="/landlord/dashboard">Applicants</Link>}
          {role === 'ADMIN' && (
            <>
              <Link href="/admin/tenants">Tenants</Link>
              <Link href="/admin/users">Users</Link>
            </>
          )}
          <span className="muted" style={{ fontSize: 13 }}>
            {email}
          </span>
          <form action={logoutAction}>
            <button className="btn btn-secondary btn-sm" type="submit">
              Log out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
