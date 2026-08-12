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
        <h2 style={{ textAlign: 'center' }}>Choose your screening package to get started</h2>
        <div className="grid-2">
          <div className="pricing-card">
            <h3>Essential Screening</h3>
            <p className="price-tag">{PACKAGES.ESSENTIAL.priceLabel}</p>
            <ul className="check-list">
              <li>Credit Check</li>
              <li>Enhanced Landlord Search</li>
              <li>National Criminal Search</li>
            </ul>
            <Link
              className="btn btn-primary"
              href={`/register?invite=${invite.token}&package=ESSENTIAL`}
            >
              Get started
            </Link>
          </div>
          <div className="pricing-card pricing-card-highlight">
            <h3>Complete Screening</h3>
            <p className="price-tag">{PACKAGES.COMPLETE.priceLabel}</p>
            <ul className="check-list">
              <li>Credit Check</li>
              <li>Enhanced Landlord Search</li>
              <li>National Criminal Search</li>
              <li>Identity Verification</li>
            </ul>
            <Link
              className="btn btn-primary"
              href={`/register?invite=${invite.token}&package=COMPLETE`}
            >
              Get started
            </Link>
          </div>
        </div>
        <p className="muted" style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
