'use client';

import { useState } from 'react';

const DOCS = [
  { label: 'Government ID', file: 'government-id.pdf' },
  { label: 'Pay Stub', file: 'pay-stub.pdf' },
  { label: 'Bank Statement', file: 'bank-statement.pdf' },
  { label: 'Tax Document', file: 'tax-document.pdf' },
  { label: 'Offer Letter', file: 'offer-letter.pdf' },
  { label: 'Pet Record', file: 'pet-record.pdf' },
  { label: 'Other', file: 'other-document.pdf' }
];

function SampleTag() {
  return <span className="demo-sample-tag">SAMPLE / DEMO</span>;
}

export function Step1Build() {
  const sections = [
    'Personal Information',
    'Employment & Income',
    'Rental History',
    'References',
    'Documents',
    'Screening Information'
  ];
  return (
    <div>
      <SampleTag />
      <h3 style={{ marginTop: 0 }}>Build Your Rental Passport</h3>
      <p className="muted" style={{ fontSize: 14 }}>
        Alex Morgan (sample applicant) completes their information once.
      </p>
      <div className="card" style={{ margin: 0 }}>
        <div className="section-list">
          {sections.map((s) => (
            <div className="section-row" key={s}>
              <span>{'\u2713'} {s}</span>
              <span className="badge badge-approved">Complete</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Step2Upload() {
  return (
    <div>
      <SampleTag />
      <h3 style={{ marginTop: 0 }}>Upload Your Documents</h3>
      <p className="muted" style={{ fontSize: 14 }}>
        Each sample file below is a fictional demonstration document &mdash; not a real record.
      </p>
      <div className="demo-doc-grid">
        {DOCS.map((d) => (
          <div className="demo-doc-card" key={d.file}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: 14 }}>{d.label}</strong>
              <span className="badge badge-approved" style={{ fontSize: 11 }}>
                Uploaded
              </span>
            </div>
            <a
              href={`/demo-docs/${d.file}`}
              target="_blank"
              rel="noreferrer"
              className="demo-trigger-btn"
              style={{ fontSize: 13 }}
            >
              View Sample &rarr;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

type PassportSection = {
  key: string;
  title: string;
  summary: string;
  detail: React.ReactNode;
};

const PASSPORT_SECTIONS: PassportSection[] = [
  {
    key: 'personal',
    title: 'Personal Information',
    summary: 'Sample information on file',
    detail: (
      <div className="section-list">
        <div className="section-row"><span>Name</span><span className="muted">Alex Morgan</span></div>
        <div className="section-row"><span>Date of Birth</span><span className="muted">05/14/1994</span></div>
        <div className="section-row"><span>Address</span><span className="muted">210 Maple Court, Unit 4B, Rivergate, SM</span></div>
        <div className="section-row"><span>Email</span><span className="muted">alex.morgan@sample-demo.example</span></div>
      </div>
    )
  },
  {
    key: 'employment',
    title: 'Employment & Income',
    summary: 'Sample employer & income',
    detail: (
      <div className="section-list">
        <div className="section-row"><span>Employer</span><span className="muted">Northfield Retail Group</span></div>
        <div className="section-row"><span>Position</span><span className="muted">Operations Associate</span></div>
        <div className="section-row"><span>Annual Income</span><span className="muted">$46,200.00</span></div>
      </div>
    )
  },
  {
    key: 'rental',
    title: 'Rental History',
    summary: 'Sample rental history',
    detail: (
      <div className="section-list">
        <div className="section-row"><span>Landlord</span><span className="muted">Priya Anand, Rivergate Property Management</span></div>
        <div className="section-row"><span>Rent</span><span className="muted">$1,275.00 / month</span></div>
        <div className="section-row"><span>Tenancy</span><span className="muted">06/2023 &ndash; 07/2026</span></div>
      </div>
    )
  },
  {
    key: 'references',
    title: 'References',
    summary: 'Sample references',
    detail: (
      <div className="section-list">
        <div className="section-row"><span>Taylor Brooks</span><span className="muted">Former Roommate</span></div>
      </div>
    )
  },
  {
    key: 'documents',
    title: 'Documents',
    summary: '7 sample documents available',
    detail: (
      <div className="demo-doc-grid">
        {DOCS.map((d) => (
          <div className="demo-doc-card" key={d.file}>
            <strong style={{ fontSize: 13 }}>{d.label}</strong>
            <a href={`/demo-docs/${d.file}`} target="_blank" rel="noreferrer" className="demo-trigger-btn" style={{ fontSize: 13 }}>
              View Sample &rarr;
            </a>
          </div>
        ))}
      </div>
    )
  },
  {
    key: 'screening',
    title: 'Screening',
    summary: 'Sample screening results',
    detail: (
      <div>
        <div className="section-list" style={{ marginBottom: 10 }}>
          <div className="section-row"><span>Credit Screening</span><span className="badge badge-approved">COMPLETED</span></div>
          <div className="section-row"><span>Background Screening</span><span className="badge badge-approved">COMPLETED</span></div>
          <div className="section-row"><span>Landlord Search</span><span className="badge badge-approved">COMPLETED</span></div>
        </div>
        <a href="/demo-docs/sample-screening-report.pdf" target="_blank" rel="noreferrer" className="demo-trigger-btn" style={{ fontSize: 13 }}>
          View Sample Screening Report &rarr;
        </a>
      </div>
    )
  }
];

export function Step3Passport() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div>
      <SampleTag />
      <h3 style={{ marginTop: 0 }}>Alex Morgan&apos;s Rental Passport</h3>
      <p className="muted" style={{ fontSize: 13, marginTop: -6 }}>Click any section to see sample detail.</p>
      <div className="card" style={{ margin: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <strong>Applicant: Alex Morgan</strong>
          <span className="badge badge-approved">Application Complete</span>
        </div>
        <div className="section-list">
          {PASSPORT_SECTIONS.map((s) => {
            const isOpen = openKey === s.key;
            return (
              <div key={s.key}>
                <button
                  type="button"
                  className="section-row"
                  style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)', background: isOpen ? 'var(--band-alt)' : 'transparent' }}
                  onClick={() => setOpenKey(isOpen ? null : s.key)}
                >
                  <span>{s.title}</span>
                  <span className="muted" style={{ fontSize: 13 }}>
                    {s.summary} {isOpen ? '▴' : '▾'}
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '10px 14px', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', marginBottom: 8 }}>
                    {s.detail}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="muted" style={{ fontSize: 12, marginTop: 14, marginBottom: 14 }}>
          Screening status labels like &ldquo;Completed&rdquo; or &ldquo;Verified&rdquo; only appear once an
          actual screening report has been added to a real Rental Passport.
        </p>
        <a href="/demo-docs/complete-rental-passport.pdf" target="_blank" rel="noreferrer" className="btn btn-primary">
          Download / View Complete Sample (All-in-One PDF) &rarr;
        </a>
      </div>
    </div>
  );
}

export function Step4Share() {
  return (
    <div>
      <SampleTag />
      <h3 style={{ marginTop: 0 }}>Share Your Rental Passport</h3>
      <p className="muted" style={{ fontSize: 14 }}>
        This mirrors the actual Share page &mdash; a landlord email and an optional link
        expiration.
      </p>
      <div className="card" style={{ margin: 0 }}>
        <div className="field">
          <label>Landlord email</label>
          <input defaultValue="landlord@example.com" disabled />
        </div>
        <div className="field">
          <label>Link expires in (days, optional)</label>
          <input defaultValue="30" disabled />
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>What&apos;s included:</p>
        <p className="muted" style={{ fontSize: 12, marginTop: 0 }}>
          Sharing currently includes your complete Rental Passport &mdash; there isn&apos;t a way to
          share only part of it yet.
        </p>
        {[
          'Application Information',
          'Employment & Income',
          'Rental History',
          'References',
          'Documents',
          'Screening Information'
        ].map((label) => (
          <label className="demo-checkbox-row" key={label}>
            <input type="checkbox" checked disabled />
            {label}
          </label>
        ))}

        <button className="btn btn-primary" type="button" disabled style={{ marginTop: 12 }}>
          Send Invite
        </button>
      </div>
    </div>
  );
}

export function Step5Landlord() {
  return (
    <div>
      <SampleTag />
      <h3 style={{ marginTop: 0 }}>What the Landlord Sees</h3>
      <p className="muted" style={{ fontSize: 14 }}>
        After Alex shares their Rental Passport, this is what the landlord opens &mdash; no
        account required to view it.
      </p>
      <div className="card" style={{ margin: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <strong>Alex Morgan&apos;s Rental Passport</strong>
          <span className="badge badge-approved">Access Granted</span>
        </div>
        <p className="muted" style={{ fontSize: 12, marginTop: 0 }}>
          Shared by applicant &middot; Access expires: 10/15/2026
        </p>
        <div className="section-list" style={{ marginBottom: 14 }}>
          {[
            'Personal Information',
            'Employment & Income',
            'Rental History',
            'References',
            'Documents',
            'Screening Information'
          ].map((label) => (
            <div className="section-row" key={label}>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" type="button" disabled>
            Approve Applicant
          </button>
          <button className="btn btn-danger" type="button" disabled>
            Deny
          </button>
        </div>
        <p className="muted" style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
          Alex can revoke this landlord&apos;s access at any time from their own dashboard.
        </p>
      </div>
    </div>
  );
}
