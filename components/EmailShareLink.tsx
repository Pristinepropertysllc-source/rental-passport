'use client';

import { useEffect, useState } from 'react';

export function EmailShareLink({ landlordEmail, token }: { landlordEmail: string; token: string }) {
  const [href, setHref] = useState<string | null>(null);
  const [link, setLink] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = `https://www.myrentalpassport.net/share/${token}`;
    setLink(url);
    const subject = encodeURIComponent('Rental application from a tenant');
    const body = encodeURIComponent(
      `Hi,\n\nI'd like to share my Rental Passport application with you. You can view it here:\n\n${url}\n\nThanks!`
    );
    setHref(`mailto:${landlordEmail}?subject=${subject}&body=${body}`);
  }, [landlordEmail, token]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail in some contexts; the link text is still
      // visible and selectable manually as a fallback.
    }
  }

  if (!href) return null;

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <a className="btn btn-secondary btn-sm" href={href}>
        Email this link
      </a>
      <button className="btn btn-secondary btn-sm" type="button" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}
