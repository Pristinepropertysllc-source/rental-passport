'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { registerAction } from '@/lib/actions/auth';
import { PACKAGES, isPackageKey } from '@/lib/packages';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Creating account…' : 'Create account'}
    </button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, undefined);
  const searchParams = useSearchParams();
  const packageParam = searchParams.get('package') || '';
  const inviteToken = searchParams.get('invite') || '';
  const selectedPackage = isPackageKey(packageParam) ? PACKAGES[packageParam] : null;

  return (
    <div className="shell" style={{ maxWidth: 440, paddingTop: 60 }}>
      <div className="card">
        <h1 style={{ fontSize: 22 }}>Create your account</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          Tenants build a reusable Rental Passport. Landlords review applications.
        </p>

        {selectedPackage && (
          <div className="section-row" style={{ marginBottom: 16 }}>
            <span>Selected package</span>
            <span className="badge badge-approved">
              {selectedPackage.name} &mdash; {selectedPackage.priceLabel}
            </span>
          </div>
        )}

        {state?.error && <div className="error-banner">{state.error}</div>}

        <form action={formAction}>
          <input type="hidden" name="package" value={selectedPackage ? selectedPackage.key : ''} />
          <input type="hidden" name="invite" value={inviteToken} />
          <div className="field">
            <label htmlFor="role">I am a</label>
            {inviteToken ? (
              <>
                <input value="Tenant / applicant" disabled />
                <input type="hidden" name="role" value="TENANT" />
              </>
            ) : (
              <select id="role" name="role" defaultValue="TENANT">
                <option value="TENANT">Tenant / applicant</option>
                <option value="LANDLORD">Landlord / property manager</option>
              </select>
            )}
          </div>
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
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <SubmitButton />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span className="muted" style={{ fontSize: 12 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <a
          className="btn btn-secondary"
          href={`/api/auth/google${
            selectedPackage || inviteToken
              ? `?${new URLSearchParams({
                  ...(selectedPackage ? { package: selectedPackage.key } : {}),
                  ...(inviteToken ? { invite: inviteToken } : {})
                }).toString()}`
              : ''
          }`}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 5.1 29.5 3 24 3 16.1 3 9.3 7.5 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 45c5.3 0 10.2-2 13.9-5.4l-6.4-5.4C29.4 35.9 26.8 37 24 37c-5.3 0-9.7-3.5-11.3-8.3l-6.5 5C9.2 40.5 16 45 24 45z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.4 5.4C39.9 37.4 43 31.4 43 24c0-1.2-.1-2.4-.4-3.5z"/>
          </svg>
          Continue with Google
        </a>

        <p className="muted" style={{ marginTop: 16, fontSize: 14 }}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
