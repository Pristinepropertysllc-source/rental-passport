'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function WelcomeModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  const shouldShow = searchParams.get('registered') === '1' && !dismissed;
  if (!shouldShow) return null;

  function close() {
    setDismissed(true);
    // Strip the query param so refreshing the dashboard doesn't reopen it.
    router.replace('/dashboard');
  }

  return (
    <div className="welcome-modal-overlay" role="dialog" aria-modal="true" aria-label="Welcome">
      <div className="welcome-modal">
        <h2 style={{ marginTop: 0 }}>Welcome to Rental Passport!</h2>
        <p className="muted" style={{ marginTop: 0, fontWeight: 600 }}>
          Let&apos;s get your rental application ready to share.
        </p>
        <p className="muted" style={{ fontSize: 14 }}>
          You&apos;ve created your account. Now we&apos;ll help you build your Rental Passport
          step by step. Once completed, your rental information, documents, and screening
          information will be organized in one place so you&apos;re ready when you find a rental
          you&apos;re interested in.
        </p>

        <div className="welcome-modal-steps">
          <span className="welcome-modal-step">1. Application</span>
          <span className="welcome-modal-arrow">&rarr;</span>
          <span className="welcome-modal-step">2. Documents</span>
          <span className="welcome-modal-arrow">&rarr;</span>
          <span className="welcome-modal-step">3. Screening</span>
          <span className="welcome-modal-arrow">&rarr;</span>
          <span className="welcome-modal-step">4. Ready to Share</span>
        </div>

        <p className="welcome-modal-time">
          &#9201; Most renters can complete setup in about 10&ndash;15 minutes. You can save your
          progress and come back anytime.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
          <Link className="btn btn-primary" href="/passport" onClick={close}>
            Start My Rental Passport &rarr;
          </Link>
          <button className="btn btn-secondary" type="button" onClick={close}>
            I&apos;ll do this later
          </button>
        </div>
      </div>
    </div>
  );
}
