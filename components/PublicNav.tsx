import Link from 'next/link';

export function PublicNav() {
  return (
    <div className="topbar public-nav">
      <div className="topbar-inner">
        <Link className="brand" href="/">
          <img className="nav-logo" src="/logo.svg" alt="Rental Passport" />
        </Link>
        <div className="nav-links">
          <Link className="public-nav-about" href="/about">About</Link>
          <Link href="/login">Log in</Link>
          <Link className="btn btn-primary btn-sm" href="/register">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
