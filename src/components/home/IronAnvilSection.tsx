'use client';

import { useRef, useEffect } from 'react';
import { useGSAP } from '@/hooks/useGSAP';

// Seeded random for consistent drip patterns
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface Drip {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  heat: number; // 1 = white hot, 0 = cooled
}

function drawBucket(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  tilt: number, // 0 = upright, 1 = fully tilted
  scale: number,
  rand: () => number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt * -0.7); // tilt to pour left
  ctx.scale(scale, scale);

  // Bucket body — tapered trapezoid
  const topW = 70, botW = 55, h = 85;

  // Shadow/depth
  ctx.beginPath();
  ctx.moveTo(-topW / 2 + 3, -h / 2 + 3);
  ctx.lineTo(topW / 2 + 3, -h / 2 + 3);
  ctx.lineTo(botW / 2 + 3, h / 2 + 3);
  ctx.lineTo(-botW / 2 + 3, h / 2 + 3);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fill();

  // Main body
  ctx.beginPath();
  ctx.moveTo(-topW / 2, -h / 2);
  ctx.lineTo(topW / 2, -h / 2);
  ctx.lineTo(botW / 2, h / 2);
  ctx.lineTo(-botW / 2, h / 2);
  ctx.closePath();

  // Rust gradient
  const bodyGrad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  bodyGrad.addColorStop(0, '#8B4513');
  bodyGrad.addColorStop(0.3, '#6B3410');
  bodyGrad.addColorStop(0.6, '#7A3D15');
  bodyGrad.addColorStop(1, '#5C2D0E');
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Rust texture — random splotches
  for (let i = 0; i < 15; i++) {
    const rx = (rand() - 0.5) * topW * 0.8;
    const ry = (rand() - 0.5) * h * 0.8;
    const rs = 3 + rand() * 8;
    ctx.beginPath();
    ctx.arc(rx, ry, rs, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${100 + rand() * 60}, ${30 + rand() * 30}, ${5 + rand() * 15}, ${0.15 + rand() * 0.2})`;
    ctx.fill();
  }

  // Dark rust patches
  for (let i = 0; i < 8; i++) {
    const rx = (rand() - 0.5) * topW * 0.6;
    const ry = (rand() - 0.5) * h * 0.7;
    const rs = 5 + rand() * 12;
    ctx.beginPath();
    ctx.arc(rx, ry, rs, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(40, 18, 5, ${0.1 + rand() * 0.15})`;
    ctx.fill();
  }

  // Rim — thicker top edge
  ctx.beginPath();
  ctx.moveTo(-topW / 2 - 4, -h / 2 - 4);
  ctx.lineTo(topW / 2 + 4, -h / 2 - 4);
  ctx.lineTo(topW / 2 + 2, -h / 2 + 6);
  ctx.lineTo(-topW / 2 - 2, -h / 2 + 6);
  ctx.closePath();
  const rimGrad = ctx.createLinearGradient(0, -h / 2 - 4, 0, -h / 2 + 6);
  rimGrad.addColorStop(0, '#9B5520');
  rimGrad.addColorStop(0.5, '#7A3D15');
  rimGrad.addColorStop(1, '#6B3410');
  ctx.fillStyle = rimGrad;
  ctx.fill();

  // Rim highlight
  ctx.beginPath();
  ctx.moveTo(-topW / 2 - 3, -h / 2 - 3);
  ctx.lineTo(topW / 2 + 3, -h / 2 - 3);
  ctx.strokeStyle = 'rgba(180, 120, 60, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Handle — arc over the top
  ctx.beginPath();
  ctx.arc(0, -h / 2 - 20, 30, Math.PI * 0.15, Math.PI * 0.85);
  ctx.strokeStyle = '#5C2D0E';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.stroke();
  // Handle highlight
  ctx.beginPath();
  ctx.arc(0, -h / 2 - 20, 30, Math.PI * 0.2, Math.PI * 0.8);
  ctx.strokeStyle = 'rgba(160, 100, 50, 0.25)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Metal bands around bucket
  for (const bandY of [-h / 4, h / 4]) {
    ctx.beginPath();
    const bw1 = topW / 2 + (botW / 2 - topW / 2) * ((bandY + h / 2) / h);
    ctx.moveTo(-bw1 - 1, bandY - 2);
    ctx.lineTo(bw1 + 1, bandY - 2);
    ctx.lineTo(bw1 + 1, bandY + 2);
    ctx.lineTo(-bw1 - 1, bandY + 2);
    ctx.closePath();
    ctx.fillStyle = '#4A2A0A';
    ctx.fill();
    // Band highlight
    ctx.beginPath();
    ctx.moveTo(-bw1, bandY - 1);
    ctx.lineTo(bw1, bandY - 1);
    ctx.strokeStyle = 'rgba(140, 90, 40, 0.2)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Inner glow at rim (molten metal inside)
  const innerGlow = ctx.createRadialGradient(0, -h / 2 + 8, 5, 0, -h / 2 + 8, topW / 2);
  innerGlow.addColorStop(0, 'rgba(255, 200, 50, 0.6)');
  innerGlow.addColorStop(0.4, 'rgba(255, 140, 20, 0.3)');
  innerGlow.addColorStop(1, 'rgba(255, 80, 0, 0)');
  ctx.beginPath();
  ctx.ellipse(0, -h / 2 + 5, topW / 2 - 4, 12, 0, 0, Math.PI * 2);
  ctx.fillStyle = innerGlow;
  ctx.fill();

  ctx.restore();

  // Return pour point in world coordinates
  const pourAngle = tilt * -0.7;
  const lipLocalX = -topW / 2 * scale - 4 * scale;
  const lipLocalY = -h / 2 * scale;
  return {
    pourX: x + lipLocalX * Math.cos(pourAngle) - lipLocalY * Math.sin(pourAngle),
    pourY: y + lipLocalX * Math.sin(pourAngle) + lipLocalY * Math.cos(pourAngle),
  };
}

function drawStream(
  ctx: CanvasRenderingContext2D,
  fromX: number, fromY: number,
  toX: number, toY: number,
  pourAmount: number, // 0-1
  time: number,
) {
  if (pourAmount <= 0) return;

  const streamLength = toY - fromY;

  // Main stream — bezier curve with slight wobble
  const wobble1 = Math.sin(time * 0.05) * 4;
  const wobble2 = Math.sin(time * 0.07 + 1) * 3;
  const midX = fromX + (toX - fromX) * 0.5 + wobble1;
  const midY = fromY + streamLength * 0.5;

  // Stream width tapers: thick at pour, thin in middle, spreads at impact
  for (let t = 0; t < Math.min(pourAmount, 1); t += 0.02) {
    const px = fromX + (midX - fromX) * t * 2 * (t < 0.5 ? 1 : 0) +
               (t >= 0.5 ? midX + (toX - midX) * (t - 0.5) * 2 : 0);
    // Simple bezier interpolation
    const u = t;
    const bx = (1 - u) * (1 - u) * fromX + 2 * (1 - u) * u * (midX + wobble2) + u * u * toX;
    const by = (1 - u) * (1 - u) * fromY + 2 * (1 - u) * u * midY + u * u * toY;

    // Width: thick at top, thin in middle, slight spread at bottom
    const widthCurve = t < 0.15 ? 8 - t * 20 : t > 0.85 ? 3 + (t - 0.85) * 30 : 3 + Math.sin(t * Math.PI) * 1.5;

    // Color: white-hot at top → orange → deep orange at bottom
    const heat = 1 - t * 0.7;

    // Glow
    const glowSize = widthCurve * 3;
    const glow = ctx.createRadialGradient(bx, by, 0, bx, by, glowSize);
    glow.addColorStop(0, `rgba(255, ${150 + heat * 105}, ${heat * 50}, ${0.15 * pourAmount})`);
    glow.addColorStop(1, 'rgba(255, 80, 0, 0)');
    ctx.beginPath();
    ctx.arc(bx, by, glowSize, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Core stream
    ctx.beginPath();
    ctx.arc(bx, by, widthCurve * 0.5, 0, Math.PI * 2);
    const r = 255;
    const g = Math.floor(120 + heat * 135);
    const b = Math.floor(heat * 60);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.9 * pourAmount})`;
    ctx.fill();

    // White-hot core (top portion)
    if (heat > 0.6) {
      ctx.beginPath();
      ctx.arc(bx, by, widthCurve * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, ${200 + heat * 55}, ${(heat - 0.6) * 2 * pourAmount})`;
      ctx.fill();
    }
  }
}

function drawPool(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  size: number, // 0-1
  time: number,
) {
  if (size <= 0) return;

  const poolW = 60 + size * 100;
  const poolH = 15 + size * 30;

  // Outer glow
  const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, poolW * 1.5);
  outerGlow.addColorStop(0, `rgba(255, 120, 20, ${0.15 * size})`);
  outerGlow.addColorStop(0.5, `rgba(255, 60, 0, ${0.05 * size})`);
  outerGlow.addColorStop(1, 'rgba(255, 40, 0, 0)');
  ctx.beginPath();
  ctx.ellipse(x, y, poolW * 1.5, poolH * 2.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = outerGlow;
  ctx.fill();

  // Pool body — ellipse
  ctx.beginPath();
  ctx.ellipse(x, y, poolW, poolH, 0, 0, Math.PI * 2);
  const poolGrad = ctx.createRadialGradient(x, y - poolH * 0.3, 0, x, y, poolW);
  poolGrad.addColorStop(0, `rgba(255, 220, 80, ${0.9 * size})`);
  poolGrad.addColorStop(0.3, `rgba(255, 160, 30, ${0.85 * size})`);
  poolGrad.addColorStop(0.7, `rgba(220, 100, 10, ${0.8 * size})`);
  poolGrad.addColorStop(1, `rgba(180, 60, 5, ${0.6 * size})`);
  ctx.fillStyle = poolGrad;
  ctx.fill();

  // White-hot center
  ctx.beginPath();
  ctx.ellipse(x, y - poolH * 0.2, poolW * 0.3, poolH * 0.4, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 200, ${0.4 * size})`;
  ctx.fill();

  // Surface ripple
  const ripplePhase = time * 0.03;
  for (let i = 0; i < 3; i++) {
    const rippleR = poolW * (0.3 + i * 0.25 + Math.sin(ripplePhase + i) * 0.05);
    ctx.beginPath();
    ctx.ellipse(x, y, rippleR, poolH * (0.5 + i * 0.15), 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 200, 80, ${0.1 * size * (1 - i * 0.3)})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawDrips(
  ctx: CanvasRenderingContext2D,
  drips: Drip[],
) {
  for (const drip of drips) {
    if (drip.life <= 0) continue;

    // Glow
    const gs = drip.size * 4;
    const glow = ctx.createRadialGradient(drip.x, drip.y, 0, drip.x, drip.y, gs);
    glow.addColorStop(0, `rgba(255, ${140 + drip.heat * 100}, ${drip.heat * 40}, ${drip.life * 0.2})`);
    glow.addColorStop(1, 'rgba(255, 60, 0, 0)');
    ctx.beginPath();
    ctx.arc(drip.x, drip.y, gs, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.arc(drip.x, drip.y, drip.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, ${150 + drip.heat * 105}, ${20 + drip.heat * 40}, ${drip.life * 0.9})`;
    ctx.fill();
  }
}

export function IronAnvilSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    progress: 0,
    time: 0,
    drips: [] as Drip[],
  });
  const rafRef = useRef(0);
  const randRef = useRef(seededRandom(77));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const state = stateRef.current;
      const w = canvas.width / Math.min(window.devicePixelRatio, 2);
      const h = canvas.height / Math.min(window.devicePixelRatio, 2);
      ctx.clearRect(0, 0, w, h);

      state.time += 1;
      const p = state.progress;

      // Phase 1: Bucket enters (0.0–0.25)
      // Phase 2: Tilt + pour (0.15–0.55)
      // Phase 3: Pool grows (0.25–0.55)
      // Phase 4: Hold (0.55–0.65)
      // Phase 5: Exit (0.65–0.90)

      const bucketEnter = Math.min(1, p / 0.25); // 0-1 over 0-25%
      const tiltAmount = p < 0.15 ? 0 : Math.min(1, (p - 0.15) / 0.15); // 0-1 over 15-30%
      const pourAmount = p < 0.2 ? 0 : p > 0.65 ? Math.max(0, 1 - (p - 0.65) / 0.1) : Math.min(1, (p - 0.2) / 0.15);
      const poolSize = p < 0.25 ? 0 : p > 0.65 ? Math.max(0, 1 - (p - 0.65) / 0.15) : Math.min(1, (p - 0.25) / 0.2);
      const exitFade = p > 0.75 ? Math.max(0, 1 - (p - 0.75) / 0.15) : 1;

      if (exitFade <= 0) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.globalAlpha = exitFade;

      // Bucket position: slides in from right
      const bucketX = w * 0.72 + (1 - bucketEnter) * 300;
      const bucketY = h * 0.28;
      const bucketScale = 1.3;

      const rand = randRef.current;

      // Draw pool first (behind stream)
      const poolX = w * 0.55;
      const poolY = h * 0.78;
      drawPool(ctx, poolX, poolY, poolSize, state.time);

      // Draw stream
      if (pourAmount > 0) {
        const pourPoint = {
          pourX: bucketX - 55 * bucketScale,
          pourY: bucketY - 20 * bucketScale,
        };
        drawStream(ctx, pourPoint.pourX, pourPoint.pourY, poolX, poolY - 10, pourAmount, state.time);

        // Spawn drips at impact point
        if (poolSize > 0.1 && state.time % 3 === 0) {
          state.drips.push({
            x: poolX + (rand() - 0.5) * 30,
            y: poolY - 5,
            vx: (rand() - 0.5) * 3,
            vy: -(2 + rand() * 4),
            size: 1 + rand() * 2.5,
            life: 1,
            heat: 0.5 + rand() * 0.5,
          });
        }
      }

      // Update and draw drips (splash particles)
      state.drips = state.drips.filter(d => d.life > 0);
      for (const drip of state.drips) {
        drip.x += drip.vx;
        drip.y += drip.vy;
        drip.vy += 0.2; // gravity
        drip.life -= 0.03;
        drip.heat *= 0.98;
      }
      drawDrips(ctx, state.drips);

      // Draw bucket on top
      drawBucket(ctx, bucketX, bucketY, tiltAmount, bucketScale, seededRandom(42));

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useGSAP((gsap, ScrollTrigger) => {
    if (!sectionRef.current || !textRef.current) return;

    const textElements = textRef.current.querySelectorAll('.why-text-item');
    const proxy = { progress: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: 0.8,
      },
    });

    // Canvas animation progress
    tl.to(proxy, {
      progress: 1,
      duration: 0.9,
      ease: 'none',
      onUpdate: () => { stateRef.current.progress = proxy.progress; },
    }, 0);

    // Text fades in during pour phase
    textElements.forEach((el, i) => {
      tl.fromTo(el,
        { opacity: 0, x: -25 },
        { opacity: 1, x: 0, duration: 0.10, ease: 'power3.out' },
        0.25 + i * 0.06
      );
    });

    // Text fades out
    tl.to(textRef.current,
      { opacity: 0, x: -20, duration: 0.10, ease: 'power2.in' },
      0.68
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center">
        {/* Text — left side */}
        <div ref={textRef} className="w-full lg:w-[45%] px-6 lg:pl-12 xl:pl-20 relative z-10">
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

        {/* Canvas — right side */}
        <div className="absolute right-0 top-0 bottom-0 w-[60%] lg:w-[55%] pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}
