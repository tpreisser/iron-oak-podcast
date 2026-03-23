'use client';

import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';

const lines = [
  'Two men from the Kansas plains sat down to talk about God.',
  'Not to lecture. Not to perform.',
  'To dig — into Scripture, into doubt, into the questions most people are afraid to ask.',
  'Iron & Oak is a space where faith gets pressure-tested and Christ remains the answer.',
];

export function ConceptSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP((gsap, ScrollTrigger) => {
    if (!sectionRef.current || !containerRef.current) return;

    const lineElements = containerRef.current.querySelectorAll('.concept-line');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=200%', // more scroll room so lines breathe
        pin: true,
        scrub: 0.8, // slightly smoother scrub
      },
    });

    // Layout: each line gets ~20% of timeline
    // fade in (3%) → hold (12%) → fade out (3%) → gap (2%)
    lineElements.forEach((line, i) => {
      const start = i * 0.20;

      // Smooth fade in
      tl.fromTo(line,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' },
        start
      );

      // Dim out before next line (skip last)
      if (i < lines.length - 1) {
        tl.to(line,
          { opacity: 0.1, y: -8, duration: 0.04, ease: 'power2.in' },
          start + 0.16
        );
      }
    });

    // Last line holds, then everything fades
    tl.to(containerRef.current,
      { opacity: 0, duration: 0.06, ease: 'power2.in' },
      0.90
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="concept"
      className="relative min-h-screen flex items-center justify-center bg-[var(--bg-primary)]"
    >
      <div ref={containerRef} className="container-default max-w-3xl mx-auto px-6">
        {lines.map((line, i) => (
          <p
            key={i}
            className="concept-line font-[family-name:var(--font-display)] text-[var(--text-h2)] leading-relaxed text-[var(--text-primary)] mb-8 last:mb-0 will-change-[opacity,transform] opacity-0"
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
