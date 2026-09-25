'use client';

import { useRef, useState, useEffect } from 'react';

type Status = 'idle' | 'pending' | 'saved';

export function AutoSaveForm({
  action,
  children
}: {
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  function scheduleSave() {
    setStatus('pending');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 700);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <form
      ref={formRef}
      action={action}
      onBlur={(e) => {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') scheduleSave();
      }}
      onSubmit={() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 2000);
      }}
    >
      {children}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
        <button className="btn btn-secondary btn-sm" type="submit">
          Save now
        </button>
        <span className="muted" style={{ fontSize: 13 }}>
          {status === 'pending' && 'Saving...'}
          {status === 'saved' && '\u2713 Saved'}
          {status === 'idle' && 'Changes save automatically as you go'}
        </span>
      </div>
    </form>
  );
}
