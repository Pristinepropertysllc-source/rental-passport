import Link from 'next/link';

const benefits = [
  {
    title: 'Organized Applicant Information',
    body: 'Receive standardized applicant information rather than scattered information across emails, attachments, and different application formats.'
  },
  {
    title: 'Less Repetitive Data Entry',
    body: 'Because applicants build their information once, you spend less time chasing down missing details or reformatting scattered application materials.'
  },
  {
    title: 'Screening Information in One Place',
    body: "Where screening results are included, you can review an applicant's screening information alongside their application in a single view."
  },
  {
    title: 'More Organized Applicant Review',
    body: 'Keep applicant information, supporting documents, and screening results together instead of tracking them across separate systems.'
  },
  {
    title: 'Applicant-Controlled Sharing',
    body: 'Applicants initiate and control the sharing of their Rental Passport. You review only what the applicant has chosen to share, for as long as they choose to share it.'
  },
  {
    title: 'Consistent Application Workflow',
    body: 'A standardized application format can help create a more consistent review workflow, while you continue to apply your own lawful screening criteria to each applicant.'
  },
  {
    title: 'Better Documentation',
    body: 'Keeping application information, documents, and screening results organized in one place can support clearer recordkeeping for your rental business.'
  }
];

export default function LandlordsPage() {
  return (
    <div>
      <section className="lp-band">
        <div className="shell">
          <Link href="/" className="muted" style={{ fontSize: 13 }}>
            &larr; Back to homepage
          </Link>
          <div className="hero" style={{ padding: '32px 0 40px' }}>
            <h1 style={{ fontSize: 36 }}>A More Organized Way to Review Applicants.</h1>
            <p>
              Receive organized applicant information and screening documentation in one place,
              helping simplify the rental application process while keeping the applicant in
              control of their information.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/register">
                Get Started
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
            <h2>Maryland Law</h2>
            <div className="legal-note">
              <h3>Reusable Tenant Screening Reports</h3>
              <p>
                Maryland Real Property &sect;8-218 recognizes a &ldquo;reusable tenant screening
                report&rdquo; &mdash; a report prepared within the previous 30 days by a consumer
                reporting agency, at the tenant&apos;s request and expense, and made available to a
                landlord at no charge. To qualify, the statute specifies that the report must
                include information such as:
              </p>
              <ul className="check-list" style={{ margin: '10px 0' }}>
                <li>A credit report</li>
                <li>Comprehensive criminal history for prior-residence jurisdictions</li>
                <li>Comprehensive eviction history for prior-residence jurisdictions</li>
                <li>Verification of employment and income</li>
                <li>Current address and rental history</li>
              </ul>
              <p>
                The statute requires landlords to notify prospective tenants whether they accept
                reusable tenant screening reports. If a landlord accepts a report that meets the
                statutory requirements, the landlord generally may not charge that tenant an
                application fee or a fee to access the report.
              </p>
              <p>
                <strong>
                  This is general educational information about Maryland law, not legal advice.
                </strong>{' '}
                It does not mean that every screening report provided through Rental Passport
                automatically satisfies this statutory definition. Landlords should evaluate
                whether a specific report actually meets the requirements of &sect;8-218 before
                treating it as a qualifying reusable tenant screening report, and should not assume
                that using Rental Passport eliminates their own application fee or screening
                policies.
              </p>
              <p className="legal-source">Source: Maryland General Assembly, Real Property &sect;8-218.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-band lp-band-alt">
        <div className="shell">
          <div className="card">
            <h2>Consumer Reporting Compliance</h2>
            <div className="legal-note">
              <p>
                Tenant screening reports &mdash; including credit, criminal, and eviction history
                reports &mdash; can be &ldquo;consumer reports&rdquo; regulated by the federal Fair
                Credit Reporting Act (FCRA). Landlords who use consumer reports for tenant
                screening generally must have a permissible purpose for obtaining the report, and
                must provide an adverse action notice if they deny an application, require a
                co-signer, charge a higher deposit, or take other unfavorable action based in whole
                or in part on a consumer report.
              </p>
              <p style={{ marginBottom: 0 }}>
                <strong>
                  Rental Passport does not replace your obligation to comply with the FCRA</strong>{' '}
                or any other applicable federal, state, or local screening law. This section is
                general educational information, not legal advice.
              </p>
              <p className="legal-source">
                Source: Federal Trade Commission, &ldquo;Using Consumer Reports: What Landlords
                Need to Know.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-band">
        <div className="shell">
          <div className="card">
            <h2>Fair Housing</h2>
            <div className="legal-note">
              <p style={{ marginBottom: 0 }}>
                The federal Fair Housing Act prohibits discrimination in housing based on protected
                characteristics, and applies to how landlords screen and evaluate rental
                applicants. Landlords should apply consistent, lawful, nondiscriminatory screening
                criteria to every applicant. Rental Passport organizes applicant information but
                does not evaluate applicants or make rental decisions &mdash; the landlord or
                property owner remains responsible for its own rental decisions and screening
                policies.
              </p>
              <p className="legal-source">
                Source: U.S. Department of Housing and Urban Development, guidance on the
                application of the Fair Housing Act to the screening of applicants for rental
                housing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-band lp-band-alt">
        <div className="shell">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>Ready to Simplify Your Rental Application Process?</h2>
            <div className="hero-actions" style={{ marginTop: 14 }}>
              <Link className="btn btn-primary" href="/register">
                Get Started
              </Link>
            </div>
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
