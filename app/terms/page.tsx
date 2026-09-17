import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="shell" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 760 }}>
      <Link href="/" className="muted" style={{ fontSize: 13 }}>
        &larr; Back to homepage
      </Link>

      <div className="card" style={{ marginTop: 16 }}>
        <div
          style={{
            background: '#fbf3e3',
            border: '1px solid var(--accent)',
            borderRadius: 8,
            padding: '12px 16px',
            fontSize: 13,
            marginBottom: 20
          }}
        >
          <strong>Draft placeholder.</strong> This page has not yet been reviewed by an attorney.
          Replace this content with terms reviewed for your jurisdiction before relying on it.
        </div>

        <h1>Terms of Service</h1>
        <p className="muted">Last updated: {new Date().toLocaleDateString()}</p>

        <h2 style={{ fontSize: 18 }}>Using Rental Passport</h2>
        <p>
          Rental Passport lets renters build a reusable rental application and share it with
          landlords. By creating an account, you agree to provide accurate information and to use
          the service only for its intended purpose.
        </p>

        <h2 style={{ fontSize: 18 }}>No guarantee of approval</h2>
        <p>
          Rental Passport does not guarantee that you will be approved for any rental property.
          Each landlord makes their own independent decision based on their own criteria and
          applicable law.
        </p>

        <h2 style={{ fontSize: 18 }}>Payments</h2>
        <p>
          Screening payments are processed securely through Stripe. Pricing shown at checkout is
          the price you will be charged. Refund requests can be sent to support.
        </p>

        <h2 style={{ fontSize: 18 }}>Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials.
          Landlords may create an account to manage applicants they receive through the platform.
        </p>

        <h2 style={{ fontSize: 18 }}>Changes to these terms</h2>
        <p>We may update these terms from time to time. Continued use of Rental Passport after changes means you accept the updated terms.</p>

        <h2 style={{ fontSize: 18 }}>Contact us</h2>
        <p>
          Questions about these terms can be sent to{' '}
          <a href="mailto:support@myrentalpassport.net">support@myrentalpassport.net</a>.
        </p>
      </div>
    </div>
  );
}
