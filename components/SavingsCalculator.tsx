'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PACKAGES } from '@/lib/packages';

const PRICE = PACKAGES.COMPLETE.priceCents / 100;

function money(n: number) {
  return Number.isInteger(n) ? `$${n.toLocaleString('en-US')}` : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function SavingsCalculator() {
  const [places, setPlaces] = useState(4);
  const [feeText, setFeeText] = useState('50');

  const fee = Math.min(Math.max(parseFloat(feeText) || 0, 0), 1000);
  const separate = places * fee;
  const savings = Math.round((separate - PRICE) * 100) / 100;

  return (
    <div className="sc-card">
      <div className="sc-controls">
        <div className="field">
          <label htmlFor="sc-places">
            How many places will you apply to? <strong className="sc-places">{places}</strong>
          </label>
          <input
            id="sc-places"
            type="range"
            min={1}
            max={10}
            step={1}
            value={places}
            onChange={(e) => setPlaces(Number(e.target.value))}
          />
        </div>
        <div className="field sc-fee">
          <label htmlFor="sc-fee">Typical application fee</label>
          <div className="sc-fee-input">
            <span aria-hidden="true">$</span>
            <input
              id="sc-fee"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={feeText}
              onChange={(e) => setFeeText(e.target.value.replace(/[^\d.]/g, '').slice(0, 7))}
            />
          </div>
        </div>
      </div>

      <div className="sc-compare">
        <div className="sc-col">
          <span className="sc-col-label">Separate applications</span>
          <strong>{money(separate)}</strong>
        </div>
        <div className="sc-col sc-col-brand">
          <span className="sc-col-label">Rental Passport</span>
          <strong>{money(PRICE)} once</strong>
        </div>
      </div>

      <p className="sc-result" aria-live="polite">
        {savings > 0 ? `You could save ${money(savings)}` : `Plus: one application instead of ${places}`}
      </p>
      <p className="muted sc-note">
        Estimate based on the fee you enter. Application fees vary by landlord and state.
      </p>
      <Link className="btn btn-primary" href="/register">
        Build my Rental Passport
      </Link>
    </div>
  );
}
