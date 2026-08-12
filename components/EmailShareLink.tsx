'use client';

import { useEffect, useState } from 'react';

export function EmailShareLink({ landlordEmail, token }: { landlordEmail: string; token: string }) {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    const link = `${window.location.origin}/share/${token}`;
    const subject = encodeURIComponent('Rental application from a tenant');
    const body = encodeURIComponent(
      `Hi,\n\nI'd like to share my Rental Passport application with you. You can view it here:\n\n${link}\n\nThanks!`
    );
    setHref(`mailto:${landlordEmail}?subject=${subject}&body=${body}`);
  }, [landlordEmail, token]);

  if (!href) return null;

  return (
    <a className="btn btn-secondary btn-sm" href={href}>
      Email this link
    </a>
  );
}
