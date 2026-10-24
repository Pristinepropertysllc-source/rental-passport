'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { STATE_LAWS } from '@/lib/stateLaws';

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah',
  'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const STORAGE_KEY = 'rp-renting-state';

function messageFor(state: string) {
  if (state === 'Colorado') {
    return "Good news: Colorado landlords must accept a recent portable screening report, and can't charge you an application fee when you provide one.";
  }
  if (state === 'California' || state === 'Maryland' || state === 'Washington') {
    return `Good news: ${state} has a reusable screening report law. Landlords who accept your report can't charge you an application fee for it.`;
  }
  if (state === 'New York') {
    return 'Good news: in New York, the background check fee must be waived when you bring a check from the last 30 days.';
  }
  if (state === 'Rhode Island') {
    return "Good news: in Rhode Island, you can't be charged for a background check when you bring a qualifying report from the last 90 days.";
  }
  return "Rental Passport still saves you time: one application and one link for every landlord. Many landlords accept a renter's own recent screening report.";
}

export function StatePicker() {
  const [state, setState] = useState('');

  // Restore the choice made earlier in this visit.
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (saved && STATES.includes(saved)) setState(saved);
    } catch {
      /* storage can be blocked; the picker still works */
    }
  }, []);

  function choose(value: string) {
    setState(value);
    try {
      if (value) window.sessionStorage.setItem(STORAGE_KEY, value);
      else window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  const hasLaw = STATE_LAWS.some((s) => s.name === state);

  return (
    <div className="sp-card">
      <label className="sp-title" htmlFor="sp-state">
        What state are you renting in?
      </label>
      <select id="sp-state" className="sp-select" value={state} onChange={(e) => choose(e.target.value)}>
        <option value="">Choose your state</option>
        {STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {state && (
        <div className="sp-result" aria-live="polite">
          <p className="sp-msg">{messageFor(state)}</p>
          <div className="sp-actions">
            {hasLaw && (
              <a className="sp-link" href="#state-laws">
                See the law &rarr;
              </a>
            )}
            <Link className="btn btn-primary" href="/register">
              Build my Rental Passport
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
