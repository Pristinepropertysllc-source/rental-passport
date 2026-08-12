'use client';

import { useEffect, useState } from 'react';

export function InviteEmailLink({ token, propertyName }: { token: string; propertyName: string | null }) {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    const link = `${window.location.origin}/apply/${token}`;
    const subject = encodeURIComponent(
      propertyName ? `Apply for ${propertyName}` : 'Rental application invite'
    );
    const body = encodeURIComponent(
      `Hi,\n\nPlease use the link below to build your Rental Passport and apply${
        propertyName ? ` for ${propertyName}` : ''
      }:\n\n${link}\n\nThanks!`
    );
    setHref(`mailto:?subject=${subject}&body=${body}`);
  }, [token, propertyName]);

  if (!href) return null;

  return (
    <a className="btn btn-secondary btn-sm" href={href}>
      Email this link
    </a>
  );
}
