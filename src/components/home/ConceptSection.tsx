'use client';

import { useRef, useEffect, useState } from 'react';

const lines = [
  'Two men from the Kansas plains sat down to talk about God.',
  'Not to lecture. Not to perform.',
  'To dig — into Scripture, into doubt, into the questions most people are afraid to ask.',
  'Iron & Oak is a space where faith gets pressure-tested and Christ remains the answer.',
];

export function ConceptSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeLine, setActiveLine] = useState(-1);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: 0 when section top hits bottom of viewport, 1 when section bottom leaves top
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - vh)));

      // Map progress to which line is active
      const lineIndex = Math.floor(progress * lines.length);
      setActiveLine(Math.min(lineIndex, lines.length - 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={sectionRef} style={{ height: `${lines.length * 80 + 20}vh` }}>
      <div className="sticky top-0 h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="container-default max-w-3xl mx-auto px-6 text-center">
          {lines.map((line, i) => (
            <p
              key={i}
              className="font-[family-name:var(--font-display)] text-[var(--text-h2)] leading-relaxed text-[var(--text-primary)] absolute inset-x-6 top-1/2 -translate-y-1/2 max-w-3xl mx-auto transition-all duration-500 ease-out"
              style={{
                opacity: activeLine === i ? 1 : 0,
                transform: `translateY(${activeLine === i ? '-50%' : activeLine > i ? 'calc(-50% - 30px)' : 'calc(-50% + 30px)'})`,
                position: 'absolute',
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
