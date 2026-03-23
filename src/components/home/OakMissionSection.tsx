'use client';

import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { cn } from '@/lib/utils';

// SVG root paths — organic branching shapes growing from right to left
// Each path is a cubic bezier that starts from the right edge and branches left
const rootPaths = [
  // Main thick root
  'M 800 300 C 700 290, 600 320, 480 300 C 380 285, 280 310, 150 280 C 80 265, 20 275, -20 260',
  // Upper branch
  'M 800 280 C 720 260, 650 240, 550 250 C 450 258, 380 230, 280 210 C 200 195, 120 205, 40 190',
  // Lower thick root
  'M 800 340 C 690 350, 600 380, 500 360 C 400 342, 320 370, 220 355 C 140 342, 60 360, -10 345',
  // Upper thin tendril
  'M 800 260 C 740 245, 680 230, 600 225 C 520 220, 460 200, 380 185',
  // Lower thin tendril
  'M 800 370 C 730 385, 660 400, 570 395 C 490 390, 420 415, 340 410',
  // Small branch off main
  'M 480 300 C 450 270, 400 250, 340 240',
  // Small branch off lower
  'M 500 360 C 470 390, 430 410, 370 420',
  // Tiny surface root
  'M 800 310 C 750 308, 700 315, 640 305 C 580 296, 530 302, 470 295',
];

export function OakMissionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP((gsap, ScrollTrigger) => {
    if (!sectionRef.current || !svgRef.current || !textRef.current) return;

    const paths = svgRef.current.querySelectorAll('.root-path');

    // Set up stroke dash for draw-in effect
    paths.forEach((path) => {
      const el = path as SVGPathElement;
      const length = el.getTotalLength();
      el.style.strokeDasharray = `${length}`;
      el.style.strokeDashoffset = `${length}`;
    });

    // Pin the section
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=200%',
      pin: true,
    });

    // Draw roots in — staggered, thicker ones first
    paths.forEach((path, i) => {
      const el = path as SVGPathElement;
      const length = el.getTotalLength();

      gsap.to(el, {
        strokeDashoffset: 0,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: `${5 + i * 4}% top`,
          end: `${35 + i * 5}% top`,
          scrub: 1,
        },
      });
    });

    // Text fade in
    const textElements = textRef.current.querySelectorAll('.mission-text-item');
    textElements.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `${10 + i * 12}% top`,
            end: `${25 + i * 12}% top`,
            scrub: 1,
          },
        }
      );
    });

    // Fade everything out at the end
    gsap.to(sectionRef.current.querySelector('.mission-content'), {
      opacity: 0,
      y: -30,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: '75% top',
        end: '95% top',
        scrub: true,
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden"
    >
      <div className="mission-content absolute inset-0 flex items-center">
        {/* Left: Text */}
        <div ref={textRef} className="w-full lg:w-1/2 px-6 lg:pl-12 xl:pl-20 relative z-10">
          <span className="mission-text-item block font-[family-name:var(--font-accent)] text-sm tracking-[0.2em] uppercase text-[var(--accent-oak)] mb-4">
            Our Mission
          </span>
          <h2 className="mission-text-item font-[family-name:var(--font-display)] text-[var(--text-h1)] text-[var(--text-primary)] leading-tight mb-6">
            What&apos;s Our Mission?
          </h2>
          <p className="mission-text-item text-lg text-[var(--text-secondary)] leading-relaxed mb-4 max-w-lg">
            To create a space where the hardest questions about faith aren&apos;t avoided — they&apos;re welcomed. Where Scripture is the foundation, not a prop. Where honesty matters more than polish.
          </p>
          <p className="mission-text-item text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg">
            Iron &amp; Oak exists to sharpen believers and invite skeptics into the same conversation — one that doesn&apos;t flinch.
          </p>
        </div>

        {/* Right: SVG Roots */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-2/3 pointer-events-none">
          <svg
            ref={svgRef}
            viewBox="0 0 800 600"
            className="w-full h-full"
            preserveAspectRatio="xMaxYMid slice"
            fill="none"
          >
            {rootPaths.map((d, i) => (
              <path
                key={i}
                d={d}
                className="root-path"
                stroke={i < 3 ? 'var(--accent-oak)' : 'var(--accent-oak-light)'}
                strokeWidth={i < 3 ? 3 - i * 0.5 : 1.5 - (i - 3) * 0.15}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={i < 3 ? 0.6 : 0.3 + (i * 0.03)}
                fill="none"
              />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
