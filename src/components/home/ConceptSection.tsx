'use client';

import { useRef, useEffect, useState } from 'react';

const lines = [
  'Two men from the Kansas plains sat down to talk about God.',
  'Not to lecture. Not to perform.',
  'To dig — into Scripture, into doubt, into the questions most people are afraid to ask.',
  'Iron & Oak is a space where faith gets pressure-tested and Christ remains the answer.',
];

// Ember particle for the background
interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  decay: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function ConceptSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const embersRef = useRef<Ember[]>([]);
  const rafRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Ember background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const rand = seededRandom(123);

    const spawnEmber = (): Ember => ({
      x: rand() * canvas.width,
      y: canvas.height + rand() * 20,
      vx: (rand() - 0.5) * 0.8,
      vy: -(0.3 + rand() * 1.2),
      size: 1 + rand() * 3,
      opacity: 0.5 + rand() * 0.5,
      decay: 0.001 + rand() * 0.003,
    });

    embersRef.current = Array.from({ length: 80 }, () => {
      const e = spawnEmber();
      e.y = rand() * canvas.height;
      return e;
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      embersRef.current.forEach((ember, i) => {
        ember.x += ember.vx + Math.sin(ember.y * 0.01) * 0.2;
        ember.y += ember.vy;
        ember.opacity -= ember.decay;

        if (ember.opacity <= 0 || ember.y < -10) {
          embersRef.current[i] = spawnEmber();
          return;
        }

        // Glow
        const g = ctx.createRadialGradient(ember.x, ember.y, 0, ember.x, ember.y, ember.size * 4);
        g.addColorStop(0, `rgba(180, 110, 40, ${ember.opacity * 0.25})`);
        g.addColorStop(1, 'rgba(140, 80, 20, 0)');
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Core — brighter
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 150, 60, ${ember.opacity * 0.85})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Track scroll progress through section
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - vh)));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="concept"
      className="relative bg-[var(--bg-primary)]"
      style={{ height: `${lines.length * 100 + 50}vh` }}
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Ember canvas background */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />

        {/* Text crawl — flat, in your face */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-full max-w-3xl px-8">
            {/* Crawl text container — moves upward based on scroll */}
            <div
              style={{
                transform: `translateY(${100 - scrollProgress * 250}%)`,
                transition: 'none',
              }}
            >
              {lines.map((line, i) => {
                // Fade based on vertical position in the crawl
                const lineProgress = scrollProgress * lines.length - i;
                const opacity = lineProgress < 0 ? 0 : lineProgress > 2.5 ? 0 : Math.min(1, lineProgress) * Math.max(0, 1 - (lineProgress - 1.5));

                return (
                  <p
                    key={i}
                    className="font-[family-name:var(--font-display)] text-[var(--text-h2)] leading-relaxed text-[var(--text-primary)] text-center mb-16"
                    style={{ opacity }}
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top fade gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--bg-primary)] to-transparent z-20 pointer-events-none" />
        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
