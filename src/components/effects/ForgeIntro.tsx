'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  decay: number;
}

export function ForgeIntro() {
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const embersRef = useRef<Ember[]>([]);

  const dismiss = useCallback(() => {
    setFadingOut(true);
    setTimeout(() => setVisible(false), 500);
  }, []);

  useEffect(() => {
    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setVisible(true);

    // Show text after 1s
    const textTimer = setTimeout(() => setTextVisible(true), 1000);
    // Auto-dismiss after 3.5s
    const dismissTimer = setTimeout(() => dismiss(), 3500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(dismissTimer);
    };
  }, [dismiss]);

  // Skip on click/scroll
  useEffect(() => {
    if (!visible) return;
    const handler = () => dismiss();
    window.addEventListener('click', handler);
    window.addEventListener('wheel', handler, { passive: true });
    window.addEventListener('touchstart', handler, { passive: true });
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('wheel', handler);
      window.removeEventListener('touchstart', handler);
    };
  }, [visible, dismiss]);

  // Particle system
  useEffect(() => {
    if (!visible) return;
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

    // Color palette
    const colors = [
      'rgba(196, 132, 62, ',    // oak
      'rgba(212, 160, 84, ',    // oak-light
      'rgba(255, 160, 50, ',    // bright amber
      'rgba(255, 120, 30, ',    // orange
    ];

    // Spawn embers
    const spawnEmber = (): Ember => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -(1 + Math.random() * 3),
      size: 1 + Math.random() * 3,
      opacity: 0.5 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      decay: 0.002 + Math.random() * 0.005,
    });

    // Init 300 embers
    embersRef.current = Array.from({ length: 300 }, () => {
      const ember = spawnEmber();
      ember.y = Math.random() * canvas.height; // spread initial positions
      return ember;
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      embersRef.current.forEach((ember, i) => {
        ember.x += ember.vx;
        ember.y += ember.vy;
        ember.vx += (Math.random() - 0.5) * 0.1; // wander
        ember.opacity -= ember.decay;

        if (ember.opacity <= 0 || ember.y < -10) {
          embersRef.current[i] = spawnEmber();
          return;
        }

        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fillStyle = `${ember.color}${ember.opacity})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `${ember.color}${ember.opacity * 0.15})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [visible]);

  // Lock body scroll while visible
  useEffect(() => {
    if (visible && !fadingOut) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [visible, fadingOut]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-500',
        fadingOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Text */}
      <div
        className={cn(
          'relative z-10 text-center transition-all duration-1000',
          textVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider">
          <span className="text-[var(--accent-iron-light)]">IRON</span>
          <span className="text-[var(--accent-oak)] mx-3">&</span>
          <span className="text-[var(--accent-oak-light)]">OAK</span>
        </h1>
      </div>

      {/* Skip hint */}
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/30 tracking-wider">
        Click to skip
      </p>
    </div>
  );
}
