'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { resetPasswordAction } from '@/lib/actions/auth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Set new password'}
    </button>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useFormState(resetPasswordAction, undefined);

  return (
    <div className="shell" style={{ maxWidth: 440, paddingTop: 60 }}>
      <div className="card">
        <h1 style={{ fontSize: 22 }}>Set a new password</h1>
        {state?.error && <div className="error-banner">{state.error}</div>}
        <form action={formAction}>
          <input type="hidden" name="token" value={token} />
          <div className="field">
            <label htmlFor="password">New password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
