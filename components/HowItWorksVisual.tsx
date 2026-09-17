'use client';

import { useEffect, useRef, useState } from 'react';

function Icon({ path, viewBox = '0 0 24 24' }: { path: string; viewBox?: string }) {
  return (
    <svg width="16" height="16" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  person: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 3.5-6 8-6s8 2 8 6',
  briefcase: 'M3 8h18v11H3V8zM8 8V6a2 2 0 012-2h4a2 2 0 012 2v2',
  dollar: 'M12 3v18M8 7h5a3 3 0 010 6H9a3 3 0 000 6h6',
  home: 'M4 11l8-7 8 7M6 10v10h12V10',
  document: 'M7 3h7l5 5v13H7V3zM14 3v5h5',
  household: 'M7 12a3 3 0 100-6 3 3 0 000 6zM17 12a3 3 0 100-6 3 3 0 000 6zM2 21c0-3 2.5-5 5-5h0M22 21c0-3-2.5-5-5-5h0M9.5 21c0-3 1.5-5 2.5-5s2.5 2 2.5 5',
  shield: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z',
  check: 'M20 6L9 17l-5-5'
};

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export function HowItWorksVisual() {
  const step1 = useReveal();
  const step2 = useReveal();
  const step3 = useReveal();

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: 4 }}>How It Works</h2>
      <p className="hiw-subtitle">One Rental Passport. Three simple steps.</p>

      <div className="hiw-journey">
        {/* Step 1: Build */}
        <div ref={step1.ref} className={`hiw-step ${step1.visible ? 'hiw-step-visible' : ''}`}>
          <div className="hiw-badge">1</div>
          <div className="hiw-card">
            <div className="hiw-chips">
              <span className="hiw-chip"><Icon path={ICONS.person} /> Personal Info</span>
              <span className="hiw-chip"><Icon path={ICONS.briefcase} /> Employment</span>
              <span className="hiw-chip"><Icon path={ICONS.dollar} /> Income</span>
              <span className="hiw-chip"><Icon path={ICONS.home} /> Rental History</span>
              <span className="hiw-chip"><Icon path={ICONS.document} /> Documents</span>
              <span className="hiw-chip"><Icon path={ICONS.household} /> Household</span>
            </div>
            <div className="hiw-arrow-down">
              <Icon path="M12 5v14M19 12l-7 7-7-7" />
            </div>
            <div className="hiw-passport-mini">
              <div className="hiw-passport-mini-label">Rental Passport</div>
              <div className="hiw-passport-mini-name">Alex Morgan (sample)</div>
              <div className="hiw-passport-mini-check"><Icon path={ICONS.check} /> Application</div>
              <div className="hiw-passport-mini-check"><Icon path={ICONS.check} /> Employment</div>
              <div className="hiw-passport-mini-check"><Icon path={ICONS.check} /> Rental History</div>
              <div className="hiw-passport-mini-check"><Icon path={ICONS.check} /> Documents</div>
            </div>
          </div>
          <h3 className="hiw-step-title">1. Build Your Passport</h3>
          <p className="hiw-step-desc">Put your rental information and documents in one place.</p>
        </div>

        <div className="hiw-connector"><div className="hiw-connector-line" /></div>

        {/* Step 2: Screen */}
        <div ref={step2.ref} className={`hiw-step ${step2.visible ? 'hiw-step-visible' : ''}`}>
          <div className="hiw-badge">2</div>
          <div className="hiw-card">
            <div className="hiw-passport-mini" style={{ maxWidth: 220, padding: '10px 16px' }}>
              <div className="hiw-passport-mini-label">Rental Passport</div>
            </div>
            <div className="hiw-arrow-down">
              <Icon path={ICONS.shield} />
            </div>
            <div className="hiw-check-row">
              <span className="hiw-check-item"><Icon path={ICONS.check} /> Credit Check</span>
              <span className="hiw-check-item"><Icon path={ICONS.check} /> Background Check</span>
              <span className="hiw-check-item"><Icon path={ICONS.check} /> Landlord Search</span>
            </div>
            <span className="hiw-complete-badge">Screening Complete</span>
          </div>
          <h3 className="hiw-step-title">2. Complete Your Screening</h3>
          <p className="hiw-step-desc">Pay once for your screening and get your Passport ready to share.</p>
        </div>

        <div className="hiw-connector"><div className="hiw-connector-line" /></div>

        {/* Step 3: Share & Track */}
        <div ref={step3.ref} className={`hiw-step ${step3.visible ? 'hiw-step-visible' : ''}`}>
          <div className="hiw-badge">3</div>
          <div className="hiw-card">
            <div className="hiw-share-row">
              <div className="hiw-share-side">
                <div className="hiw-share-icon"><Icon path={ICONS.person} viewBox="0 0 24 24" /></div>
                Renter
              </div>
              <div className="hiw-share-arrow">
                <Icon path="M5 12h14M13 6l6 6-6 6" />
                Share securely
              </div>
              <div className="hiw-share-side">
                <div className="hiw-share-icon"><Icon path={ICONS.home} /></div>
                Landlord
              </div>
            </div>
            <div className="hiw-check-row">
              <span className="hiw-check-item"><Icon path={ICONS.check} /> Application</span>
              <span className="hiw-check-item"><Icon path={ICONS.check} /> Income</span>
              <span className="hiw-check-item"><Icon path={ICONS.check} /> Documents</span>
              <span className="hiw-check-item"><Icon path={ICONS.check} /> Screening</span>
            </div>
            <div className="hiw-track-row">
              <span className="hiw-track-pill">Shared</span>
              <span className="hiw-track-pill">Viewed</span>
              <span className="hiw-track-pill">Decision</span>
            </div>
          </div>
          <h3 className="hiw-step-title">3. Share &amp; Track</h3>
          <p className="hiw-step-desc">Send your Passport to landlords and follow your applications from your dashboard.</p>
        </div>
      </div>
    </div>
  );
}
