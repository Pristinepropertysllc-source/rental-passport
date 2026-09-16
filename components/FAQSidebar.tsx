'use client';

import { useState, useRef, KeyboardEvent } from 'react';

export function FAQSidebar({ items }: { items: { question: string; answer: string }[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (e.key === 'ArrowDown') next = (index + 1) % items.length;
    else if (e.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    else return;

    e.preventDefault();
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  }

  const active = items[activeIndex];

  return (
    <div className="faq-sidebar-layout">
      <div className="faq-sidebar-nav" role="tablist" aria-orientation="vertical" aria-label="Frequently asked questions">
        {items.map((item, i) => (
          <button
            key={i}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`faq-tab-${i}`}
            aria-selected={activeIndex === i}
            aria-controls="faq-tabpanel"
            tabIndex={activeIndex === i ? 0 : -1}
            className={`faq-sidebar-item ${activeIndex === i ? 'faq-sidebar-item-active' : ''}`}
            onClick={() => setActiveIndex(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            {item.question}
          </button>
        ))}
      </div>

      <div
        id="faq-tabpanel"
        role="tabpanel"
        aria-labelledby={`faq-tab-${activeIndex}`}
        className="faq-sidebar-content"
        tabIndex={0}
      >
        <h3 style={{ marginTop: 0 }}>{active.question}</h3>
        <p className="muted" style={{ margin: 0, whiteSpace: 'pre-line', lineHeight: 1.6 }}>
          {active.answer}
        </p>
      </div>
    </div>
  );
}
