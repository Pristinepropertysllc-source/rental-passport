'use client';

import { useEffect, useState } from 'react';
import { recordShareSentAction } from '@/lib/actions/share';
import { smsNumber } from '@/lib/shareMessage';

// Text it / Email it / Share / Copy link for one share link. "Share" only
// appears on browsers that support the native share sheet (most phones).
export function ShareButtons({
  token,
  link,
  message,
  phone,
  email,
  compact = false
}: {
  token: string;
  link: string;
  message: string;
  phone?: string | null;
  email?: string | null;
  compact?: boolean;
}) {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const record = (method: string) => {
    recordShareSentAction(token, method).catch(() => {});
  };

  const number = smsNumber(phone);
  const smsHref = `sms:${number}?&body=${encodeURIComponent(message)}`;
  const mailHref = `mailto:${email ?? ''}?subject=${encodeURIComponent(
    'My Rental Passport'
  )}&body=${encodeURIComponent(message)}`;

  async function handleShare() {
    try {
      await navigator.share({ title: 'My Rental Passport', text: message });
      record('SHARE');
    } catch {
      // The renter closed the share sheet; nothing to record.
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      record('COPY');
    } catch {
      // Clipboard can be blocked; the link is also shown on screen to copy by hand.
    }
  }

  return (
    <div className={`share-actions${compact ? ' share-actions-compact' : ''}`}>
      <a className="btn btn-primary" href={smsHref} onClick={() => record('TEXT')}>
        Text it
      </a>
      <a className="btn btn-primary" href={mailHref} onClick={() => record('EMAIL')}>
        Email it
      </a>
      {canShare && (
        <button className="btn btn-secondary" type="button" onClick={handleShare}>
          Share
        </button>
      )}
      <button className="btn btn-secondary" type="button" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}
