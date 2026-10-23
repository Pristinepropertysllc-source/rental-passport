// Visual "how it works" for the landing page: four small phone screens that walk
// through the renter's process, ending with the landlord opening the link for free.
// Drawn with HTML/CSS (no images) so the text stays sharp and easy to edit.

const STEPS = [
  {
    title: 'Fill it out once',
    text: 'One application, saved as you go. Add your ID and pay stubs from your phone.',
    screen: (
      <>
        <div className="ps-screen-title">My Rental Passport</div>
        <div className="ps-muted">Step 2 of 7 · Employment</div>
        <div className="ps-bar"><span style={{ width: '35%' }} /></div>
        <div className="ps-field"><label>Employer</label><div>Bright Dental Group</div></div>
        <div className="ps-field"><label>Monthly income</label><div>$4,800</div></div>
        <div className="ps-doc">📄 Paystub-Oct.pdf <b>✓</b></div>
        <div className="ps-btn">Next</div>
      </>
    )
  },
  {
    title: 'Get screened once',
    text: '$54.99, one time. Credit, criminal, eviction, income and rental history in one report.',
    screen: (
      <>
        <div className="ps-screen-title">Your screening</div>
        <div className="ps-muted">Completed Oct 21</div>
        {['Credit report', 'Criminal history', 'Eviction history', 'Income verified', 'Rental history'].map((r) => (
          <div className="ps-row" key={r}>
            <span>{r}</span>
            <b className="ps-ok">✓</b>
          </div>
        ))}
      </>
    )
  },
  {
    title: 'Text or email it to any landlord',
    text: 'You get a private link. Send it to as many landlords as you want, and turn off access any time.',
    screen: (
      <>
        <div className="ps-chat-head">Landlord · 123 Oak St</div>
        <div className="ps-bubble ps-bubble-them">Hi! Still available. Can you send an application?</div>
        <div className="ps-bubble ps-bubble-me">
          Here&apos;s my Rental Passport, a Maryland reusable screening report. Free to view:
          <span className="ps-link">myrentalpassport.net/share/…</span>
        </div>
        <div className="ps-muted ps-right">Delivered</div>
      </>
    )
  },
  {
    title: 'The landlord opens it free',
    text: 'No account and no cost for them. Landlords who accept it can’t charge you an application fee (MD §8-218).',
    screen: (
      <>
        <div className="ps-banner">Free to view · No account needed</div>
        <div className="ps-screen-title">Alex Morgan</div>
        <div className="ps-muted">Reusable screening report · Oct 21</div>
        <div className="ps-row"><span>Screening</span><b className="ps-ok">Complete</b></div>
        <div className="ps-row"><span>Application</span><b className="ps-ok">Complete</b></div>
        <div className="ps-row"><span>Documents</span><span>7 files</span></div>
        <div className="ps-btn ps-btn-light">View full passport</div>
      </>
    )
  }
];

export function ProcessSteps() {
  return (
    <>
    <ol className="ps-grid">
      {STEPS.map((s, i) => (
        <li className="ps-step" key={s.title}>
          <div className="ps-phone" aria-hidden="true">
            <div className="ps-notch" />
            <div className="ps-phone-body">{s.screen}</div>
          </div>
          <div className="ps-caption">
            <span className="hw-num">{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
    <p className="ps-swipe-hint">Swipe to see all 4 steps →</p>
    </>
  );
}
