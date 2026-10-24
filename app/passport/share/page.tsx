import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { Nav } from '@/components/Nav';
import { ShareButtons } from '@/components/ShareButtons';
import { buildShareMessage, shareLink } from '@/lib/shareMessage';
import { screeningDate, formatLongDate } from '@/lib/screeningDate';
import { revokeShareAction } from '@/lib/actions/share';
import { applicationComplete } from '@/lib/passport';
import { ShareForm } from '@/components/pixel/ShareForm';
import { QueryParamEventTracker } from '@/components/pixel/PixelTrackers';
import { PACKAGES } from '@/lib/packages';

export default async function SharePage({
  searchParams
}: {
  searchParams: { paid?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'TENANT') redirect('/landlord/dashboard');

  const passport = await db.passport.findUnique({
    where: { userId: user.id },
    include: {
      references: true,
      documents: true,
      occupants: true,
      pets: true,
      vehicles: true,
      rentalHistory: true,
      employment: true,
      screeningItems: true
    }
  });
  if (!passport) redirect('/passport');
  if (!applicationComplete(passport)) redirect('/dashboard');
  if (!passport.packagePaid) redirect('/passport/checkout');

  const shares = await db.share.findMany({
    where: { tenantId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  const date = screeningDate(passport.screeningItems, passport.documents);
  const dateLabel = date ? formatLongDate(date) : null;
  const methodLabel: Record<string, string> = {
    TEXT: 'Texted',
    EMAIL: 'Emailed',
    SHARE: 'Shared',
    COPY: 'Link copied'
  };
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/New_York' });

  return (
    <>
      <Nav email={user.email} role="TENANT" />
      <div className="shell" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1>Send your Rental Passport to a landlord</h1>
        <p className="muted">
          One link with your application, documents and screening. Send it to as many landlords as
          you want.
        </p>

        {searchParams.paid === '1' && (
          <div className="card" style={{ background: '#e6f2e6', borderColor: 'var(--ok)' }}>
            <strong style={{ color: 'var(--ok)' }}>Payment received.</strong> You can now share
            your passport with landlords at no additional cost.
          </div>
        )}

        <Suspense fallback={null}>
          <QueryParamEventTracker
            paramName="paid"
            paramValue="1"
            event="Purchase"
            stripParamAfterFire
            params={{
              value: passport.packageType && passport.packageType in PACKAGES
                ? PACKAGES[passport.packageType as keyof typeof PACKAGES].priceCents / 100
                : PACKAGES.COMPLETE.priceCents / 100,
              currency: 'USD'
            }}
          />
        </Suspense>

        <div className="card">
          <h2>Who are you sending it to?</h2>
          <ShareForm />
        </div>

        <div className="card">
          <h2>Shared with</h2>
          {shares.length === 0 ? (
            <p className="muted">No shares yet.</p>
          ) : (
            <div className="section-list">
              {shares.map((share) => {
                const link = shareLink(share.token);
                const message = buildShareMessage({
                  firstName: passport.firstName,
                  property: share.landlordName,
                  screeningDate: dateLabel,
                  link,
                  state: passport.state
                });
                const title = share.landlordName || share.landlordEmail || share.landlordPhone || 'Landlord';
                const contact = [share.landlordEmail, share.landlordPhone].filter(Boolean).join(' \u00b7 ');
                return (
                  <div className="section-row" key={share.id} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <strong>{title}</strong>
                      <span className={`badge badge-${share.status.toLowerCase()}`}>
                        {share.status}
                      </span>
                    </div>
                    {contact && contact !== title && (
                      <div className="muted" style={{ fontSize: 13 }}>{contact}</div>
                    )}
                    <div className="muted" style={{ fontSize: 13 }}>
                      Created {fmt(share.createdAt)}
                      {share.sentVia && share.sentAt
                        ? ` \u00b7 ${methodLabel[share.sentVia] ?? 'Sent'} ${fmt(share.sentAt)}`
                        : ' \u00b7 Not sent yet'}
                      {share.viewedAt ? ` \u00b7 Viewed ${fmt(share.viewedAt)}` : ' \u00b7 Not viewed yet'}
                      {share.expiresAt ? ` \u00b7 Expires ${fmt(share.expiresAt)}` : ''}
                    </div>
                    <ShareButtons
                      token={share.token}
                      link={link}
                      message={message}
                      phone={share.landlordPhone}
                      email={share.landlordEmail}
                      compact
                    />
                    <form action={revokeShareAction}>
                      <input type="hidden" name="id" value={share.id} />
                      <button className="btn btn-danger btn-sm" type="submit">
                        Revoke access
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
