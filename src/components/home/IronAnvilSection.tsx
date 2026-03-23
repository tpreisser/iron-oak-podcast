'use client';

import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';

function AnvilSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} fill="none">
      <path d="M 100 280 L 110 240 L 290 240 L 300 280 Z" fill="var(--accent-iron)" opacity="0.8" />
      <rect x="130" y="200" width="140" height="40" rx="4" fill="var(--accent-iron)" opacity="0.9" />
      <path d="M 80 200 L 90 160 L 310 160 L 320 200 Z" fill="var(--accent-iron-light)" />
      <path d="M 70 160 L 80 130 L 320 130 L 330 160 Z" fill="var(--accent-iron-light)" opacity="0.95" />
      <path d="M 80 130 C 60 128, 30 135, 10 145 L 10 150 C 30 143, 60 140, 80 160 Z" fill="var(--accent-iron)" opacity="0.85" />
      <rect x="260" y="130" width="15" height="15" rx="1" fill="var(--bg-primary)" opacity="0.6" />
      <circle cx="240" cy="138" r="5" fill="var(--bg-primary)" opacity="0.5" />
      <path d="M 85 132 L 315 132 L 325 155 L 75 155 Z" fill="white" opacity="0.06" />
      <line x1="80" y1="130" x2="320" y2="130" stroke="white" strokeWidth="1" opacity="0.15" />
    </svg>
  );
}

export function IronAnvilSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const anvilRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP((gsap, ScrollTrigger) => {
    if (!sectionRef.current || !anvilRef.current || !textRef.current) return;

    const textElements = textRef.current.querySelectorAll('.why-text-item');

    // ONE timeline, ONE ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 0.5,
      },
    });

    // 0.0–0.25: Anvil drops and slams
    tl.fromTo(anvilRef.current,
      { y: -300, opacity: 0, scale: 0.85 },
      { y: 0, opacity: 1, scale: 1, duration: 0.25, ease: 'bounce.out' },
      0
    );

    // 0.25–0.55: Text reveals staggered right after anvil lands
    textElements.forEach((el, i) => {
      tl.fromTo(el,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.1, ease: 'power3.out' },
        0.25 + i * 0.06
      );
    });

    // 0.75–1.0: Fade everything out
    tl.to(sectionRef.current.querySelector('.anvil-content'),
      { opacity: 0, y: -20, duration: 0.15 },
      0.8
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden"
    >
      <div className="anvil-content absolute inset-0 flex items-center">
        <div className="container-default flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Anvil */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div ref={anvilRef} className="relative w-[280px] md:w-[350px] opacity-0">
              <AnvilSVG className="w-full h-auto drop-shadow-[0_20px_40px_rgba(138,155,174,0.15)]" />
            </div>
          </div>

          {/* Text */}
          <div ref={textRef} className="w-full lg:w-1/2">
            <span className="why-text-item block font-[family-name:var(--font-accent)] text-sm tracking-[0.2em] uppercase text-[var(--accent-iron-light)] mb-4 opacity-0">
              Our Purpose
            </span>
            <h2 className="why-text-item font-[family-name:var(--font-display)] text-[var(--text-h1)] text-[var(--text-primary)] leading-tight mb-6 opacity-0">
              Why Are We Here?
            </h2>
            <p className="why-text-item text-lg text-[var(--text-secondary)] leading-relaxed mb-4 max-w-lg opacity-0">
              Because faith that can&apos;t be questioned isn&apos;t faith — it&apos;s habit. Because the people sitting in pews deserve more than bumper-sticker theology. Because iron sharpens iron, and that means friction.
            </p>
            <p className="why-text-item text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg opacity-0">
              We&apos;re here to take the hardest doctrines of the Christian faith, lay them on the anvil, and strike until what&apos;s true rings clear.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
