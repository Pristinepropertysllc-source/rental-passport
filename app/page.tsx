import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { PublicNav } from '@/components/PublicNav';

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === 'TENANT' ? '/dashboard' : '/landlord/dashboard');
  }

  return (
    <div>
      <PublicNav />

      {/* Hero */}
      <section className="lp-band">
        <div className="shell">
          <div className="hero">
            <h1>Apply Once. Rent Anywhere.</h1>
            <p>
              Build one verified Rental Passport and share it with as many landlords as
              you want &mdash; no re-typing your application for every property.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/register">
                Sign up
              </Link>
              <a className="btn btn-secondary" href="#pricing">
                See pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="lp-band lp-band-alt">
        <div className="shell">
          <div className="card">
            <h2>How it works</h2>
            <div className="section-list">
              <div className="section-row" style={{ alignItems: 'flex-start' }}>
                <div>
                  <strong>1. Build your Rental Passport</strong>
                  <p className="muted" style={{ margin: '4px 0 0' }}>
                    Personal information, employment &amp; income, rental history, references,
                    household details, and documents &mdash; all in one place.
                  </p>
                </div>
              </div>
              <div className="section-row" style={{ alignItems: 'flex-start' }}>
                <div>
                  <strong>2. Pay once for screening</strong>
                  <p className="muted" style={{ margin: '4px 0 0' }}>
                    A single payment covers your credit, background, and landlord history
                    screening &mdash; no per-property fees after that.
                  </p>
                </div>
              </div>
              <div className="section-row" style={{ alignItems: 'flex-start' }}>
                <div>
                  <strong>3. Share and track</strong>
                  <p className="muted" style={{ margin: '4px 0 0' }}>
                    Send your Passport to any landlord and follow application status, views, and
                    decisions from your dashboard.
                  </p>
                </div>
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

      {/* For Landlords */}
      <section className="lp-band lp-band-alt">
        <div className="shell">
          <div className="card">
            <h2>For Landlords</h2>
            <ul className="check-list">
              <li>Receive complete, standardized applications</li>
              <li>Review applicants faster</li>
              <li>Access organized, verified documents</li>
              <li>Reach applicants directly using the contact info on their application</li>
              <li>Keep applicant records organized in one dashboard</li>
            </ul>
          </div>

          <div className="landlord-cta">
            <h3>A More Organized Way to Review Applicants.</h3>
            <p className="muted" style={{ marginTop: 0 }}>
              Receive organized applicant information and screening documentation in one place,
              helping simplify the rental application process while keeping the applicant in
              control of their information.
            </p>
            <p className="muted" style={{ fontSize: 14 }}>
              Send prospective applicants a direct link to apply &mdash; no back-and-forth
              paperwork.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" href="/register">
                For Landlords
              </Link>
              <Link href="/landlords" className="btn btn-secondary">
                Learn More for Landlords &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="lp-band">
        <div className="shell">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>See what a shared Rental Passport looks like</h2>
            <p className="muted" style={{ marginTop: 0, marginBottom: 24 }}>
              A simplified preview &mdash; the real thing includes your full application and
              documents.
            </p>
            <div className="product-preview-frame">
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
                  <strong>Jordan Rivera&apos;s Rental Passport</strong>
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
                  <span className="muted">4 uploaded</span>
                </div>
              </div>
            </div>
          </div>
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
                  <li>Credit Check</li>
                  <li>Enhanced Landlord Search</li>
                  <li>National Criminal Search</li>
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

      {/* Security & Trust */}
      <section className="lp-band">
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
      <section className="lp-band lp-band-alt">
        <div className="shell">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>Frequently Asked Questions</h2>
            <p className="muted" style={{ marginTop: 0 }}>
              Everything you need to know about Rental Passport.
            </p>
            <Link className="btn btn-primary" href="/faq">
              View FAQ
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="lp-band">
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
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/login">Admin</Link>
        </div>
        <p className="muted" style={{ fontSize: 12, margin: 0 }}>
          &copy; {new Date().getFullYear()} Rental Passport
        </p>
      </footer>
    </div>
  );
}
