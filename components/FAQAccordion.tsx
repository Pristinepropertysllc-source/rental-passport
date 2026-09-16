'use client';

import { useState } from 'react';

export function FAQAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;
        return (
          <div className="faq-item" key={i}>
            <h3 style={{ margin: 0 }}>
              <button
                id={buttonId}
                className="faq-question"
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span>{item.question}</span>
                <span className={`faq-icon ${isOpen ? 'faq-icon-open' : ''}`} aria-hidden="true">
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`faq-answer-wrapper ${isOpen ? 'faq-answer-open' : ''}`}
            >
              <div className="faq-answer-inner">
                <p className="muted" style={{ margin: 0, whiteSpace: 'pre-line' }}>
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
