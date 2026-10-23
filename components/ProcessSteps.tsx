// Visual 4-step "How it works": small phone mockups drawn in HTML/CSS
// (no images), with a caption under each. The phones are decorative.
const STEPS = [
  {
    title: 'Fill it out once',
    text: 'One application, saved as you go. Add your ID and pay stubs from your phone.'
  },
  {
    title: 'Get screened once',
    text: '$54.99, one time. Credit, criminal, eviction, income and rental history in one report.'
  },
  {
    title: 'Text or email it to any landlord',
    text: 'You get a private link. Send it to as many landlords as you want, and turn off access any time.'
  },
  {
    title: 'The landlord opens it free',
    text: "No account and no cost for them. Landlords who accept it can't charge you an application fee (MD §8-218)."
  }
];

function PhoneOne() {
  return (
    <div className="ps-screen">
      <div className="ps-s-title">My Rental Passport</div>
      <div className="ps-s-sub">Step 2 of 7 &middot; Employment</div>
      <div className="ps-bar"><span style={{ width: '35%' }} /></div>
      <div className="ps-field">
        <span className="ps-label">Employer</span>
        <span className="ps-input">Bright Dental Group</span>
      </div>
      <div className="ps-field">
        <span className="ps-label">Monthly income</span>
        <span className="ps-input">$4,800</span>
      </div>
      <div className="ps-file">&#128196; Paystub-Oct.pdf &#10003;</div>
      <div className="ps-next">Next</div>
    </div>
  );
}

function PhoneTwo() {
  const rows = ['Credit report', 'Criminal history', 'Eviction history', 'Income verified', 'Rental history'];
  return (
    <div className="ps-screen">
      <div className="ps-s-title">Your screening</div>
      <div className="ps-s-sub">Completed Oct 21</div>
      <div className="ps-rows">
        {rows.map((r) => (
          <div className="ps-row" key={r}>
            <span>{r}</span>
            <span className="ps-check">&#10003;</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneThree() {
  return (
    <div className="ps-screen ps-screen-chat">
      <div className="ps-chat-head">Landlord &middot; 123 Oak St</div>
      <div className="ps-chat">
        <div className="ps-bubble ps-bubble-in">Hi! Still available. Can you send an application?</div>
        <div className="ps-bubble ps-bubble-out">
          Here&apos;s my Rental Passport, a Maryland reusable screening report. Free to view:{' '}
          <span className="ps-link">myrentalpassport.net/share/&hellip;</span>
        </div>
        <div className="ps-delivered">Delivered</div>
      </div>
    </div>
  );
}

function PhoneFour() {
  return (
    <div className="ps-screen">
      <div className="ps-banner">Free to view &middot; No account needed</div>
      <div className="ps-s-title">Alex Morgan</div>
      <div className="ps-s-sub">Reusable screening report &middot; Oct 21</div>
      <div className="ps-rows">
        <div className="ps-row"><span>Screening</span><span className="ps-ok">Complete</span></div>
        <div className="ps-row"><span>Application</span><span className="ps-ok">Complete</span></div>
        <div className="ps-row"><span>Documents</span><span className="ps-muted">7 files</span></div>
      </div>
      <div className="ps-view">View full passport</div>
    </div>
  );
}

const SCREENS = [PhoneOne, PhoneTwo, PhoneThree, PhoneFour];

export function ProcessSteps() {
  return (
    <div className="ps">
      <div className="ps-track">
        {STEPS.map((step, i) => {
          const Screen = SCREENS[i];
          return (
            <div className="ps-item" key={step.title}>
              <div className="ps-step">
                <div className="ps-phone" aria-hidden="true">
                  <Screen />
                </div>
                <div className="ps-cap">
                  <span className="hw-num">{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <span className="ps-arrow" aria-hidden="true">
                  &rarr;
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="ps-swipe">Swipe to see all 4 steps &rarr;</p>
    </div>
  );
}
