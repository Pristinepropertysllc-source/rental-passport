import Link from 'next/link';

export function AuthLogo() {
  return (
    <div style={{ textAlign: 'center', marginBottom: 20 }}>
      <Link href="/" style={{ display: 'inline-block' }}>
        <img src="/logo.svg" alt="Rental Passport" style={{ height: 90, display: 'block' }} />
      </Link>
    </div>
  );
}
