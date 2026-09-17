'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import {
  Step1Build,
  Step2Upload,
  Step3Passport,
  Step4Share,
  Step5Landlord
} from './DemoSteps';

type DemoContextType = {
  isOpen: boolean;
  step: number;
  openDemo: (step?: number) => void;
  closeDemo: () => void;
  setStep: (step: number) => void;
};

const DemoContext = createContext<DemoContextType | null>(null);

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  const openDemo = (startStep = 1) => {
    setStep(startStep);
    setIsOpen(true);
  };
  const closeDemo = () => setIsOpen(false);

  return (
    <DemoContext.Provider value={{ isOpen, step, openDemo, closeDemo, setStep }}>
      {children}
      {isOpen && <DemoModal />}
    </DemoContext.Provider>
  );
}

export function DemoTriggerButton({
  step = 1,
  className = 'btn btn-primary',
  children
}: {
  step?: number;
  className?: string;
  children: ReactNode;
}) {
  const { openDemo } = useDemo();
  return (
    <button type="button" className={className} onClick={() => openDemo(step)}>
      {children}
    </button>
  );
}

const STEPS = [
  { n: 1, label: 'Build' },
  { n: 2, label: 'Upload' },
  { n: 3, label: 'Passport' },
  { n: 4, label: 'Share' },
  { n: 5, label: 'Landlord View' }
];

function DemoModal() {
  const { step, setStep, closeDemo } = useDemo();

  function next() {
    if (step < 5) setStep(step + 1);
  }
  function prev() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div
      className="demo-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Rental Passport interactive demo"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDemo();
      }}
    >
      <div className="demo-modal">
        <div className="demo-modal-header">
          <strong>See Rental Passport in Action</strong>
          <button className="btn btn-secondary btn-sm" type="button" onClick={closeDemo}>
            Exit Demo
          </button>
        </div>

        <div className="demo-progress">
          {STEPS.map((s, i) => (
            <div className="demo-progress-step" key={s.n}>
              <span
                className={`demo-progress-dot ${
                  step === s.n ? 'demo-progress-dot-active' : step > s.n ? 'demo-progress-dot-done' : ''
                }`}
              >
                {step > s.n ? '\u2713' : s.n}
              </span>
              <span>{s.label}</span>
              {i < STEPS.length - 1 && <span className="demo-progress-arrow">&rarr;</span>}
            </div>
          ))}
        </div>

        <div className="demo-modal-body">
          {step === 1 && <Step1Build />}
          {step === 2 && <Step2Upload />}
          {step === 3 && <Step3Passport />}
          {step === 4 && <Step4Share />}
          {step === 5 && <Step5Landlord />}
        </div>

        <div className="demo-modal-footer">
          <button className="btn btn-secondary" type="button" onClick={prev} disabled={step === 1}>
            &larr; Previous
          </button>
          <span className="muted" style={{ fontSize: 13 }}>
            Step {step} of 5
          </span>
          {step < 5 ? (
            <button className="btn btn-primary" type="button" onClick={next}>
              Next &rarr;
            </button>
          ) : (
            <button className="btn btn-primary" type="button" onClick={closeDemo}>
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
