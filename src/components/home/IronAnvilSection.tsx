'use client';

import { useRef, useEffect } from 'react';
import { useGSAP } from '@/hooks/useGSAP';

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  size: number;
  brightness: number;
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  progress: number,
  time: number,
  sparks: Spark[],
) {
  ctx.clearRect(0, 0, w, h);
  if (progress <= 0.01) return;

  const rand = seededRandom(Math.floor(time) + 1000);

  // === COORDINATES ===
  const bucketX = w * 0.62;
  const bucketY = h * 0.12;
  const poolX = w * 0.48;
  const poolY = h * 0.82;
  const pourLipX = bucketX - 60;
  const pourLipY = bucketY + 50;

  // === PHASE CALCULATIONS ===
  const bucketIn = Math.min(1, progress / 0.2);
  const tilt = progress < 0.12 ? 0 : Math.min(1, (progress - 0.12) / 0.12);
  const pourFlow = progress < 0.18 ? 0 : progress > 0.68 ? Math.max(0, 1 - (progress - 0.68) / 0.08) : Math.min(1, (progress - 0.18) / 0.1);
  const poolGrow = progress < 0.25 ? 0 : progress > 0.68 ? Math.max(0, 1 - (progress - 0.68) / 0.12) : Math.min(1, (progress - 0.25) / 0.15);
  const fade = progress > 0.78 ? Math.max(0, 1 - (progress - 0.78) / 0.15) : 1;

  ctx.globalAlpha = fade;

  // ============================================
  // AMBIENT GROUND GLOW (draw first, behind everything)
  // ============================================
  if (poolGrow > 0) {
    const ambientR = w * 0.4 * poolGrow;
    const ambient = ctx.createRadialGradient(poolX, poolY, 0, poolX, poolY, ambientR);
    ambient.addColorStop(0, `rgba(255, 120, 20, ${0.12 * poolGrow})`);
    ambient.addColorStop(0.4, `rgba(200, 60, 5, ${0.06 * poolGrow})`);
    ambient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ambient;
    ctx.fillRect(0, 0, w, h);
  }

  // ============================================
  // MOLTEN POOL
  // ============================================
  if (poolGrow > 0) {
    const pw = 130 + poolGrow * 180;
    const ph = 25 + poolGrow * 45;

    // Outer dark glow ring
    ctx.save();
    ctx.shadowBlur = 80 * poolGrow;
    ctx.shadowColor = 'rgba(255, 80, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(poolX, poolY, pw * 1.1, ph * 1.3, 0, 0, Math.PI * 2);
    const outerPool = ctx.createRadialGradient(poolX, poolY, pw * 0.3, poolX, poolY, pw * 1.1);
    outerPool.addColorStop(0, `rgba(200, 80, 5, ${0.7 * poolGrow})`);
    outerPool.addColorStop(0.5, `rgba(160, 50, 0, ${0.5 * poolGrow})`);
    outerPool.addColorStop(1, `rgba(80, 20, 0, ${0.15 * poolGrow})`);
    ctx.fillStyle = outerPool;
    ctx.fill();
    ctx.restore();

    // Main pool body
    ctx.save();
    ctx.shadowBlur = 40 * poolGrow;
    ctx.shadowColor = 'rgba(255, 140, 20, 0.6)';
    ctx.beginPath();
    ctx.ellipse(poolX, poolY, pw, ph, 0, 0, Math.PI * 2);
    const poolGrad = ctx.createRadialGradient(poolX, poolY - ph * 0.2, 0, poolX, poolY, pw);
    poolGrad.addColorStop(0, `rgba(255, 240, 140, ${0.95 * poolGrow})`);
    poolGrad.addColorStop(0.15, `rgba(255, 200, 60, ${0.9 * poolGrow})`);
    poolGrad.addColorStop(0.4, `rgba(255, 140, 20, ${0.85 * poolGrow})`);
    poolGrad.addColorStop(0.7, `rgba(220, 80, 5, ${0.7 * poolGrow})`);
    poolGrad.addColorStop(1, `rgba(150, 40, 0, ${0.4 * poolGrow})`);
    ctx.fillStyle = poolGrad;
    ctx.fill();
    ctx.restore();

    // White-hot impact center
    ctx.save();
    ctx.shadowBlur = 30;
    ctx.shadowColor = 'rgba(255, 255, 200, 0.8)';
    ctx.beginPath();
    ctx.ellipse(poolX, poolY - ph * 0.15, pw * 0.18, ph * 0.35, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 220, ${0.8 * poolGrow})`;
    ctx.fill();
    ctx.restore();

    // Concentric ripple rings
    for (let i = 1; i <= 4; i++) {
      const rippleR = pw * (0.3 + i * 0.2) + Math.sin(time * 0.04 + i) * 5;
      ctx.beginPath();
      ctx.ellipse(poolX, poolY, rippleR, ph * (0.6 + i * 0.12), 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 180, 50, ${0.15 * poolGrow * (1 - i * 0.2)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // ============================================
  // MOLTEN STREAM
  // ============================================
  if (pourFlow > 0) {
    const streamStartX = pourLipX + (1 - bucketIn) * 200;
    const streamStartY = pourLipY;

    // Draw stream as a thick band with turbulent edges
    // Multiple passes: dark outer → bright middle → white core
    const steps = 60;
    for (let pass = 0; pass < 3; pass++) {
      const widthMult = pass === 0 ? 1.0 : pass === 1 ? 0.6 : 0.25;
      const alpha = pass === 0 ? 0.7 : pass === 1 ? 0.85 : 0.9;

      ctx.save();
      if (pass === 2) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(255, 200, 50, 0.5)';
      }

      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        if (t > pourFlow) break;

        // Bezier interpolation for stream path
        const cx = (streamStartX + poolX) / 2 + Math.sin(time * 0.03 + t * 5) * 8 * t;
        const cy = streamStartY + (poolY - streamStartY) * 0.4;
        const px = (1 - t) * (1 - t) * streamStartX + 2 * (1 - t) * t * cx + t * t * poolX;
        const py = (1 - t) * (1 - t) * streamStartY + 2 * (1 - t) * t * cy + t * t * (poolY - 10);

        // Stream width: wide at top, thins, wide at splash
        let streamW;
        if (t < 0.1) {
          streamW = 14 + (1 - t / 0.1) * 6; // wide at lip
        } else if (t > 0.85) {
          streamW = 8 + (t - 0.85) / 0.15 * 20; // splash spread
        } else {
          streamW = 7 + Math.sin(t * 12 + time * 0.05) * 2; // slight turbulence
        }
        streamW *= widthMult;

        // Turbulent edge noise
        const noise = Math.sin(t * 20 + time * 0.08) * 2 * t;

        if (i === 0) {
          ctx.moveTo(px + noise, py);
        } else {
          ctx.lineTo(px + noise, py);
        }
      }
      // Draw return path (other side of stream) for filled shape
      for (let i = Math.min(steps, Math.floor(pourFlow * steps)); i >= 0; i--) {
        const t = i / steps;
        const cx = (streamStartX + poolX) / 2 + Math.sin(time * 0.03 + t * 5) * 8 * t;
        const cy = streamStartY + (poolY - streamStartY) * 0.4;
        const px = (1 - t) * (1 - t) * streamStartX + 2 * (1 - t) * t * cx + t * t * poolX;
        const py = (1 - t) * (1 - t) * streamStartY + 2 * (1 - t) * t * cy + t * t * (poolY - 10);

        let streamW;
        if (t < 0.1) streamW = 14 + (1 - t / 0.1) * 6;
        else if (t > 0.85) streamW = 8 + (t - 0.85) / 0.15 * 20;
        else streamW = 7 + Math.sin(t * 12 + time * 0.05) * 2;
        streamW *= widthMult;

        const noise = Math.sin(t * 20 + time * 0.08 + 2) * 2 * t;
        ctx.lineTo(px + streamW + noise, py);
      }
      ctx.closePath();

      // Color per pass
      if (pass === 0) {
        const g = ctx.createLinearGradient(streamStartX, streamStartY, poolX, poolY);
        g.addColorStop(0, `rgba(255, 160, 20, ${alpha * pourFlow})`);
        g.addColorStop(0.5, `rgba(240, 120, 10, ${alpha * pourFlow})`);
        g.addColorStop(1, `rgba(255, 140, 20, ${alpha * pourFlow})`);
        ctx.fillStyle = g;
      } else if (pass === 1) {
        const g = ctx.createLinearGradient(streamStartX, streamStartY, poolX, poolY);
        g.addColorStop(0, `rgba(255, 220, 80, ${alpha * pourFlow})`);
        g.addColorStop(0.5, `rgba(255, 180, 40, ${alpha * pourFlow})`);
        g.addColorStop(1, `rgba(255, 200, 60, ${alpha * pourFlow})`);
        ctx.fillStyle = g;
      } else {
        const g = ctx.createLinearGradient(streamStartX, streamStartY, poolX, poolY);
        g.addColorStop(0, `rgba(255, 255, 200, ${alpha * pourFlow})`);
        g.addColorStop(0.3, `rgba(255, 240, 140, ${alpha * pourFlow * 0.8})`);
        g.addColorStop(1, `rgba(255, 255, 180, ${alpha * pourFlow * 0.6})`);
        ctx.fillStyle = g;
      }
      ctx.fill();
      ctx.restore();
    }

    // Stream glow line (center bright line)
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(255, 220, 100, 0.6)';
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      if (t > pourFlow) break;
      const cx = (streamStartX + poolX) / 2 + Math.sin(time * 0.03 + t * 5) * 8 * t;
      const cy = streamStartY + (poolY - streamStartY) * 0.4;
      const px = (1 - t) * (1 - t) * streamStartX + 2 * (1 - t) * t * cx + t * t * poolX;
      const py = (1 - t) * (1 - t) * streamStartY + 2 * (1 - t) * t * cy + t * t * (poolY - 10);
      if (i === 0) ctx.moveTo(px + 5, py);
      else ctx.lineTo(px + 5, py);
    }
    ctx.strokeStyle = `rgba(255, 255, 220, ${0.5 * pourFlow})`;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  // ============================================
  // SPARKS (flying off stream + impact)
  // ============================================
  if (pourFlow > 0.3) {
    // Spawn new sparks
    if (time % 2 === 0) {
      const spawnCount = 2 + Math.floor(rand() * 3);
      for (let i = 0; i < spawnCount; i++) {
        // Spawn along the stream
        const t = 0.3 + rand() * 0.6;
        const cx = (pourLipX + poolX) / 2;
        const cy = pourLipY + (poolY - pourLipY) * 0.4;
        const sx = (1 - t) * (1 - t) * pourLipX + 2 * (1 - t) * t * cx + t * t * poolX;
        const sy = (1 - t) * (1 - t) * pourLipY + 2 * (1 - t) * t * cy + t * t * (poolY - 10);

        sparks.push({
          x: sx + (rand() - 0.5) * 20,
          y: sy + (rand() - 0.5) * 10,
          vx: (rand() - 0.5) * 4,
          vy: -(1 + rand() * 4),
          life: 0.6 + rand() * 0.5,
          size: 1 + rand() * 2.5,
          brightness: 0.6 + rand() * 0.4,
        });
      }
      // Impact sparks
      if (poolGrow > 0.2) {
        for (let i = 0; i < 2; i++) {
          sparks.push({
            x: poolX + (rand() - 0.5) * 40,
            y: poolY - 10,
            vx: (rand() - 0.5) * 6,
            vy: -(3 + rand() * 5),
            life: 0.5 + rand() * 0.4,
            size: 1.5 + rand() * 2,
            brightness: 0.8 + rand() * 0.2,
          });
        }
      }
    }
  }

  // Update and draw sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.12;
    s.vx *= 0.99;
    s.life -= 0.025;
    if (s.life <= 0) { sparks.splice(i, 1); continue; }

    ctx.save();
    ctx.shadowBlur = 8;
    ctx.shadowColor = `rgba(255, 180, 40, ${s.life * 0.5})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, ${180 + s.brightness * 75}, ${40 + s.brightness * 60}, ${s.life * 0.9})`;
    ctx.fill();
    // Hot core
    if (s.life > 0.4) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 0.3 * s.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 200, ${(s.life - 0.4) * 1.5})`;
      ctx.fill();
    }
    ctx.restore();
  }

  // ============================================
  // BUCKET (drawn on top of everything)
  // ============================================
  if (bucketIn > 0) {
    ctx.save();
    const bx = bucketX + (1 - bucketIn) * 250;
    const by = bucketY;
    ctx.translate(bx, by);
    ctx.rotate(-0.5 - tilt * 0.35); // tilt to pour

    const bw = 90, bh = 110; // bucket dimensions
    const topW = bw, botW = bw * 0.75;

    // Bucket shadow
    ctx.save();
    ctx.shadowBlur = 30;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';

    // Main body — cylindrical bucket shape
    ctx.beginPath();
    ctx.moveTo(-topW / 2, -bh / 2);
    ctx.lineTo(topW / 2, -bh / 2);
    ctx.lineTo(botW / 2, bh / 2);
    ctx.lineTo(-botW / 2, bh / 2);
    ctx.closePath();

    // Dark steel/iron gradient
    const bucketGrad = ctx.createLinearGradient(-topW / 2, 0, topW / 2, 0);
    bucketGrad.addColorStop(0, '#2A2A2E');
    bucketGrad.addColorStop(0.2, '#3D3D42');
    bucketGrad.addColorStop(0.5, '#4A4A50');
    bucketGrad.addColorStop(0.8, '#3A3A40');
    bucketGrad.addColorStop(1, '#252528');
    ctx.fillStyle = bucketGrad;
    ctx.fill();
    ctx.restore();

    // Rust/wear patches
    const patchRand = seededRandom(99);
    for (let i = 0; i < 12; i++) {
      const px = (patchRand() - 0.5) * topW * 0.7;
      const py = (patchRand() - 0.5) * bh * 0.7;
      const ps = 4 + patchRand() * 12;
      ctx.beginPath();
      ctx.arc(px, py, ps, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${70 + patchRand() * 40}, ${35 + patchRand() * 20}, ${15 + patchRand() * 10}, ${0.2 + patchRand() * 0.15})`;
      ctx.fill();
    }

    // Metal bands
    for (const bandY of [-bh * 0.3, 0, bh * 0.3]) {
      const bandW = topW / 2 + (botW / 2 - topW / 2) * ((bandY + bh / 2) / bh);
      ctx.beginPath();
      ctx.rect(-bandW - 1, bandY - 3, (bandW + 1) * 2, 6);
      ctx.fillStyle = '#35353A';
      ctx.fill();
      // Band highlight
      ctx.beginPath();
      ctx.moveTo(-bandW, bandY - 2);
      ctx.lineTo(bandW, bandY - 2);
      ctx.strokeStyle = 'rgba(120, 120, 130, 0.25)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Rivets on bands
    const rivetRand = seededRandom(55);
    for (const bandY of [-bh * 0.3, 0, bh * 0.3]) {
      for (let r = 0; r < 3; r++) {
        const rx = -30 + r * 30 + (rivetRand() - 0.5) * 5;
        ctx.beginPath();
        ctx.arc(rx, bandY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#555558';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rx - 0.5, bandY - 0.5, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180,180,185,0.2)';
        ctx.fill();
      }
    }

    // Rim
    ctx.beginPath();
    ctx.rect(-topW / 2 - 4, -bh / 2 - 8, topW + 8, 10);
    const rimGrad = ctx.createLinearGradient(0, -bh / 2 - 8, 0, -bh / 2 + 2);
    rimGrad.addColorStop(0, '#4A4A50');
    rimGrad.addColorStop(0.5, '#3A3A40');
    rimGrad.addColorStop(1, '#2A2A2E');
    ctx.fillStyle = rimGrad;
    ctx.fill();

    // Inner glow — molten metal visible inside
    ctx.save();
    ctx.shadowBlur = 25;
    ctx.shadowColor = 'rgba(255, 160, 30, 0.7)';
    ctx.beginPath();
    ctx.ellipse(0, -bh / 2 + 2, topW / 2 - 6, 14, 0, 0, Math.PI * 2);
    const innerGlow = ctx.createRadialGradient(0, -bh / 2 + 2, 0, 0, -bh / 2 + 2, topW / 2 - 6);
    innerGlow.addColorStop(0, 'rgba(255, 240, 120, 0.9)');
    innerGlow.addColorStop(0.4, 'rgba(255, 180, 40, 0.7)');
    innerGlow.addColorStop(1, 'rgba(200, 80, 0, 0.3)');
    ctx.fillStyle = innerGlow;
    ctx.fill();
    ctx.restore();

    // Handle
    ctx.beginPath();
    ctx.arc(0, -bh / 2 - 22, 35, Math.PI * 0.18, Math.PI * 0.82);
    ctx.strokeStyle = '#3A3A40';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -bh / 2 - 22, 35, Math.PI * 0.22, Math.PI * 0.78);
    ctx.strokeStyle = 'rgba(100,100,108,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  ctx.globalAlpha = 1;
}

export function IronAnvilSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ progress: 0, time: 0, sparks: [] as Spark[] });
  const rafRef = useRef(0);

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
      const s = stateRef.current;
      const cw = canvas.width / Math.min(window.devicePixelRatio, 2);
      const ch = canvas.height / Math.min(window.devicePixelRatio, 2);
      s.time += 1;
      drawScene(ctx, cw, ch, s.progress, s.time, s.sparks);
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

    tl.to(proxy, {
      progress: 1,
      duration: 0.9,
      ease: 'none',
      onUpdate: () => { stateRef.current.progress = proxy.progress; },
    }, 0);

    textElements.forEach((el, i) => {
      tl.fromTo(el,
        { opacity: 0, x: -25 },
        { opacity: 1, x: 0, duration: 0.10, ease: 'power3.out' },
        0.28 + i * 0.06
      );
    });

    tl.to(textRef.current,
      { opacity: 0, x: -20, duration: 0.10, ease: 'power2.in' },
      0.70
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center">
        <div ref={textRef} className="w-full lg:w-[42%] px-6 lg:pl-12 xl:pl-20 relative z-10">
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

        <div className="absolute right-0 top-0 bottom-0 w-[62%] lg:w-[58%] pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}
