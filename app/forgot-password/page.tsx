'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useState } from 'react';
import { requestPasswordResetAction } from '@/lib/actions/auth';
import { AuthLogo } from '@/components/AuthLogo';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Sending…' : 'Send reset link'}
    </button>
  );
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState(requestPasswordResetAction, undefined);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="shell" style={{ maxWidth: 440, paddingTop: 60 }}>
      <AuthLogo />
      <div className="card">
        <h1 style={{ fontSize: 22 }}>Reset your password</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          Enter your account email and we&apos;ll send you a link to reset your password.
        </p>

        {submitted ? (
          <div className="card" style={{ background: '#e6f2e6', borderColor: 'var(--ok)', margin: 0 }}>
            <strong style={{ color: 'var(--ok)' }}>Check your email.</strong> If an account exists
            for that address, we&apos;ve sent a link to reset your password. It expires in 1 hour.
          </div>
        ) : (
          <form
            action={async (formData) => {
              await formAction(formData);
              setSubmitted(true);
            }}
          >
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            {state?.error && <div className="error-banner">{state.error}</div>}
            <SubmitButton />
          </form>
        )}

        <p className="muted" style={{ marginTop: 16, fontSize: 14 }}>
          <Link href="/login">Back to log in</Link>
        </p>
      </div>
    </div>
  );
}
