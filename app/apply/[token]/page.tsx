import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { PACKAGES } from '@/lib/packages';

export default async function ApplyInvitePage({ params }: { params: { token: string } }) {
  const invite = await db.landlordInvite.findUnique({
    where: { token: params.token },
    include: { landlord: true }
  });

  if (!invite) notFound();
  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return (
      <div className="shell" style={{ paddingTop: 60 }}>
        <div className="card">
          <h1 style={{ fontSize: 20 }}>This invite link has expired</h1>
          <p className="muted">Ask the landlord to send a new one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shell" style={{ maxWidth: 640, paddingTop: 60 }}>
      <div className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 22 }}>You&apos;ve been invited to apply</h1>
        <p className="muted">
          {invite.landlord.email} has invited you to build a Rental Passport
          {invite.propertyName ? (
            <>
              {' '}
              for <strong>{invite.propertyName}</strong>
            </>
          ) : null}
          .
        </p>
        <p className="muted" style={{ fontSize: 14 }}>
          Build one verified application, pay once for screening, then share it instantly &mdash;
          no separate paperwork needed.
        </p>
      </div>

      <div className="card">
        <h2 style={{ textAlign: 'center' }}>{PACKAGES.COMPLETE.name}</h2>
        <p className="price-tag" style={{ textAlign: 'center' }}>{PACKAGES.COMPLETE.priceLabel}</p>
        <ul className="check-list" style={{ maxWidth: 360, margin: '0 auto 20px' }}>
          <li>Credit report</li>
          <li>Criminal history</li>
          <li>Eviction history</li>
          <li>Employment and income verification</li>
          <li>Current address and rental history</li>
        </ul>
        <div style={{ textAlign: 'center' }}>
          <Link className="btn btn-primary" href={`/register?invite=${invite.token}&package=COMPLETE`}>
            Get started
          </Link>
        </div>
        <p className="muted" style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
