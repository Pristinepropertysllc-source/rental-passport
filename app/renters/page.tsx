import Link from 'next/link';

const benefits = [
  {
    title: 'Apply Once, Reuse Your Information',
    body: 'Build a Rental Passport instead of repeatedly entering the same personal, employment, income, and rental history information on every application.'
  },
  {
    title: 'Keep Your Documents Organized',
    body: 'Upload documents like your ID, pay stubs, and bank statements once, and keep them organized in one place instead of scattered across emails and paper applications.'
  },
  {
    title: 'Share With Participating Landlords',
    body: "Share your Rental Passport with landlords who accept or participate in the Rental Passport process, using a secure link instead of filling out a brand-new application."
  },
  {
    title: 'Control What You Share',
    body: 'You control who can view your Rental Passport. You can set a link expiration date and revoke a landlord\u2019s access at any time.'
  },
  {
    title: 'Reduce Repetitive Applications',
    body: 'A reusable profile can reduce the amount of repetitive data entry involved in applying to multiple properties.'
  },
  {
    title: 'Keep Screening Information Accessible',
    body: 'Where your account includes screening results, you can access your screening report at any time through your Rental Passport dashboard.'
  }
];

export default function RentersPage() {
  return (
    <div>
      <section className="lp-band">
        <div className="shell">
          <Link href="/" className="muted" style={{ fontSize: 13 }}>
            &larr; Back to homepage
          </Link>
          <div className="hero" style={{ padding: '32px 0 40px' }}>
            <h1 style={{ fontSize: 36 }}>Your Rental Application. Ready to Go.</h1>
            <p>
              Build your Rental Passport once, keep your rental information organized, and share
              your application with participating landlords instead of starting from scratch every
              time.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/register">
                Build Your Rental Passport
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-band lp-band-alt">
        <div className="shell">
          <div className="card" style={{ display: 'grid', gap: 24 }}>
            {benefits.map((b, i) => (
              <div className="benefit-card" key={b.title}>
                <div className="benefit-badge">{i + 1}</div>
                <div>
                  <h3>{b.title}</h3>
                  <p className="muted">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-band">
        <div className="shell">
          <div className="card">
            <h2>Understand Your Screening Information</h2>
            <p className="muted">
              Tenant screening reports can contain information such as credit history, rental
              history, employment information, eviction information, and criminal history,
              depending on the screening service used.
            </p>

            <h2 style={{ marginTop: 24 }}>Review for Errors</h2>
            <p className="muted" style={{ marginBottom: 0 }}>
              Federal law provides consumers with rights regarding inaccurate information that
              appears in consumer reports, including tenant screening reports. If you believe
              information in your screening report is incorrect, you generally have the right to
              dispute it with the consumer reporting agency that prepared the report.
            </p>
          </div>
        </div>
      </section>

      <section className="lp-band lp-band-alt">
        <div className="shell">
          <div className="card">
            <h2>Maryland Reusable Screening Reports</h2>
            <div className="legal-note">
              <h3>Maryland Law</h3>
              <p>
                Maryland law (Real Property &sect;8-218) recognizes a specific type of report
                called a &ldquo;reusable tenant screening report&rdquo; &mdash; one prepared within
                the previous 30 days by a consumer reporting agency at the request and expense of
                the prospective tenant, and made available to a landlord at no charge. To qualify,
                the report must contain specific information, including a credit report,
                comprehensive criminal and eviction history for prior-residence jurisdictions,
                employment and income verification, and current address and rental history.
                Maryland landlords must notify prospective tenants whether they accept reusable
                tenant screening reports, and if a landlord accepts a report that meets these
                requirements, the landlord generally may not charge that tenant an application fee
                or a fee to access the report.
              </p>
              <p className="legal-source">Source: Maryland General Assembly, Real Property &sect;8-218.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-band">
        <div className="shell">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>A Professional Rental Profile</h2>
            <p className="muted" style={{ maxWidth: 560, margin: '0 auto 20px' }}>
              Presenting your rental information in an organized, standardized format can help
              landlords review your application more efficiently.
            </p>
            <Link className="btn btn-primary" href="/register">
              Build Your Rental Passport
            </Link>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer-links">
          <Link href="/">Back to homepage</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
        <p className="muted" style={{ fontSize: 12, margin: 0 }}>
          &copy; {new Date().getFullYear()} Rental Passport
        </p>
      </footer>
    </div>
  );
}
