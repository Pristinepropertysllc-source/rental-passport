import Link from 'next/link';

export function PublicNav() {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <Link className="brand" href="/">
          Rental Passport
        </Link>
        <div className="nav-links">
          <Link href="/login">Log in</Link>
          <Link className="btn btn-primary btn-sm" href="/register">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
