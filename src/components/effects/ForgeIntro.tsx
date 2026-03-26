'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { assetPath } from "@/lib/basePath";
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
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

export function ForgeIntro() {
  // dismissed starts false — the overlay is in the SSR HTML as a solid black div.
  // On client mount, we either instantly dismiss (already played) or start the animation.
  const [dismissed, setDismissed] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [animating, setAnimating] = useState(false); // true once canvas/logo should run
  const [logoVisible, setLogoVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const embersRef = useRef<Ember[]>([]);

  const dismiss = useCallback(() => {
    if (fadingOut) return; // prevent double-dismiss
    setFadingOut(true);
    setTimeout(() => setDismissed(true), 600);
  }, [fadingOut]);

  // On mount: decide whether to animate or skip
  useEffect(() => {
    // If reduced motion preference, skip entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDismissed(true);
      return;
    }
    // Always play the intro on every fresh page load
    setAnimating(true);
    // Longer delay so embers establish first, then logo fades in smoothly
    const logoTimer = setTimeout(() => setLogoVisible(true), 800);
    return () => clearTimeout(logoTimer);
  }, []);

  // Click/tap/scroll to dismiss (only when animating and not yet dismissed)
  useEffect(() => {
    if (!animating || dismissed) return;
    const handler = () => dismiss();
    window.addEventListener('click', handler);
    window.addEventListener('wheel', handler, { passive: true });
    window.addEventListener('touchstart', handler, { passive: true });
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('wheel', handler);
      window.removeEventListener('touchstart', handler);
    };
  }, [animating, dismissed, dismiss]);

  // Canvas ember animation — only runs when animating is true
  useEffect(() => {
    if (!animating || dismissed) return;
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
      // Random spawn across FULL width, from bottom edge
      const x = Math.random() * canvas.width;
      const y = scattered
        ? Math.random() * canvas.height
        : canvas.height + Math.random() * 60;

      // Random direction — mostly upward but with real randomness
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4; // ~-110° to -70°
      const speed = 0.8 + Math.random() * 2.5;

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 0.8 + Math.random() * 2,
        life: 1,
        maxLife: 1 + Math.random() * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        turbulencePhase: Math.random() * Math.PI * 2,
        turbulenceSpeed: 0.01 + Math.random() * 0.025,
      };
    };

    // Sparse — 60 particles, not 250
    embersRef.current = Array.from({ length: 60 }, () => spawnEmber(true));

    let time = 0;

    const draw = () => {
      // Full clear — no trails
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      time += 1;

      embersRef.current.forEach((ember, i) => {
        // Air turbulence — gentle random wobble
        const turbX = Math.sin(ember.turbulencePhase + time * ember.turbulenceSpeed) * 0.4;
        const turbY = Math.cos(ember.turbulencePhase * 1.5 + time * ember.turbulenceSpeed * 0.6) * 0.2;

        ember.x += ember.vx + turbX;
        ember.y += ember.vy + turbY;

        // Slight deceleration
        ember.vx *= 0.999;
        ember.vy *= 0.999;

        ember.rotation += ember.rotationSpeed;

        // Life decay
        ember.life -= 0.006;

        // Respawn if dead or off-screen
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
  }, [animating, dismissed]);

  // If fully dismissed, render nothing
  if (dismissed) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-500',
        fadingOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      {/* Canvas only rendered on client once animation starts */}
      {animating && <canvas ref={canvasRef} className="absolute inset-0" />}

      <div
        className={cn(
          'relative z-10 text-center transition-opacity duration-[1500ms] ease-in-out',
          logoVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Image
          src={assetPath("/images/iron-oak-logo-new.webp")}
          alt="The Iron & Oak Podcast"
          width={500}
          height={500}
          /* w-[min(200px,60vw)] on tiny phones (320px → 192px; 375px → 200px),
             stepping up through breakpoints. 60vw keeps it off the edges on any width. */
          className="w-[min(200px,60vw)] sm:w-[250px] md:w-[350px] lg:w-[420px] h-auto"
          priority
        />
      </div>

      {/* bottom + safe area: accounts for iOS home indicator on notched devices */}
      {animating && (
        <p
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/30 tracking-wider"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          Tap anywhere to continue
        </p>
      )}
    </div>
  );
}
