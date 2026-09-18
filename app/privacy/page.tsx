import Link from 'next/link';
import { AuthLogo } from '@/components/AuthLogo';

export default function PrivacyPage() {
  return (
    <div className="shell" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 760 }}>
      <AuthLogo />
      <Link href="/" className="muted" style={{ fontSize: 13 }}>
        &larr; Back to homepage
      </Link>

      <div className="card" style={{ marginTop: 16 }}>
        <h1>Privacy Policy</h1>
        <p className="muted">Last updated: {new Date().toLocaleDateString()}</p>

        <h2 style={{ fontSize: 18 }}>Information we collect</h2>
        <p>
          To build your Rental Passport and process rental screening, we collect information you
          provide directly, including your name, contact details, date of birth, address history,
          Social Security number, employment and income information, rental history, references,
          household information, and documents you upload (such as government ID, pay stubs, and
          bank statements).
        </p>

        <h2 style={{ fontSize: 18 }}>How we use your information</h2>
        <p>
          We use your information to build your Rental Passport, process payment for screening
          services, and share your application with landlords you choose to share it with. Payment
          is processed securely through Stripe; we do not store your full payment card details.
        </p>

        <h2 style={{ fontSize: 18 }}>Who can see your information</h2>
        <p>
          Your Rental Passport is only visible to you, to landlords you explicitly share it with
          via a secure link, and to authorized Rental Passport staff who may assist with your
          screening or account. You can revoke a landlord&apos;s access at any time.
        </p>

        <h2 style={{ fontSize: 18 }}>Data retention</h2>
        <p>
          We retain your information for as long as your account is active or as needed to provide
          you services. Contact us if you would like to request deletion of your account or
          personal information.
        </p>

        <h2 style={{ fontSize: 18 }}>Contact us</h2>
        <p>
          Questions about this policy can be sent to{' '}
          <a href="mailto:support@myrentalpassport.net">support@myrentalpassport.net</a>.
        </p>
      </div>
    </div>
  );
}
