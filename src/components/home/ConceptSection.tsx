'use client';

import { useRef, useEffect, useState } from 'react';

const lines = [
  'Two men from the Kansas plains sat down to talk about God.',
  'Not to lecture. Not to perform.',
  'To dig — into Scripture, into doubt, into the questions most people are afraid to ask.',
  'Iron & Oak is a space where faith gets pressure-tested and Christ remains the answer.',
];

function Line({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '-30% 0px -30% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="py-[15vh]">
      <p
        className="font-[family-name:var(--font-display)] text-[var(--text-h2)] leading-relaxed text-[var(--text-primary)] text-center max-w-3xl mx-auto px-6"
        style={{
          opacity: visible ? 1 : 0.05,
          transform: visible ? 'none' : 'translateY(15px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {text}
      </p>
    </div>
  );
}

export function ConceptSection() {
  return (
    <section id="concept" className="bg-[var(--bg-primary)] py-12">
      {lines.map((line, i) => (
        <Line key={i} text={line} />
      ))}
    </section>
  );
}
