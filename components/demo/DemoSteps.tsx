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

export function Step3Passport() {
  return (
    <div>
      <SampleTag />
      <h3 style={{ marginTop: 0 }}>Alex Morgan&apos;s Rental Passport</h3>
      <div className="card" style={{ margin: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <strong>Applicant: Alex Morgan</strong>
          <span className="badge badge-approved">Application Complete</span>
        </div>
        <div className="section-list">
          <div className="section-row">
            <span>Personal Information</span>
            <span className="muted" style={{ fontSize: 13 }}>Sample information on file</span>
          </div>
          <div className="section-row">
            <span>Employment &amp; Income</span>
            <span className="muted" style={{ fontSize: 13 }}>Sample employer &amp; income</span>
          </div>
          <div className="section-row">
            <span>Rental History</span>
            <span className="muted" style={{ fontSize: 13 }}>Sample rental history</span>
          </div>
          <div className="section-row">
            <span>References</span>
            <span className="muted" style={{ fontSize: 13 }}>Sample references</span>
          </div>
          <div className="section-row">
            <span>Documents</span>
            <span className="muted" style={{ fontSize: 13 }}>7 sample documents available</span>
          </div>
          <div className="section-row">
            <span>Screening</span>
            <span className="muted" style={{ fontSize: 13 }}>Sample screening results</span>
          </div>
        </div>
        <p className="muted" style={{ fontSize: 12, marginTop: 14, marginBottom: 0 }}>
          Screening status labels like &ldquo;Completed&rdquo; or &ldquo;Verified&rdquo; only appear once an
          actual screening report has been added to a real Rental Passport.
        </p>
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
