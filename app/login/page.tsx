'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { loginAction } from '@/lib/actions/auth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Logging in…' : 'Log in'}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, undefined);

  return (
    <div className="shell" style={{ maxWidth: 440, paddingTop: 60 }}>
      <div className="card">
        <h1 style={{ fontSize: 22 }}>Log in</h1>

        {state?.error && <div className="error-banner">{state.error}</div>}

        <form action={formAction}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <SubmitButton />
        </form>

        <p className="muted" style={{ marginTop: 16, fontSize: 14 }}>
          No account yet? <Link href="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
