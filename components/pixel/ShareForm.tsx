'use client';

import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { createShareAction } from '@/lib/actions/share';
import { trackMetaEvent } from '@/lib/metaPixel';

export function ShareForm() {
  const [state, formAction] = useFormState(createShareAction, undefined);
  const fired = useRef(false);

  useEffect(() => {
    if (state?.success && !fired.current) {
      fired.current = true;
      trackMetaEvent('Share', undefined, true);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <div className="grid-2">
        <div className="field">
          <label>Landlord email</label>
          <input name="landlordEmail" type="email" required />
        </div>
        <div className="field">
          <label>Link expires in (days, optional)</label>
          <input name="expiresInDays" type="number" min={1} placeholder="30" />
        </div>
      </div>
      <button className="btn btn-primary" type="submit">
        Send invite
      </button>
    </form>
  );
}
