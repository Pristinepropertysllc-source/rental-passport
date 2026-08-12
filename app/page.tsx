import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === 'TENANT' ? '/dashboard' : '/landlord/dashboard');
  }

  return (
    <div className="shell">
      {/* Hero */}
      <div className="hero">
        <h1>Apply Once. Rent Anywhere.</h1>
        <p>
          Build one verified Rental Passport and share it with as many landlords as
          you want &mdash; no re-typing your application for every property.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#pricing">
            See pricing
          </a>
          <Link className="btn btn-secondary" href="/login">
            Log in
          </Link>
        </div>
      </div>

      {/* Problem */}
      <div className="card">
        <h2>The problem with renting today</h2>
        <p className="muted" style={{ marginTop: 0 }}>Right now, renters have to:</p>
        <ul className="check-list">
          <li>Fill out the same application over and over</li>
          <li>Upload the same documents to every landlord</li>
          <li>Contact the same references multiple times</li>
          <li>Pay separate application fees at every property</li>
        </ul>
        <p className="muted" style={{ marginBottom: 0 }}>
          Rental Passport solves this with one reusable rental application &mdash; built once,
          shared everywhere.
        </p>
      </div>

      {/* How it works */}
      <div className="card">
        <h2>How it works</h2>
        <div className="section-list">
          <div className="section-row" style={{ alignItems: 'flex-start' }}>
            <div>
              <strong>1. Create your Rental Passport</strong>
              <p className="muted" style={{ margin: '4px 0 0' }}>
                Personal information, employment &amp; income, rental history, references,
                documents, and your screening results &mdash; all in one place.
              </p>
            </div>
          </div>
          <div className="section-row" style={{ alignItems: 'flex-start' }}>
            <div>
              <strong>2. Share with any landlord</strong>
              <p className="muted" style={{ margin: '4px 0 0' }}>
                You control what information is shared, which documents are visible, and how
                long access lasts.
              </p>
            </div>
          </div>
          <div className="section-row" style={{ alignItems: 'flex-start' }}>
            <div>
              <strong>3. Track every application</strong>
              <p className="muted" style={{ margin: '4px 0 0' }}>
                See every property you've applied to, who you've contacted, application
                status, profile views, and approval or denial updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="card" id="pricing">
        <h2>Create Your Rental Passport Once. Use It Everywhere.</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Build one verified rental profile and reuse it every time you apply &mdash; pay once
          for your screening, then share with as many landlords as you need at no extra cost.
        </p>
        <div className="grid-2">
          <div className="pricing-card">
            <h3>Essential Screening</h3>
            <p className="price-tag">$54.99</p>
            <ul className="check-list">
              <li>Credit Check</li>
              <li>Enhanced Landlord Search</li>
              <li>National Criminal Search</li>
            </ul>
            <p className="muted" style={{ fontSize: 14 }}>
              Best for renters who need a verified application ready to share.
            </p>
            <Link className="btn btn-primary" href="/register?package=ESSENTIAL">
              Get started
            </Link>
          </div>
          <div className="pricing-card pricing-card-highlight">
            <h3>Complete Screening</h3>
            <p className="price-tag">$74.99</p>
            <ul className="check-list">
              <li>Credit Check</li>
              <li>Enhanced Landlord Search</li>
              <li>National Criminal Search</li>
              <li>Identity Verification</li>
            </ul>
            <p className="muted" style={{ fontSize: 14 }}>
              Recommended for renters who want the strongest application profile.
            </p>
            <Link className="btn btn-primary" href="/register?package=COMPLETE">
              Get started
            </Link>
          </div>
        </div>
      </div>

      {/* Trust and sharing */}
      <div className="card">
        <h2>Your Rental Passport belongs to you.</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Once your screening is complete, you decide who sees it. Share a secure link with any
          landlord &mdash; they can view your application without creating an account.
        </p>
        <ul className="check-list">
          <li>Secure, unique application links</li>
          <li>Document sharing controls</li>
          <li>Access expiration settings</li>
          <li>Application viewing history</li>
          <li>Revoke access at any time</li>
        </ul>
      </div>

      {/* Audience sections */}
      <div className="grid-2">
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
        <div className="card">
          <h2>For Landlords</h2>
          <ul className="check-list">
            <li>Receive complete, standardized applications</li>
            <li>Review applicants faster</li>
            <li>Access organized, verified documents</li>
            <li>Communicate directly with applicants</li>
            <li>Keep applicant records organized in one dashboard</li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Apply Once. Rent Anywhere.</h2>
        <div className="hero-actions" style={{ marginTop: 14 }}>
          <a className="btn btn-primary" href="#pricing">
            Get started
          </a>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <Link href="/login" className="muted" style={{ fontSize: 13 }}>
          Admin
        </Link>
      </div>
    </div>
  );
}
