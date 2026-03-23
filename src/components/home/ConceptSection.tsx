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

    // Pin the section for the duration of all line reveals
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=150%`,
      pin: true,
    });

    // Animate each line: fade in, then dim when the next line appears
    lineElements.forEach((line, i) => {
      // Fade in this line
      gsap.fromTo(line,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `${(i / lines.length) * 100}% top`,
            end: `${((i + 0.5) / lines.length) * 100}% top`,
            scrub: true,
          },
        }
      );

      // Dim this line when the next line starts appearing (skip the last line)
      if (i < lines.length - 1) {
        gsap.to(line, {
          opacity: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `${((i + 0.8) / lines.length) * 100}% top`,
            end: `${((i + 1) / lines.length) * 100}% top`,
            scrub: true,
          },
        });
      }
    });
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
            className="concept-line font-[family-name:var(--font-display)] text-[var(--text-h2)] leading-relaxed text-[var(--text-primary)] mb-8 last:mb-0 will-change-[opacity,transform]"
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
