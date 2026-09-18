'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackMetaEvent } from '@/lib/metaPixel';

/**
 * Fires a Meta event exactly once when this component mounts. Used for
 * events tied to "the user is now on this page" (e.g. ViewContent,
 * StartApplication, InitiateCheckout) where the page itself is only
 * reached through the real flow.
 */
export function MountEventTracker({
  event,
  params,
  custom = false
}: {
  event: string;
  params?: Record<string, unknown>;
  custom?: boolean;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackMetaEvent(event, params, custom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function ViewContentTracker({ contentName }: { contentName: string }) {
  return <MountEventTracker event="ViewContent" params={{ content_name: contentName }} />;
}

/**
 * Fires a Meta event exactly once, only when a specific URL search param
 * matches an expected value -- used for events that must only fire after a
 * real server-side success (registration, payment), signaled via a query
 * param on the post-success redirect (e.g. ?registered=1, ?paid=1).
 *
 * Wrapped internally in Suspense by the caller is not required here since
 * this stays a small leaf component, but useSearchParams still needs a
 * Suspense boundary above it in the page tree per Next.js requirements.
 */
export function QueryParamEventTracker({
  paramName,
  paramValue,
  event,
  params,
  custom = false
}: {
  paramName: string;
  paramValue: string;
  event: string;
  params?: Record<string, unknown>;
  custom?: boolean;
}) {
  const searchParams = useSearchParams();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (searchParams.get(paramName) !== paramValue) return;
    fired.current = true;
    trackMetaEvent(event, params, custom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
}
