'use client';

import { useEffect, useState } from 'react';

export function InviteEmailLink({ token, propertyName }: { token: string; propertyName: string | null }) {
  const [href, setHref] = useState<string | null>(null);
  const [link, setLink] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = `https://www.myrentalpassport.net/apply/${token}`;
    setLink(url);
    const subject = encodeURIComponent(
      propertyName ? `Apply for ${propertyName}` : 'Rental application invite'
    );
    const body = encodeURIComponent(
      `Hi,\n\nPlease use the link below to build your Rental Passport and apply${
        propertyName ? ` for ${propertyName}` : ''
      }:\n\n${url}\n\nThanks!`
    );
    setHref(`mailto:?subject=${subject}&body=${body}`);
  }, [token, propertyName]);

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
