import Link from 'next/link';
import { PublicNav } from '@/components/PublicNav';

export const metadata = {
  title: 'About Rental Passport | Apply Once. Rent Anywhere.',
  description:
    'Learn the story behind Rental Passport and how real estate experience inspired a simpler, more organized way for renters and housing providers to navigate the rental application process.'
};

function StepChain({ steps }: { steps: string[] }) {
  return (
    <div className="step-chain">
      {steps.map((s, i) => (
        <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className={`step-chain-item ${i === steps.length - 1 ? 'step-chain-item-final' : ''}`}>
            {s}
          </span>
          {i < steps.length - 1 && <span className="step-chain-arrow">&rarr;</span>}
        </span>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div>
      <PublicNav />

      {/* Hero */}
      <section className="lp-band">
        <div className="shell">
          <div className="hero">
            <img src="/founder-photo.webp" alt="Granit Pllana" className="founder-avatar-photo" />
            <h1 style={{ fontSize: 34 }}>
              Built From Real Estate Experience. Designed to Make Renting Easier.
            </h1>
            <p style={{ maxWidth: 600 }}>
              Rental Passport was created to make the rental application process more organized,
              less repetitive, and easier for renters and housing providers.
            </p>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>Granit Pllana</p>
            <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
              Real Estate Professional | Property Management | Founder of Rental Passport
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/register">
                Build Your Rental Passport
              </Link>
              <Link className="btn btn-secondary" href="/renters">
                Learn How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: My Story */}
      <section className="lp-band lp-band-alt">
        <div className="shell">
          <div className="card">
            <h2>My Story</h2>
            <p>
              My background is in real estate and property management, and that work put me on
              both sides of the rental application process.
            </p>
            <p>
              On one side, I saw renters who were often asked to repeatedly provide the same
              personal information, employment information, income information, rental history,
              references, identification, supporting documents, and screening information &mdash;
              sometimes more than once, for different properties.
            </p>
            <p>
              On the other side, I saw landlords and property managers who need organized
              information from applicants so they can properly review applications and make
              decisions according to their own rental criteria and applicable laws.
            </p>
            <p style={{ fontWeight: 600 }}>
              Seeing both sides made me ask a simple question: why does the renter have to keep
              starting over?
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: The Problem */}
      <section className="lp-band">
        <div className="shell">
          <div className="card">
            <h2>The Problem</h2>
            <p className="muted">
              Depending on the property and the landlord, the process can look something like
              this:
            </p>
            <StepChain
              steps={[
                'Find a Property',
                'Fill Out Application',
                'Submit Documents',
                'Pay Application/Screening Fees',
                'Wait',
                'Possibly Get Denied',
                'Find Another Property',
                'Start Over'
              ]}
            />
            <p className="muted" style={{ marginTop: 20 }}>
              This can be frustrating because renters may spend significant time gathering the
              same information again and again, and depending on the property and landlord, may
              encounter separate application or screening fees during their search. Not every
              rental property charges an application fee, and Rental Passport does not eliminate
              every rental-related fee &mdash; but the renter should not have to feel like they
              are starting from zero every time they find another property.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Why I Created Rental Passport */}
      <section className="lp-band lp-band-alt">
        <div className="shell">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>Why I Created Rental Passport</h2>
            <p className="muted" style={{ maxWidth: 560, margin: '0 auto' }}>
              The idea is simple: prepare once, organize your information, and be ready when the
              right rental opportunity appears.
            </p>
            <p style={{ maxWidth: 560, margin: '16px auto' }}>
              A renter can build a Rental Passport containing information such as personal
              information, employment, income, rental history, references, documents, and
              screening information &mdash; then use that organized profile when applying to
              participating landlords and property managers.
            </p>
            <div style={{ margin: '28px 0' }}>
              <p className="muted" style={{ fontStyle: 'italic', marginBottom: 4 }}>
                Instead of finding a property and thinking...
              </p>
              <p className="muted" style={{ fontStyle: 'italic', marginTop: 0 }}>
                &ldquo;Do I have everything they need? Where is my pay stub? Where is my rental
                history? Do I have to fill everything out again?&rdquo;
              </p>
              <p style={{ fontWeight: 600, marginTop: 16 }}>
                The renter can approach the opportunity thinking: &ldquo;I&apos;m prepared.
                I&apos;m ready to apply.&rdquo;
              </p>
            </div>
            <p className="pull-quote">Be Ready to Apply.</p>
          </div>
        </div>
      </section>

      {/* Section 4: The Bigger Idea */}
      <section className="lp-band">
        <div className="shell">
          <h2 style={{ textAlign: 'center' }}>The Bigger Idea</h2>
          <p className="muted" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 24px' }}>
            Rental Passport isn&apos;t about renters versus landlords &mdash; it&apos;s about
            improving the process for everyone involved.
          </p>
          <div className="grid-2">
            <div className="card">
              <h3 style={{ marginTop: 0 }}>For Renters</h3>
              <ul className="check-list">
                <li>Organize their information</li>
                <li>Keep important documents together</li>
                <li>Prepare before applying</li>
                <li>Reduce repetitive data entry</li>
                <li>Keep their rental information ready</li>
                <li>Share information with participating landlords</li>
                <li>Better understand the information they are providing</li>
              </ul>
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>For Landlords &amp; Property Managers</h3>
              <ul className="check-list">
                <li>More organized applicant information</li>
                <li>A standardized application experience</li>
                <li>Less unnecessary back-and-forth for documents</li>
                <li>A clearer workflow</li>
                <li>Better-prepared applicants</li>
                <li>A more organized way to review information</li>
              </ul>
            </div>
          </div>
          <p className="muted" style={{ textAlign: 'center', maxWidth: 640, margin: '24px auto 0', fontSize: 13.5 }}>
            Rental Passport does not make rental decisions for landlords. Landlords and property
            managers remain responsible for applying their lawful rental criteria consistently and
            complying with applicable federal, state, and local laws. Rental Passport does not
            guarantee approval, acceptance, housing, or favorable screening results.
          </p>
        </div>
      </section>

      {/* Section 5: Maryland Law */}
      <section className="lp-band lp-band-alt">
        <div className="shell">
          <div className="card">
            <h2>Maryland Recognizes Reusable Tenant Screening Reports</h2>
            <div className="legal-note">
              <p>
                Maryland Real Property &sect;8-218 recognizes the concept of a &ldquo;reusable
                tenant screening report&rdquo; and establishes specific requirements for a
                qualifying report. As currently written, the statute describes a report prepared
                within the previous 30 days by a consumer reporting agency, at the request and
                expense of a prospective tenant, and made directly available to a prospective
                landlord at no charge for use in the rental application process.
              </p>
              <p>
                The statute identifies information that must be included for a report to qualify,
                such as:
              </p>
              <ul className="check-list" style={{ margin: '10px 0' }}>
                <li>Credit report</li>
                <li>Comprehensive criminal history information for the previous 7 years for relevant jurisdictions</li>
                <li>Comprehensive eviction history for the previous 7 years for relevant jurisdictions</li>
                <li>Employment and income verification</li>
                <li>Current address and rental history</li>
              </ul>
              <p>
                Maryland law also addresses whether landlords accept reusable tenant screening
                reports, and establishes consequences for landlords who accept a qualifying
                report.
              </p>
              <p style={{ marginBottom: 0 }}>
                <strong>
                  Maryland law provides a framework for qualifying reusable tenant screening
                  reports, and Rental Passport is designed around the broader idea of helping
                  renters prepare and reuse organized rental information.
                </strong>{' '}
                This is general educational information, not legal advice, and it does not mean
                every landlord is required to accept Rental Passport, that Rental Passport
                automatically qualifies as a statutory reusable tenant screening report, or that
                Maryland landlords cannot charge application fees.
              </p>
              <p className="legal-source">
                Source:{' '}
                <a
                  href="https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=grp&enactments=false&section=8-218"
                  target="_blank"
                  rel="noreferrer"
                >
                  Maryland General Assembly, Real Property &sect;8-218
                </a>
                . See also the{' '}
                <a href="https://www.ftc.gov/legal-library/browse/statutes/fair-credit-reporting-act" target="_blank" rel="noreferrer">
                  FTC on the Fair Credit Reporting Act
                </a>{' '}
                and the{' '}
                <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-tenant-screening-report-en-2102/" target="_blank" rel="noreferrer">
                  CFPB on tenant screening reports
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Why This Matters to Renters */}
      <section className="lp-band">
        <div className="shell">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>Be Ready When Opportunity Knocks</h2>
            <p className="muted" style={{ maxWidth: 580, margin: '0 auto' }}>
              Finding a home can be competitive and stressful. A renter may find a property they
              really want, but the application process can require gathering documents and
              information on short notice. Rental Passport is designed to help renters prepare
              before that moment arrives &mdash; their information organized, their documents
              available, their rental history prepared, and their screening information available
              when appropriate.
            </p>
            <StepChain steps={['Prepare', 'Organize', 'Screen', 'Share', 'Apply']} />
            <p style={{ fontWeight: 600 }}>When they find a property they want to pursue, they are prepared to apply.</p>
          </div>
        </div>
      </section>

      {/* Section 7: Vision */}
      <section className="lp-band lp-band-alt">
        <div className="shell">
          <h2 style={{ textAlign: 'center' }}>My Vision for Rental Passport</h2>
          <p className="muted" style={{ textAlign: 'center', maxWidth: 580, margin: '0 auto 24px' }}>
            My goal is for Rental Passport to grow into something that helps everyone involved in
            the rental process.
          </p>
          <div className="hiw-chips" style={{ marginBottom: 28 }}>
            <span className="hiw-chip">Renters: feel more prepared and less overwhelmed</span>
            <span className="hiw-chip">Landlords: receive more organized applicant information</span>
            <span className="hiw-chip">Property Managers: a more efficient application workflow</span>
            <span className="hiw-chip">The Rental Industry: a more organized, transparent process</span>
          </div>
          <p className="muted" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 20px' }}>
            The goal is not simply to build another rental website. The goal is to improve the
            application process itself.
          </p>
          <p className="pull-quote">
            &ldquo;I believe applying for a home should feel like an opportunity &mdash; not like
            starting over every time.&rdquo;
          </p>
          <p style={{ textAlign: 'center', fontWeight: 600, marginTop: 16 }}>
            Rental Passport is my effort to make that process better.
          </p>
        </div>
      </section>

      {/* Section 8: Trust & Responsibility */}
      <section className="lp-band">
        <div className="shell">
          <div className="card">
            <h2>Trust &amp; Responsibility</h2>
            <p className="muted">
              Rental applications can contain sensitive personal and financial information.
              Rental Passport is built around privacy, applicant control, and transparency:
            </p>
            <ul className="check-list">
              <li>Applicants choose when to share their Rental Passport, and with whom</li>
              <li>Share links can be set to expire, and access can be revoked at any time</li>
              <li>Payment processing is handled through Stripe</li>
              <li>Screening information is only visible to the applicant and landlords they&apos;ve shared with</li>
            </ul>
            <p className="muted" style={{ fontSize: 13.5 }}>
              We don&apos;t make claims like &ldquo;100% secure,&rdquo; &ldquo;bank-level
              security,&rdquo; or &ldquo;fully FCRA compliant&rdquo; because those are the kind of
              claims that require independent verification we haven&apos;t obtained. What we can
              say is that the features above are actually built into Rental Passport today.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: Connect With Me */}
      <section className="lp-band lp-band-alt">
        <div className="shell">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>Follow the Journey</h2>
            <p className="muted" style={{ maxWidth: 560, margin: '0 auto 20px' }}>
              Rental Passport grew out of my work and experience in real estate and property
              management. I&apos;m building it with the goal of making the rental process easier
              for the people on both sides of the application.
            </p>
            <a
              className="btn btn-primary"
              href="https://www.facebook.com/GranitPllanaRealtor/"
              target="_blank"
              rel="noreferrer"
            >
              Follow Granit Pllana Realtor
            </a>
          </div>
        </div>
      </section>

      {/* Section 10: Founder Message */}
      <section className="lp-band">
        <div className="shell">
          <div className="founder-message-card">
            <p style={{ fontSize: 17, lineHeight: 1.7 }}>
              I created Rental Passport because I believe the rental process can be better.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7 }}>
              I&apos;ve seen how much information renters are asked to provide, and how repetitive
              the process can become when they are searching for a home. I&apos;ve also seen the
              importance of landlords and property managers having organized information when
              evaluating applicants. I wanted to create something that could help bring those two
              needs together.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7 }}>
              My goal is simple: help renters feel prepared, help housing providers receive
              organized information, and make the rental application process easier for everyone
              involved.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7 }}>
              If you find a property you want to apply for, I want you to feel confident that
              you&apos;ve already done the preparation. You&apos;re organized. Your documents are
              ready. Your information is ready. And you&apos;re ready to apply.
            </p>
            <p style={{ fontWeight: 700, fontSize: 20, marginBottom: 0, marginTop: 28 }}>Rental Passport</p>
            <p style={{ marginTop: 4, opacity: 0.9 }}>Apply Once. Rent Anywhere.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="lp-band lp-band-alt">
        <div className="shell">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>Be Ready for Your Next Rental</h2>
            <p className="muted" style={{ marginTop: 0 }}>
              Build your Rental Passport, organize your information, and be prepared when the
              right property comes along.
            </p>
            <div className="hero-actions" style={{ marginTop: 14 }}>
              <Link className="btn btn-primary" href="/register">
                Build Your Rental Passport
              </Link>
              <Link className="btn btn-secondary" href="/renters">
                Learn How It Works
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
          Information about Maryland law is provided for general educational purposes and is not
          legal advice. Landlords, property managers, and renters should consult qualified legal
          counsel regarding their specific circumstances and obligations.
        </p>
        <p className="muted" style={{ fontSize: 12, margin: '8px 0 0' }}>
          &copy; {new Date().getFullYear()} Rental Passport
        </p>
      </footer>
    </div>
  );
}
