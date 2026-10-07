'use client';

import { useEffect, useRef, useState } from 'react';
import { trackMetaEvent } from '@/lib/metaPixel';

/**
 * The "Pay & continue" form on the checkout page. Fires a custom PayClicked
 * Meta event at the moment the renter clicks Pay, then continues on to the
 * Stripe checkout route. The submit is delayed a fraction of a second so the
 * pixel request can leave the browser before the page navigates away, and
 * further clicks are ignored while the first one is in flight (which also
 * protects against double-clicks creating two Stripe sessions).
 *
 * No applicant data is sent -- only the price and currency.
 */
export function PayForm({ label, value }: { label: string; value: number }) {
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);

  // If the browser restores this page from its back/forward cache (e.g. the
  // renter hits "back" from Stripe), reset so the Pay button works again.
  useEffect(() => {
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) {
        submitting.current = false;
        setPending(false);
      }
    }
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  return (
    <form
      action="/api/checkout-package"
      method="POST"
      onSubmit={(e) => {
        e.preventDefault();
        if (submitting.current) return;
        submitting.current = true;
        setPending(true);
        const form = e.currentTarget;
        trackMetaEvent('PayClicked', { value, currency: 'USD' }, true);
        setTimeout(() => form.submit(), 250);
      }}
    >
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {label}
      </button>
    </form>
  );
}
