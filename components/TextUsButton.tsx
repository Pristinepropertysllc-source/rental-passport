'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const PHONE_DISPLAY = '(240) 520-7174';
const SMS_HREF = 'sms:+12405207174';
const TEL_HREF = 'tel:+12405207174';

// Logged-in and admin areas have their own messaging, so the button stays off them.
function isHidden(pathname: string) {
  return (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/passport') ||
    pathname === '/landlord' ||
    pathname.startsWith('/landlord/')
  );
}

export function TextUsButton() {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (isHidden(pathname)) return null;

  // Phones (touch) go straight to the text message; desktops show the number.
  function handleClick(e: React.MouseEvent) {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      e.preventDefault();
      setOpen((o) => !o);
    }
  }

  return (
    <div className="text-us" ref={wrapRef}>
      {open && (
        <div className="text-us-pop" role="dialog" aria-label="Contact us">
          Call or text <a href={TEL_HREF}>{PHONE_DISPLAY}</a>
        </div>
      )}
      <a className="text-us-btn" href={SMS_HREF} onClick={handleClick} aria-label="Text us">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8l-4.3 3.6A.5.5 0 0 1 3 21.2V5a2 2 0 0 1 1-2z" />
        </svg>
        <span>Text us</span>
      </a>
    </div>
  );
}
