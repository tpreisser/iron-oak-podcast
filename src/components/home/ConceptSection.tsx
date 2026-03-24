'use client';

import { useRef, useEffect, useState } from 'react';

const lines = [
  'Two men from the Kansas plains sat down to talk about God.',
  'Not to lecture. Not to perform.',
  'To dig — into Scripture, into doubt, into the questions most people are afraid to ask.',
  'Iron & Oak is a space where faith gets pressure-tested and Christ remains the answer.',
];

// Same ember system as ForgeIntro
interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  turbulencePhase: number;
  turbulenceSpeed: number;
}

function emberColor(life: number, maxLife: number): string {
  const t = life / maxLife;
  if (t > 0.7) {
    return `rgba(255, ${200 + t * 55}, ${140 + t * 60}, ${0.7 + t * 0.3})`;
  } else if (t > 0.4) {
    return `rgba(255, ${120 + t * 120}, ${20 + t * 40}, ${t * 0.9})`;
  } else if (t > 0.15) {
    return `rgba(${180 + t * 200}, ${50 + t * 150}, 10, ${t * 0.8})`;
  } else {
    return `rgba(${80 + t * 600}, ${15 + t * 200}, 5, ${t * 4})`;
  }
}

export function ConceptSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const embersRef = useRef<Ember[]>([]);
  const rafRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Ember background — copied from ForgeIntro
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

    const spawnEmber = (scattered?: boolean): Ember => {
      const x = Math.random() * canvas.width;
      const y = scattered
        ? Math.random() * canvas.height
        : canvas.height + Math.random() * 60;

      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
      const speed = 0.8 + Math.random() * 2.5;

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 0.8 + Math.random() * 2,
        life: 1,
        maxLife: 1 + Math.random() * 2,
        turbulencePhase: Math.random() * Math.PI * 2,
        turbulenceSpeed: 0.01 + Math.random() * 0.025,
      };
    };

    embersRef.current = Array.from({ length: 60 }, () => spawnEmber(true));

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      embersRef.current.forEach((ember, i) => {
        const turbX = Math.sin(ember.turbulencePhase + time * ember.turbulenceSpeed) * 0.4;
        const turbY = Math.cos(ember.turbulencePhase * 1.5 + time * ember.turbulenceSpeed * 0.6) * 0.2;

        ember.x += ember.vx + turbX;
        ember.y += ember.vy + turbY;
        ember.vx *= 0.999;
        ember.vy *= 0.999;
        ember.life -= 0.006;

        if (ember.life <= 0 || ember.y < -20 || ember.x < -20 || ember.x > canvas.width + 20) {
          embersRef.current[i] = spawnEmber(false);
          return;
        }

        const t = ember.life / ember.maxLife;
        const color = emberColor(ember.life, ember.maxLife);

        ctx.save();
        ctx.translate(ember.x, ember.y);

        // Soft glow
        const glowSize = ember.size * 5;
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
        glow.addColorStop(0, `rgba(255, ${100 + t * 100}, 20, ${t * 0.12})`);
        glow.addColorStop(1, 'rgba(255, 60, 0, 0)');
        ctx.beginPath();
        ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(0, 0, ember.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Bright center on fresh embers
        if (t > 0.5) {
          ctx.beginPath();
          ctx.arc(0, 0, ember.size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 220, ${(t - 0.5) * 1.2})`;
          ctx.fill();
        }

        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Track scroll progress
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
      style={{ height: `${lines.length * 120 + 60}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />

        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-full max-w-3xl px-8">
            <div
              style={{
                transform: `translateY(${100 - scrollProgress * 250}%)`,
              }}
            >
              {lines.map((line, i) => {
                const lineProgress = scrollProgress * lines.length - i;
                const opacity = lineProgress < 0 ? 0 : lineProgress > 2.5 ? 0 : Math.min(1, lineProgress) * Math.max(0, 1 - (lineProgress - 1.5));

                return (
                  <p
                    key={i}
                    className="font-[family-name:var(--font-display)] text-[var(--text-h2)] leading-relaxed text-[var(--text-primary)] text-center mb-32"
                    style={{ opacity }}
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--bg-primary)] to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
