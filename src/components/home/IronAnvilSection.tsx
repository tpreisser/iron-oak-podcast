'use client';

import { useRef, useEffect } from 'react';
import { useGSAP } from '@/hooks/useGSAP';

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  size: number;
  brightness: number;
}

// ============================================================
// ANVIL DRAWING — London pattern (flat top, horn left, heel
// right, waisted body, broad base)
// ============================================================
function drawAnvil(
  ctx: CanvasRenderingContext2D,
  cx: number,  // center x of anvil body
  cy: number,  // center y of top face
  scale: number,
  alpha: number,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // ---- dimensions (all relative to scale=1) ----
  const faceW = 200;   // top face width
  const faceH = 14;    // top face thickness
  const bodyTopW = 150;
  const bodyBotW = 180;
  const bodyH = 55;    // waist height
  const baseW = 220;
  const baseH = 38;
  const hornLen = 90;  // horn extends left
  const hornTip = 14;  // horn tip height
  const heelW = 38;    // heel extends right past face

  // Vertical reference points
  const topY = 0;                       // top of face
  const faceBot = faceH;                // bottom of face plate
  const bodyTop = faceBot;
  const bodyBot = bodyTop + bodyH;
  const baseTop = bodyBot;
  const baseBot = baseTop + baseH;

  // --- Shadow beneath anvil ---
  ctx.save();
  const shadowGrad = ctx.createRadialGradient(0, baseBot + 10, 10, 0, baseBot + 10, 160);
  shadowGrad.addColorStop(0, 'rgba(0,0,0,0.45)');
  shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(0, baseBot + 12, 160, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- Base ---
  ctx.beginPath();
  ctx.moveTo(-baseW / 2, baseTop);
  ctx.lineTo(baseW / 2, baseTop);
  ctx.lineTo(baseW / 2, baseBot);
  ctx.lineTo(-baseW / 2, baseBot);
  ctx.closePath();
  const baseGrad = ctx.createLinearGradient(-baseW / 2, 0, baseW / 2, 0);
  baseGrad.addColorStop(0, '#252528');
  baseGrad.addColorStop(0.15, '#3A3A40');
  baseGrad.addColorStop(0.5, '#4A4A50');
  baseGrad.addColorStop(0.85, '#3A3A40');
  baseGrad.addColorStop(1, '#252528');
  ctx.fillStyle = baseGrad;
  ctx.fill();

  // Base highlight edge
  ctx.beginPath();
  ctx.moveTo(-baseW / 2, baseTop);
  ctx.lineTo(baseW / 2, baseTop);
  ctx.strokeStyle = 'rgba(100,100,110,0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // --- Waisted body ---
  // Body narrows at mid-point then widens at base (classic waist shape)
  const waistX = bodyTopW * 0.28; // how much the sides curve in
  ctx.beginPath();
  ctx.moveTo(-bodyTopW / 2, bodyTop);
  ctx.bezierCurveTo(
    -bodyTopW / 2 - waistX, bodyTop + bodyH * 0.35,
    -bodyBotW / 2, bodyBot - bodyH * 0.3,
    -bodyBotW / 2, bodyBot
  );
  ctx.lineTo(bodyBotW / 2, bodyBot);
  ctx.bezierCurveTo(
    bodyBotW / 2, bodyBot - bodyH * 0.3,
    bodyTopW / 2 + waistX, bodyTop + bodyH * 0.35,
    bodyTopW / 2, bodyTop
  );
  ctx.closePath();
  const bodyGrad = ctx.createLinearGradient(-bodyTopW / 2, 0, bodyTopW / 2, 0);
  bodyGrad.addColorStop(0, '#202024');
  bodyGrad.addColorStop(0.18, '#373740');
  bodyGrad.addColorStop(0.5, '#474750');
  bodyGrad.addColorStop(0.82, '#37373E');
  bodyGrad.addColorStop(1, '#1E1E22');
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Body side highlight
  ctx.beginPath();
  ctx.moveTo(-bodyTopW / 2, bodyTop);
  ctx.bezierCurveTo(
    -bodyTopW / 2 - waistX, bodyTop + bodyH * 0.35,
    -bodyBotW / 2, bodyBot - bodyH * 0.3,
    -bodyBotW / 2, bodyBot
  );
  ctx.strokeStyle = 'rgba(60,60,68,0.6)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // --- Face plate (top surface) ---
  // Extends beyond body: horn side left, heel side right
  const faceLeft = -faceW / 2 - hornLen;
  const faceRight = faceW / 2 + heelW;
  ctx.beginPath();
  ctx.rect(faceLeft, topY, faceRight - faceLeft, faceH);
  const faceGrad = ctx.createLinearGradient(faceLeft, 0, faceRight, 0);
  faceGrad.addColorStop(0, '#2A2A2E');
  faceGrad.addColorStop(0.15, '#3E3E44');
  faceGrad.addColorStop(0.4, '#555560');
  faceGrad.addColorStop(0.5, '#5C5C68');  // brightest at center
  faceGrad.addColorStop(0.6, '#555560');
  faceGrad.addColorStop(0.85, '#3E3E44');
  faceGrad.addColorStop(1, '#2A2A2E');
  ctx.fillStyle = faceGrad;
  ctx.fill();

  // Face top highlight line
  ctx.beginPath();
  ctx.moveTo(faceLeft + 4, topY + 1.5);
  ctx.lineTo(faceRight - 4, topY + 1.5);
  ctx.strokeStyle = 'rgba(130,130,145,0.22)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Face bottom edge (cast shadow line)
  ctx.beginPath();
  ctx.moveTo(faceLeft, faceBot);
  ctx.lineTo(faceRight, faceBot);
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // --- Horn (tapers from face left edge to a rounded tip, pointing left) ---
  ctx.beginPath();
  ctx.moveTo(-faceW / 2 - hornLen, topY);         // horn tip top
  ctx.lineTo(-faceW / 2, topY);                   // connects to face
  ctx.lineTo(-faceW / 2, faceBot);                // face bottom left
  ctx.quadraticCurveTo(
    -faceW / 2 - hornLen * 0.6, faceBot + hornTip * 0.6,
    -faceW / 2 - hornLen, topY + hornTip / 2      // horn tip
  );
  ctx.closePath();
  const hornGrad = ctx.createLinearGradient(-faceW / 2 - hornLen, 0, -faceW / 2, 0);
  hornGrad.addColorStop(0, '#252528');
  hornGrad.addColorStop(0.5, '#3A3A40');
  hornGrad.addColorStop(1, '#484850');
  ctx.fillStyle = hornGrad;
  ctx.fill();

  // Horn top edge highlight
  ctx.beginPath();
  ctx.moveTo(-faceW / 2 - hornLen, topY);
  ctx.lineTo(-faceW / 2, topY);
  ctx.strokeStyle = 'rgba(110,110,125,0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // --- Heel (small protrusion right side) ---
  ctx.beginPath();
  ctx.rect(faceW / 2, topY, heelW, faceH);
  const heelGrad = ctx.createLinearGradient(faceW / 2, 0, faceW / 2 + heelW, 0);
  heelGrad.addColorStop(0, '#48484E');
  heelGrad.addColorStop(1, '#282830');
  ctx.fillStyle = heelGrad;
  ctx.fill();

  // Heel top edge
  ctx.beginPath();
  ctx.moveTo(faceW / 2, topY);
  ctx.lineTo(faceW / 2 + heelW, topY);
  ctx.strokeStyle = 'rgba(110,110,125,0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

// ============================================================
// HAMMER DRAWING — rectangular iron head, wooden handle,
// descending from above
// ============================================================
function drawHammer(
  ctx: CanvasRenderingContext2D,
  headCX: number,  // center x of hammer head
  headY: number,   // bottom of hammer head (impact face)
  alpha: number,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  const headW = 80;
  const headH = 55;
  const handleW = 16;
  const handleLen = 170;

  const headTop = headY - headH;
  const handleTop = headTop - handleLen;
  const handleX = headCX - handleW / 2;

  // --- Handle shadow ---
  ctx.save();
  ctx.shadowBlur = 14;
  ctx.shadowColor = 'rgba(0,0,0,0.4)';

  // Wooden handle
  ctx.beginPath();
  ctx.rect(handleX, handleTop, handleW, handleLen + headH / 2);
  const handleGrad = ctx.createLinearGradient(handleX, 0, handleX + handleW, 0);
  handleGrad.addColorStop(0, '#3D2A18');
  handleGrad.addColorStop(0.3, '#5C4530');
  handleGrad.addColorStop(0.6, '#6B5138');
  handleGrad.addColorStop(0.85, '#4E3622');
  handleGrad.addColorStop(1, '#2E1E10');
  ctx.fillStyle = handleGrad;
  ctx.fill();
  ctx.restore();

  // Wood grain lines on handle
  for (let g = 0; g < 6; g++) {
    const gx = handleX + 3 + g * (handleW / 6);
    ctx.beginPath();
    ctx.moveTo(gx, handleTop + 10);
    ctx.lineTo(gx + (g % 2 === 0 ? 1 : -1) * 2, headTop);
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }

  // --- Iron hammer head ---
  ctx.save();
  ctx.shadowBlur = 20;
  ctx.shadowColor = 'rgba(0,0,0,0.5)';

  ctx.beginPath();
  ctx.rect(headCX - headW / 2, headTop, headW, headH);
  const headGrad = ctx.createLinearGradient(headCX - headW / 2, 0, headCX + headW / 2, 0);
  headGrad.addColorStop(0, '#252528');
  headGrad.addColorStop(0.15, '#373740');
  headGrad.addColorStop(0.5, '#4E4E58');
  headGrad.addColorStop(0.85, '#373740');
  headGrad.addColorStop(1, '#252528');
  ctx.fillStyle = headGrad;
  ctx.fill();
  ctx.restore();

  // Head top highlight
  ctx.beginPath();
  ctx.moveTo(headCX - headW / 2 + 3, headTop + 2);
  ctx.lineTo(headCX + headW / 2 - 3, headTop + 2);
  ctx.strokeStyle = 'rgba(130,130,145,0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Head bottom (impact face) — slightly brighter, worn
  ctx.beginPath();
  ctx.rect(headCX - headW / 2, headY - 6, headW, 6);
  const faceGrad = ctx.createLinearGradient(headCX - headW / 2, 0, headCX + headW / 2, 0);
  faceGrad.addColorStop(0, '#303038');
  faceGrad.addColorStop(0.5, '#5A5A65');
  faceGrad.addColorStop(1, '#303038');
  ctx.fillStyle = faceGrad;
  ctx.fill();

  // Corner bevels on head
  ctx.beginPath();
  ctx.moveTo(headCX - headW / 2, headTop);
  ctx.lineTo(headCX - headW / 2 + 6, headTop);
  ctx.moveTo(headCX + headW / 2 - 6, headTop);
  ctx.lineTo(headCX + headW / 2, headTop);
  ctx.strokeStyle = 'rgba(80,80,90,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

// ============================================================
// HOT GLOW on anvil face at strike point
// ============================================================
function drawStrikeGlow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  intensity: number, // 0–1
) {
  if (intensity <= 0) return;
  ctx.save();

  // Outer warm glow
  const outerR = 80 * intensity;
  const outer = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
  outer.addColorStop(0, `rgba(255, 160, 20, ${0.35 * intensity})`);
  outer.addColorStop(0.4, `rgba(200, 80, 5, ${0.18 * intensity})`);
  outer.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.ellipse(cx, cy, outerR, outerR * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hot white-orange core at impact point
  ctx.save();
  ctx.shadowBlur = 24 * intensity;
  ctx.shadowColor = `rgba(255, 200, 60, ${0.8 * intensity})`;
  const innerR = 28 * intensity;
  const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerR);
  inner.addColorStop(0, `rgba(255, 255, 200, ${0.95 * intensity})`);
  inner.addColorStop(0.25, `rgba(255, 230, 120, ${0.85 * intensity})`);
  inner.addColorStop(0.6, `rgba(255, 160, 30, ${0.6 * intensity})`);
  inner.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = inner;
  ctx.beginPath();
  ctx.ellipse(cx, cy, innerR, innerR * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

// ============================================================
// MAIN SCENE — all phases driven by scroll progress 0–1
// ============================================================
function drawScene(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  progress: number,
  time: number,
  sparks: Spark[],
) {
  ctx.clearRect(0, 0, w, h);
  if (progress <= 0.01) return;

  // === LAYOUT ANCHORS ===
  // Anvil centered in right 55% of canvas
  const anvilCX = w * 0.68;
  const anvilTopY = h * 0.52; // y of anvil top face (center of canvas vertically)
  const hammerCX = anvilCX - 10; // hammer slightly left of anvil center (more natural)

  // === PHASE CALCULATIONS ===
  // 0.00–0.15: anvil fades in
  const anvilAlpha = progress < 0.15
    ? Math.min(1, progress / 0.15)
    : progress > 0.85 ? Math.max(0, 1 - (progress - 0.85) / 0.15) : 1;

  const anvilScale = progress < 0.15
    ? 0.88 + (progress / 0.15) * 0.12
    : 1.0;

  // 0.15–0.35: hammer descends from above
  const hammerAppear = progress < 0.15 ? 0 : Math.min(1, (progress - 0.15) / 0.20);

  // Hammer Y: starts high (off-screen top), descends to just above anvil face
  // Rest position = 80px above anvil face; strike = flush with anvil face
  const hammerRestOffset = 80;  // px above anvil face when at rest
  const hammerHeadH = 55;

  // 0.35–0.50: first strike — hammer slams down
  const strike1 = progress < 0.35 ? 0 : Math.min(1, (progress - 0.35) / 0.08);
  // 0.50–0.70: hammer lifts back up
  const lift1 = progress < 0.50 ? 0 : Math.min(1, (progress - 0.50) / 0.15);
  // 0.70–0.85: second strike
  const strike2 = progress < 0.70 ? 0 : Math.min(1, (progress - 0.70) / 0.08);
  // 0.85–1.0: hammer lifts and fades
  const lift2 = progress < 0.85 ? 0 : Math.min(1, (progress - 0.85) / 0.15);

  // Hammer bottom Y (= impact face position)
  let hammerY: number;
  if (hammerAppear < 1) {
    // Descending phase: hammer comes down from h*-0.1 to rest position
    const startY = anvilTopY - hammerRestOffset - hammerHeadH - 300;
    const endY = anvilTopY - hammerRestOffset;
    hammerY = startY + (endY - startY) * hammerAppear;
  } else if (strike1 < 1) {
    // First strike descend — eases in quickly
    const ease = 1 - Math.pow(1 - strike1, 3);
    hammerY = (anvilTopY - hammerRestOffset) + hammerRestOffset * ease;
  } else if (lift1 < 1) {
    // Lift back up after first strike
    const ease = Math.pow(lift1, 2);
    hammerY = anvilTopY - hammerRestOffset * 0.6 * ease;
  } else if (strike2 < 1) {
    // Second strike
    const ease = 1 - Math.pow(1 - strike2, 3);
    const startY2 = anvilTopY - hammerRestOffset * 0.4;
    hammerY = startY2 + (anvilTopY - startY2) * ease;
  } else {
    // Lift after second strike
    const ease = Math.pow(lift2, 2);
    hammerY = anvilTopY - hammerRestOffset * ease;
  }

  // Clamp hammer so it never goes below anvil face
  hammerY = Math.min(hammerY, anvilTopY);

  // === STRIKE GLOW ===
  // Glow intensity spikes at strike moments and decays
  let glowIntensity = 0;
  if (strike1 >= 0.9 && lift1 < 0.5) {
    // Peak at strike1=1, decay during lift
    glowIntensity = Math.max(0, 1 - lift1 * 2.5);
  }
  if (strike2 >= 0.9 && lift2 < 0.5) {
    const g2 = Math.max(0, 1 - lift2 * 2.5);
    glowIntensity = Math.max(glowIntensity, g2 * 1.2); // second strike hotter
  }
  glowIntensity = Math.min(1, glowIntensity);

  // === AMBIENT GLOW (faint, always when anvil visible) ===
  if (anvilAlpha > 0 && glowIntensity > 0) {
    const ambientR = w * 0.35 * glowIntensity;
    const ambient = ctx.createRadialGradient(anvilCX, anvilTopY, 0, anvilCX, anvilTopY, ambientR);
    ambient.addColorStop(0, `rgba(255, 120, 20, ${0.12 * glowIntensity * anvilAlpha})`);
    ambient.addColorStop(0.5, `rgba(200, 60, 5, ${0.06 * glowIntensity * anvilAlpha})`);
    ambient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ambient;
    ctx.fillRect(0, 0, w, h);
  }

  // === DRAW ANVIL ===
  drawAnvil(ctx, anvilCX, anvilTopY, 1.0, anvilAlpha);

  // === DRAW STRIKE GLOW (on top of anvil face) ===
  drawStrikeGlow(ctx, anvilCX - 10, anvilTopY + 2, glowIntensity * anvilAlpha);

  // === SPAWN SPARKS ===
  const isStriking1 = strike1 > 0.85 && lift1 < 0.3;
  const isStriking2 = strike2 > 0.85 && lift2 < 0.35;

  if ((isStriking1 || isStriking2) && time % 2 === 0) {
    const burstCount = isStriking2 ? 8 : 5; // second strike bigger
    const impactX = anvilCX - 10;
    const impactY = anvilTopY;

    for (let i = 0; i < burstCount; i++) {
      // Sparks fan out in all directions from impact point
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 5.5;
      sparks.push({
        x: impactX + (Math.random() - 0.5) * 12,
        y: impactY - 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5, // bias upward
        life: 0.55 + Math.random() * 0.5,
        size: 1.2 + Math.random() * 2.8,
        brightness: 0.6 + Math.random() * 0.4,
      });
    }
  }

  // Trickle sparks while glow is active (cooling phase)
  if (glowIntensity > 0.2 && time % 4 === 0) {
    const impactX = anvilCX - 10;
    sparks.push({
      x: impactX + (Math.random() - 0.5) * 20,
      y: anvilTopY - 2,
      vx: (Math.random() - 0.5) * 3,
      vy: -(1.5 + Math.random() * 2.5),
      life: 0.4 + Math.random() * 0.35,
      size: 0.8 + Math.random() * 1.6,
      brightness: 0.5 + Math.random() * 0.4,
    });
  }

  // === UPDATE & DRAW SPARKS ===
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.14;   // gravity
    s.vx *= 0.98;   // drag
    s.life -= 0.022;
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

  // === DRAW HAMMER (on top of sparks) ===
  if (hammerAppear > 0) {
    const hammerAlpha = progress > 0.85
      ? Math.max(0, 1 - (progress - 0.85) / 0.15) * anvilAlpha
      : hammerAppear;
    drawHammer(ctx, hammerCX, hammerY, hammerAlpha);
  }
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
        {/* Text — left side.
            Mobile: full-width so text is fully readable.
            lg+: 42% so canvas has room on the right.
        */}
        <div ref={textRef} className="w-full lg:w-[42%] px-6 lg:pl-12 xl:pl-20 relative z-10">
          <span className="why-text-item block font-[family-name:var(--font-accent)] text-sm tracking-[0.2em] uppercase text-[var(--accent-iron-light)] mb-4 opacity-0">
            Our Purpose
          </span>
          <h2 className="why-text-item font-[family-name:var(--font-display)] text-[var(--text-h1)] text-[var(--text-primary)] leading-tight mb-6 opacity-0">
            Why Are We Here?
          </h2>
          {/* text-base on mobile (16px minimum for iOS no-zoom); text-lg on md+ */}
          <p className="why-text-item text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-4 max-w-lg opacity-0">
            Because faith that can&apos;t be questioned isn&apos;t faith — it&apos;s habit. Because the people sitting in pews deserve more than bumper-sticker theology. Because iron sharpens iron, and that means friction.
          </p>
          <p className="why-text-item text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg opacity-0">
            We&apos;re here to take the hardest doctrines of the Christian faith, lay them on the anvil, and strike until what&apos;s true rings clear.
          </p>
        </div>

        {/* Canvas — right side.
            Mobile: reduced opacity so it reads as a background texture behind the text,
            not a competing element.
            lg+: back to full opacity, constrained to right 58%.
        */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[58%] pointer-events-none opacity-30 lg:opacity-100">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}
