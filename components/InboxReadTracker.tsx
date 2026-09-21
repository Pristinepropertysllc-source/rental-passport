'use client';

import { useEffect, useRef } from 'react';

export function InboxReadTracker({
  hasUnread,
  onMount
}: {
  hasUnread: boolean;
  onMount: () => void | Promise<void>;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (!hasUnread || fired.current) return;
    fired.current = true;
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
