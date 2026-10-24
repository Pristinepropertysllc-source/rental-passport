import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { PublicNav } from '@/components/PublicNav';
import { DemoProvider, DemoTriggerButton } from '@/components/demo/RentalPassportDemo';
import { ViewContentTracker } from '@/components/pixel/PixelTrackers';
import { FAQ_ITEMS } from '@/lib/faqData';
import { STATE_LAWS } from '@/lib/stateLaws';
import { HeroMedia } from '@/components/HeroMedia';
import { StatePicker } from '@/components/StatePicker';
import { SavingsCalculator } from '@/components/SavingsCalculator';
import { ProcessSteps } from '@/components/ProcessSteps';

const HOME_FAQ_QUESTIONS = [
  'Do I have to complete a new application for every property?',
  'Does the landlord need a Rental Passport account?',
  'Can I control what a landlord sees?',
  'Does Rental Passport guarantee that I will be approved for a rental?'
];
const HOME_FAQ = HOME_FAQ_QUESTIONS.map((q) => FAQ_ITEMS.find((i) => i.question === q)).filter(
  (i): i is { question: string; answer: string } => !!i
);

const CHECK_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12l5 5 9-10" />
  </svg>
);

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === 'TENANT' ? '/dashboard' : '/landlord/dashboard');
  }

  return (
    <DemoProvider>
    <div className="home-page">
      <PublicNav />
      <ViewContentTracker contentName="homepage" />

      {/* Hero */}
      <section className="hx-band">
        <div className="shell hx-grid">
          <div className="hx-copy">
            <span className="hx-pill">Reusable screening report</span>
            <h1 className="hx-title">
              Apply once.
              <br />
              Rent anywhere.
            </h1>
            <p className="hx-lede">
              One $54.99 screening report and application you can share with every landlord. Stop
              starting over for every place you tour, and in many states, skip the application fee.
            </p>
            <div className="hx-actions">
              <Link className="btn btn-primary hx-btn" href="/register">
                Build my Rental Passport
              </Link>
              <DemoTriggerButton step={1} className="btn btn-secondary hx-btn">
                See a sample
              </DemoTriggerButton>
            </div>
            <StatePicker />
            <ul className="hx-points">
              <li>{CHECK_ICON}Credit, criminal &amp; eviction</li>
              <li>{CHECK_ICON}One-time payment</li>
              <li>{CHECK_ICON}You control who sees it</li>
            </ul>
          </div>

          <div className="hx-visual">
            <HeroMedia>
            <div className="hx-phone">
              <div className="hx-phone-head">
                <span className="hx-avatar">AM</span>
                <div className="hx-phone-who">
                  <strong>Alex Morgan</strong>
                  <span>Rental Passport</span>
                </div>
                <span className="hx-verified">Verified</span>
              </div>
              <div className="hx-phone-rows">
                {['Credit report', 'Criminal history', 'Eviction history', 'Income verified'].map((label) => (
                  <div className="hx-phone-row" key={label}>
                    <span>{label}</span>
                    <span className="hx-complete">Complete</span>
                  </div>
                ))}
              </div>
              <div className="hx-phone-bar">Share with a landlord &rarr;</div>
            </div>
            </HeroMedia>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="lp-band lp-band-alt">
        <div className="shell">
          <h2 className="hw-title" style={{ marginBottom: 8 }}>How it works</h2>
          <p className="ps-sub">Apply once, then send the same passport to every landlord you&apos;re interested in.</p>
          <ProcessSteps />
        </div>
      </section>

      {/* Savings calculator */}
      <section className="lp-band">
        <div className="shell">
          <h2 className="hw-title" style={{ marginBottom: 24 }}>How much could you save?</h2>
          <SavingsCalculator />
        </div>
      </section>

      {/* Pricing */}
      <section className="lp-band lp-band-alt" id="pricing">
        <div className="shell">
          <div className="card">
            <h2 style={{ textAlign: 'center' }}>Simple, One-Time Pricing</h2>
            <p className="muted" style={{ textAlign: 'center', marginTop: 0 }}>
              No subscriptions, no per-property fees &mdash; pay once, share with unlimited
              landlords.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="pricing-card pricing-card-highlight" style={{ maxWidth: 360, width: '100%' }}>
                <h3>Complete Screening</h3>
                <p className="price-tag">$54.99</p>
                <ul className="check-list">
                  <li>Credit report</li>
                  <li>Criminal history</li>
                  <li>Eviction history</li>
                  <li>Employment and income verification</li>
                  <li>Current address and rental history</li>
                </ul>
                <p className="muted" style={{ fontSize: 14 }}>
                  Everything you need for a verified application ready to share.
                </p>
                <Link className="btn btn-primary" href="/register?package=COMPLETE">
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* See Rental Passport in Action */}
      <section className="demo-showcase-band">
        <div className="shell" style={{ textAlign: 'center' }}>
          <span className="demo-showcase-badge">INTERACTIVE DEMO</span>
          <h2>See Rental Passport in Action</h2>
          <p style={{ marginTop: 0, marginBottom: 24, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            See how a renter builds their Rental Passport, organizes their documents, and
            securely shares their application with a landlord.
          </p>
          <DemoTriggerButton step={1} className="demo-showcase-cta">
            Explore a Sample Rental Passport &rarr;
          </DemoTriggerButton>

          <div className="product-preview-frame" style={{ marginTop: 36 }}>
            <div className="product-preview-bar">
              <span className="product-preview-dot" style={{ background: '#e4574a' }} />
              <span className="product-preview-dot" style={{ background: '#e0a53e' }} />
              <span className="product-preview-dot" style={{ background: '#3ea55e' }} />
              <span className="muted" style={{ fontSize: 12, marginLeft: 8 }}>
                myrentalpassport.net/share
              </span>
            </div>
            <div className="product-preview-body" style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <strong>Alex Morgan&apos;s Rental Passport</strong>
                <span className="screening-verified-badge">✓ Verified by Rental Passport</span>
              </div>
              <div className="product-preview-row">
                <span>Credit Screening</span>
                <span className="screening-status-pill" style={{ background: '#e6f2e6', color: '#2f6b3a' }}>
                  COMPLETED
                </span>
              </div>
              <div className="product-preview-row">
                <span>Background Screening</span>
                <span className="screening-status-pill" style={{ background: '#e6f2e6', color: '#2f6b3a' }}>
                  COMPLETED
                </span>
              </div>
              <div className="product-preview-row">
                <span>Landlord Search</span>
                <span className="screening-status-pill" style={{ background: '#e6f2e6', color: '#2f6b3a' }}>
                  COMPLETED
                </span>
              </div>
              <div className="product-preview-row" style={{ marginBottom: 0 }}>
                <span>Documents</span>
                <span className="muted">7 uploaded</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Renters */}
      <section className="lp-band">
        <div className="shell">
          <div className="card">
            <h2>For Renters</h2>
            <ul className="check-list">
              <li>Apply faster with one reusable profile</li>
              <li>Upload your documents once</li>
              <li>Save money on repeat application fees</li>
              <li>Control exactly what you share, and with whom</li>
              <li>Track every application in one place</li>
            </ul>
            <DemoTriggerButton step={3} className="demo-trigger-btn">
              See a Sample Rental Passport &rarr;
            </DemoTriggerButton>
          </div>

          <div className="landlord-cta">
            <h3>Your Rental Application. Ready to Go.</h3>
            <p className="muted" style={{ marginTop: 0 }}>
              Build your Rental Passport once, keep your rental information organized, and share
              your application with participating landlords instead of starting from scratch every
              time.
            </p>
            <Link href="/renters" className="btn btn-secondary" style={{ marginTop: 4 }}>
              Learn More About Renting &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Reusable screening report laws (all states, alphabetical) */}
      <section className="lp-band lp-band-alt" id="state-laws">
        <div className="shell">
          <div className="md-card" style={{ marginBottom: 20 }}>
            <div className="md-card-header">
              <div className="md-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2 4 5v6c0 5 3.4 9.2 8 10 4.6-.8 8-5 8-10V5l-8-3z" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h2 style={{ margin: 0 }}>Reusable Screening Report Laws</h2>
                <p className="muted" style={{ margin: '2px 0 0' }}>
                  One report. Multiple rental opportunities.
                </p>
              </div>
            </div>

            <p>
              Several states have laws that let renters bring their own recent screening report
              instead of paying a new application fee for every rental. Rental Passport&apos;s
              Complete Screening report includes:
            </p>
            <ul className="check-list">
              <li>Credit report</li>
              <li>Comprehensive criminal history</li>
              <li>Comprehensive eviction history</li>
              <li>Employment and income verification</li>
              <li>Current address and rental history</li>
            </ul>
            <p className="muted" style={{ marginBottom: 0 }}>
              Every report shows the date it was generated, so landlords can confirm it falls within
              their state&apos;s time window.
            </p>
          </div>

          <div className="os-grid">
            {STATE_LAWS.map((st) => (
              <div className="md-card os-card" key={st.name}>
                <h3 style={{ margin: 0 }}>{st.name}</h3>
                <p className="muted" style={{ margin: '8px 0 0' }}>{st.summary}</p>
                <div>
                  <div className="md-citation">{st.citation}</div>
                </div>
                <a className="btn btn-secondary" href={st.href} target="_blank" rel="noreferrer">
                  Read the law
                </a>
              </div>
            ))}
          </div>
          <p className="os-swipe">Swipe to see all {STATE_LAWS.length} states &rarr;</p>
        </div>
      </section>

      {/* Landlord pointer */}
      <section className="lp-band">
        <div className="shell">
          <div className="landlord-band">
            <span>Are you a landlord or property manager?</span>{' '}
            <Link href="/landlords">See what you receive &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="lp-band lp-band-alt">
        <div className="shell">
          <div className="card">
            <h2>Your Rental Passport belongs to you.</h2>
            <p className="muted" style={{ marginTop: 0 }}>
              Once your screening is complete, you decide who sees it and for how long.
            </p>
            <ul className="check-list">
              <li>Secure, unique application links</li>
              <li>Access expiration settings</li>
              <li>Application viewing history</li>
              <li>Revoke access at any time</li>
            </ul>
          </div>

          <div className="card">
            <h2>Built with security in mind</h2>
            <ul className="check-list">
              <li>Secure authentication</li>
              <li>Permission-based sharing</li>
              <li>Applicant-controlled access</li>
              <li>Secure payment processing through Stripe</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="lp-band">
        <div className="shell">
          <div className="card" style={{ textAlign: 'left' }}>
            <h2>Frequently Asked Questions</h2>
            <p className="muted" style={{ marginTop: 0 }}>
              Everything you need to know about Rental Passport.
            </p>
            <div className="faq-home">
              {HOME_FAQ.map((item) => (
                <details className="faq-item" key={item.question}>
                  <summary>{item.question}</summary>
                  <div className="faq-answer">{item.answer}</div>
                </details>
              ))}
            </div>
            <Link className="btn btn-primary" href="/faq">
              See all questions
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="lp-band lp-band-alt">
        <div className="shell">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>Ready to build your Rental Passport?</h2>
            <p className="muted" style={{ marginTop: 0 }}>Apply once. Rent anywhere.</p>
            <div className="hero-actions" style={{ marginTop: 14 }}>
              <Link className="btn btn-primary" href="/register">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="site-footer-links">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/login">Log in</Link>
        </div>
        <p className="muted" style={{ fontSize: 12, margin: 0 }}>
          &copy; {new Date().getFullYear()} Rental Passport
        </p>
      </footer>

      {/* Phone-only sticky call to action */}
      <div className="mobile-cta-bar">
        <Link className="btn btn-primary" href="/register">
          Build my Rental Passport &ndash; $54.99
        </Link>
      </div>
    </div>
    </DemoProvider>
  );
}
