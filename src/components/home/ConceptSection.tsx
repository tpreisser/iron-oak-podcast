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
      const sectionH = rect.height;

      // t = 0 when the section top hits the viewport top (fully scrolled into view)
      // t = 1 when the section has been fully scrolled through
      // Before t=0 (section still below viewport top), opacity stays 0
      const t = Math.max(0, Math.min(1, -rect.top / (sectionH - vh)));

      // Fade in (0-30%), hold (30-80%), fade out (80-100%)
      let op = 0;
      if (t < 0.30) {
        op = t / 0.30;
      } else if (t < 0.80) {
        op = 1;
      } else {
        op = 1 - (t - 0.80) / 0.20;
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
      style={{ height: '150vh' }}
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
