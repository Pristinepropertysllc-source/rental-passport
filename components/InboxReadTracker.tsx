'use client';

import { useEffect, useRef } from 'react';
import { markMessagesReadAction } from '@/lib/actions/messages';

export function InboxReadTracker({ hasUnread }: { hasUnread: boolean }) {
  const fired = useRef(false);

  useEffect(() => {
    if (!hasUnread || fired.current) return;
    fired.current = true;
    markMessagesReadAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
