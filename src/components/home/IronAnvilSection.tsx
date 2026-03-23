'use client';

import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { cn } from '@/lib/utils';

// SVG Anvil — classic blacksmith shape
function AnvilSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} fill="none">
      {/* Base/feet */}
      <path
        d="M 100 280 L 110 240 L 290 240 L 300 280 Z"
        fill="var(--accent-iron)"
        opacity="0.8"
      />
      {/* Waist */}
      <rect x="130" y="200" width="140" height="40" rx="4" fill="var(--accent-iron)" opacity="0.9" />
      {/* Body */}
      <path
        d="M 80 200 L 90 160 L 310 160 L 320 200 Z"
        fill="var(--accent-iron-light)"
      />
      {/* Face (top flat surface) */}
      <path
        d="M 70 160 L 80 130 L 320 130 L 330 160 Z"
        fill="var(--accent-iron-light)"
        opacity="0.95"
      />
      {/* Horn (pointed end extending left) */}
      <path
        d="M 80 130 C 60 128, 30 135, 10 145 L 10 150 C 30 143, 60 140, 80 160 Z"
        fill="var(--accent-iron)"
        opacity="0.85"
      />
      {/* Hardy hole (square hole on top) */}
      <rect x="260" y="130" width="15" height="15" rx="1" fill="var(--bg-primary)" opacity="0.6" />
      {/* Pritchel hole (round hole) */}
      <circle cx="240" cy="138" r="5" fill="var(--bg-primary)" opacity="0.5" />
      {/* Top surface highlight */}
      <path
        d="M 85 132 L 315 132 L 325 155 L 75 155 Z"
        fill="white"
        opacity="0.06"
      />
      {/* Edge highlight */}
      <line x1="80" y1="130" x2="320" y2="130" stroke="white" strokeWidth="1" opacity="0.15" />
    </svg>
  );
}

// Impact spark — pure CSS animated
function ImpactSpark({ delay, angle, distance }: { delay: number; angle: number; distance: number }) {
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  return (
    <div
      className="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent-oak)]"
      style={{
        left: '50%',
        top: '65%',
        opacity: 0,
        animation: `spark-fly 0.6s ${delay}s ease-out forwards`,
        // @ts-expect-error CSS custom properties
        '--spark-x': `${x}px`,
        '--spark-y': `${y}px`,
      }}
    />
  );
}

export function IronAnvilSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const anvilRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);

  useGSAP((gsap, ScrollTrigger) => {
    if (!sectionRef.current || !anvilRef.current || !textRef.current) return;

    // Pin the section while animations play
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=200%',
      pin: true,
    });

    // Anvil drops and slams with bounce
    gsap.fromTo(anvilRef.current,
      { y: -400, opacity: 0, scale: 0.8 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        ease: 'bounce.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '5% top',
          end: '30% top',
          scrub: 1,
        },
      }
    );

    // Impact shake on the whole content area
    gsap.fromTo(sectionRef.current.querySelector('.anvil-content'),
      { x: 0 },
      {
        x: 4,
        duration: 0.05,
        repeat: 5,
        yoyo: true,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '28% top',
          end: '32% top',
          scrub: false,
          toggleActions: 'play none none none',
        },
      }
    );

    // Show sparks at impact moment
    if (sparksRef.current) {
      gsap.fromTo(sparksRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '28% top',
            end: '30% top',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Text reveals staggered after anvil lands
    const textElements = textRef.current.querySelectorAll('.why-text-item');
    textElements.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `${35 + i * 10}% top`,
            end: `${48 + i * 10}% top`,
            scrub: 1,
          },
        }
      );
    });

    // Fade everything out at end of pin
    gsap.to(sectionRef.current.querySelector('.anvil-content'), {
      opacity: 0,
      y: -30,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: '78% top',
        end: '95% top',
        scrub: true,
      },
    });
  }, []);

  // Generate random sparks for impact burst
  const sparks = Array.from({ length: 12 }, (_, i) => ({
    delay: Math.random() * 0.2,
    angle: -Math.PI + Math.random() * Math.PI, // upper hemisphere
    distance: 30 + Math.random() * 80,
  }));

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[var(--bg-secondary)] overflow-hidden"
    >
      {/* Spark fly keyframes */}
      <style jsx>{`
        @keyframes spark-fly {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--spark-x), var(--spark-y)) scale(0); }
        }
      `}</style>

      <div className="anvil-content absolute inset-0 flex items-center">
        <div className="container-default flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: Anvil */}
          <div className="w-full lg:w-1/2 flex justify-center relative">
            <div ref={anvilRef} className="relative w-[280px] md:w-[350px]">
              <AnvilSVG className="w-full h-auto drop-shadow-[0_20px_40px_rgba(138,155,174,0.15)]" />

              {/* Impact sparks overlay */}
              <div ref={sparksRef} className="absolute inset-0 pointer-events-none opacity-0">
                {sparks.map((spark, i) => (
                  <ImpactSpark key={i} {...spark} />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div ref={textRef} className="w-full lg:w-1/2">
            <span className="why-text-item block font-[family-name:var(--font-accent)] text-sm tracking-[0.2em] uppercase text-[var(--accent-iron-light)] mb-4">
              Our Purpose
            </span>
            <h2 className="why-text-item font-[family-name:var(--font-display)] text-[var(--text-h1)] text-[var(--text-primary)] leading-tight mb-6">
              Why Are We Here?
            </h2>
            <p className="why-text-item text-lg text-[var(--text-secondary)] leading-relaxed mb-4 max-w-lg">
              Because faith that can&apos;t be questioned isn&apos;t faith — it&apos;s habit. Because the people sitting in pews deserve more than bumper-sticker theology. Because iron sharpens iron, and that means friction.
            </p>
            <p className="why-text-item text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg">
              We&apos;re here to take the hardest doctrines of the Christian faith, lay them on the anvil, and strike until what&apos;s true rings clear.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
