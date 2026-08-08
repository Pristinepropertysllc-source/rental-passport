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
          <div className="field">
            <label htmlFor="role">I am a</label>
            <select id="role" name="role" defaultValue="TENANT">
              <option value="TENANT">Tenant / applicant</option>
              <option value="LANDLORD">Landlord / property manager</option>
            </select>
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

        <p className="muted" style={{ marginTop: 16, fontSize: 14 }}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
