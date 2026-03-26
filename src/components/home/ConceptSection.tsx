'use client';

import { useRef, useEffect } from 'react';

export function ConceptSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // The section is 200vh tall with a sticky inner element.
      // We want the text to start fading in as soon as the section
      // enters the viewport from below (rect.top < vh) and be fully
      // visible by the time the section top reaches the viewport top.
      //
      // t=0 when section bottom edge enters viewport (rect.top = vh)
      // t=1 when section top has scrolled fully past (rect.top = -(sectionH - vh))
      //
      // For early fade-in: start at t=0 (section just entering),
      // full opacity by t=0.15, hold, fade out in last 20%.
      const sectionH = rect.height;
      const totalScroll = sectionH; // total distance from entry to exit
      const scrolled = (vh - rect.top) / totalScroll;
      const t = Math.max(0, Math.min(1, scrolled));

      // More black space first (0-40%), fade in (40-60%), hold (60-75%), fade out (75-92%), small gap (92-100%)
      let op = 0;
      if (t < 0.40) {
        op = 0;
      } else if (t < 0.60) {
        op = (t - 0.40) / 0.20;
      } else if (t < 0.75) {
        op = 1;
      } else if (t < 0.92) {
        op = 1 - (t - 0.75) / 0.17;
      } else {
        op = 0;
      }

      content.style.opacity = String(Math.max(0, Math.min(1, op)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--bg-primary)]"
      style={{ height: '110vh' }}
    >
      <div
        ref={contentRef}
        className="sticky top-0 h-screen flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        <div className="max-w-2xl px-6 text-center">
          <p className="font-[family-name:var(--font-display)] text-xl md:text-2xl lg:text-3xl text-[var(--text-secondary)] leading-relaxed italic">
            Not to lecture. Not to perform. To dig into Scripture, into doubt, into the questions most people are afraid to ask. A space where faith gets pressure-tested and Christ remains the answer.
          </p>
        </div>
      </div>
    </section>
  );
}
