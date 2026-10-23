'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export type PassportStep = {
  id: string;
  label: string;
  /** Extra #hash values that should open this step. */
  hashes?: string[];
  content: React.ReactNode;
};

export function PassportSteps({ steps }: { steps: PassportStep[] }) {
  const [index, setIndex] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const indexRef = useRef(0);
  indexRef.current = index;

  // Open the step named in the URL hash (e.g. /passport#employment), and follow later hash changes.
  useEffect(() => {
    function applyHash() {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const i = steps.findIndex((s) => s.id === hash || s.hashes?.includes(hash));
      if (i >= 0) setIndex(i);
    }
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Submit any autosave forms on the step being left. The panels stay mounted
  // (just hidden), so the save finishes in the background.
  function saveCurrentStep() {
    const panel = panelRefs.current[indexRef.current];
    panel?.querySelectorAll<HTMLFormElement>('form[data-autosave]').forEach((f) => f.requestSubmit());
  }

  function go(next: number) {
    if (next < 0 || next >= steps.length || next === indexRef.current) return;
    saveCurrentStep();
    (document.activeElement as HTMLElement | null)?.blur?.();
    setIndex(next);
    try {
      window.history.replaceState(null, '', `#${steps[next].id}`);
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  // On phones, tapping a button while a field is focused first closes the keyboard, which
  // can shift the layout and swallow the click (so it takes two taps). When a field is
  // focused we act on pointer-down instead, and ignore the click that follows.
  const firedOnDown = useRef(false);
  function pressProps(target: number) {
    return {
      onPointerDown: (e: React.PointerEvent) => {
        const el = document.activeElement as HTMLElement | null;
        if (el && /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) {
          e.preventDefault();
          firedOnDown.current = true;
          window.setTimeout(() => {
            firedOnDown.current = false;
          }, 700);
          go(target);
        }
      },
      onClick: () => {
        if (firedOnDown.current) {
          firedOnDown.current = false;
          return;
        }
        go(target);
      }
    };
  }

  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  return (
    <div>
      <p className="step-label">
        Step {index + 1} of {steps.length} &middot; <strong>{steps[index].label}</strong>
      </p>
      <div className="step-dots" aria-hidden="true">
        {steps.map((s, i) => (
          <span key={s.id} className={`step-dot${i < index ? ' step-dot-done' : ''}${i === index ? ' step-dot-current' : ''}`} />
        ))}
      </div>

      {steps.map((s, i) => (
        <div
          key={s.id}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
          hidden={i !== index}
        >
          {s.content}
        </div>
      ))}

      <div className="step-nav">
        {!isFirst && (
          <button type="button" className="btn btn-secondary" {...pressProps(index - 1)}>
            Back
          </button>
        )}
        {!isLast ? (
          <button type="button" className="btn btn-primary" {...pressProps(index + 1)}>
            Next
          </button>
        ) : (
          <Link className="btn btn-primary" href="/dashboard" onClick={saveCurrentStep}>
            Back to dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
