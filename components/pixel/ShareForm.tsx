'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { createShareAction } from '@/lib/actions/share';
import { trackMetaEvent } from '@/lib/metaPixel';
import { ShareButtons } from '@/components/ShareButtons';

function ShareFormInner({ onReset }: { onReset: () => void }) {
  const [state, formAction] = useFormState(createShareAction, undefined);
  const fired = useRef(false);

  useEffect(() => {
    if (state?.success && !fired.current) {
      fired.current = true;
      trackMetaEvent('Share', undefined, true);
    }
  }, [state]);

  if (state?.success && state.share) {
    const s = state.share;
    return (
      <div>
        <p style={{ marginTop: 0 }}>
          <strong>Your link for {s.landlordName} is ready.</strong>{' '}
          {s.emailed ? `We also emailed it to ${s.landlordEmail}.` : 'Send it now:'}
        </p>
        <ShareButtons
          token={s.token}
          link={s.link}
          message={s.message}
          phone={s.landlordPhone}
          email={s.landlordEmail}
        />
        <p className="muted" style={{ fontSize: 12, wordBreak: 'break-all', margin: '12px 0 14px' }}>
          {s.link}
        </p>
        <button className="btn btn-secondary btn-sm" type="button" onClick={onReset}>
          Send to another landlord
        </button>
      </div>
    );
  }

  return (
    <form action={formAction}>
      {state?.error && <div className="error-banner">{state.error}</div>}
      <div className="grid-2">
        <div className="field">
          <label>Landlord or property name</label>
          <input name="landlordName" required autoComplete="off" placeholder="e.g. Sunrise Apartments" />
        </div>
        <div className="field">
          <label>Landlord email (optional)</label>
          <input name="landlordEmail" type="email" inputMode="email" autoComplete="off" />
        </div>
        <div className="field">
          <label>Landlord phone (optional)</label>
          <input name="landlordPhone" type="tel" autoComplete="off" />
        </div>
        <div className="field">
          <label>Link expires in (days, optional)</label>
          <input name="expiresInDays" type="number" inputMode="numeric" min={1} placeholder="30" />
        </div>
      </div>
      <button className="btn btn-primary" type="submit">
        Create my link
      </button>
    </form>
  );
}

export function ShareForm() {
  const [key, setKey] = useState(0);
  return <ShareFormInner key={key} onReset={() => setKey((k) => k + 1)} />;
}
