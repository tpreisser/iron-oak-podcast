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
// POSE TYPE — position-based keyframe for the hammer
//
// hx, hy  = world-space position of the hammer HEAD CENTER
// rot     = rotation in degrees:
//           0°  = handle points right (+X in local space)
//           90° = handle points down
//           180°= handle points left
//           270°= handle points up
//
// The impact face of the hammer is at the -X (left) end of the head
// in local space. After rotation, it points in the direction:
//   world = rotate(-X, rotDeg) = (-cos(rotDeg°), -sin(rotDeg°))
// So rot=270° means the impact face points straight DOWN onto the anvil.
// ============================================================
interface HammerPose {
  hx: number;
  hy: number;
  rot: number;
}

// ============================================================
// EASING HELPERS
// ============================================================
function easeIn3(t: number): number { return t * t * t; }
function easeOut3(t: number): number { return 1 - Math.pow(1 - t, 3); }
function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }
function lerpPose(a: HammerPose, b: HammerPose, t: number): HammerPose {
  return { hx: lerp(a.hx, b.hx, t), hy: lerp(a.hy, b.hy, t), rot: lerp(a.rot, b.rot, t) };
}

// ============================================================
// ANVIL DRAWING — traced silhouette from reference
//
// cx/cy = center of the anvil body (cx = horizontal throat center,
//         cy = top of the working face).
// ============================================================
function drawAnvil(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  alpha: number,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(-30, 125, 110, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Main silhouette path (traced from reference image)
  ctx.beginPath();
  ctx.moveTo(-180, 12);
  ctx.bezierCurveTo(-120, -4, -30, -6, 75, -2);
  ctx.bezierCurveTo(82, -1, 85, 8, 78, 22);
  ctx.bezierCurveTo(65, 42, 48, 55, 38, 72);
  ctx.bezierCurveTo(42, 78, 55, 82, 95, 85);
  ctx.lineTo(95, 115);
  ctx.bezierCurveTo(70, 115, 30, 80, 0, 78);
  ctx.bezierCurveTo(-30, 80, -70, 115, -95, 115);
  ctx.lineTo(-95, 85);
  ctx.bezierCurveTo(-55, 82, -42, 78, -38, 72);
  ctx.bezierCurveTo(-48, 55, -65, 42, -68, 22);
  ctx.bezierCurveTo(-72, 28, -130, 30, -180, 12);
  ctx.closePath();

  const bodyGrad = ctx.createLinearGradient(-180, 0, 85, 0);
  bodyGrad.addColorStop(0,    '#161618');
  bodyGrad.addColorStop(0.35, '#454558');
  bodyGrad.addColorStop(0.55, '#585868');
  bodyGrad.addColorStop(0.90, '#2A2A38');
  bodyGrad.addColorStop(1,    '#1A1A22');
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Face highlight strip along the flat working surface
  ctx.beginPath();
  ctx.moveTo(-180, 12);
  ctx.bezierCurveTo(-120, -4, -30, -6, 75, -2);
  ctx.lineTo(75, 5);
  ctx.bezierCurveTo(-30, 2, -120, 4, -180, 12);
  ctx.closePath();
  const faceHighlight = ctx.createLinearGradient(-180, 0, 75, 0);
  faceHighlight.addColorStop(0,   'rgba(70,70,88,0)');
  faceHighlight.addColorStop(0.5, 'rgba(115,115,138,0.7)');
  faceHighlight.addColorStop(1,   'rgba(85,85,100,0.35)');
  ctx.fillStyle = faceHighlight;
  ctx.fill();

  // Specular top edge line
  ctx.beginPath();
  ctx.moveTo(-170, 10);
  ctx.bezierCurveTo(-115, -5, -25, -7, 74, -3);
  ctx.strokeStyle = 'rgba(220,220,240,0.5)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Hardy hole (square) on the heel
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.fillRect(46, 3, 10, 10);

  // Pritchel hole (round) on the heel
  ctx.beginPath();
  ctx.arc(64, 8, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fill();

  ctx.restore();
}

// ============================================================
// HAMMER DRAWING — position-based pose system
//
// Draws the hammer with its HEAD CENTER at (hx, hy) world-space.
// rotDeg controls the handle direction:
//   rot=0  : handle extends RIGHT, impact face faces LEFT
//   rot=90 : handle extends DOWN,  impact face faces UP
//   rot=270: handle extends UP,    impact face faces DOWN (striking pose)
//   rot=315: handle extends upper-right, impact face faces lower-left (raised/cocked)
//
// In local coords after translate(hx,hy)+rotate(rotDeg):
//   Head block:    rect(-headW/2, -headH/2, headW, headH)  — centered at origin
//   Impact face:   strip at the -X end of the head
//   Handle:        extends in the +X direction from head right edge
// ============================================================
function drawHammer(
  ctx: CanvasRenderingContext2D,
  pose: HammerPose,
  alpha: number,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(pose.hx, pose.hy);
  ctx.rotate(pose.rot * Math.PI / 180);

  const headW    = 58;   // head dimension along handle axis
  const headH    = 82;   // head dimension perpendicular to handle
  const handleW  = 15;
  const handleLen = 280;

  // === WOODEN HANDLE (extends in +X direction from head right edge) ===
  const handleGrad = ctx.createLinearGradient(0, -handleW / 2, 0, handleW / 2);
  handleGrad.addColorStop(0,    '#3A2214');
  handleGrad.addColorStop(0.20, '#5C4530');
  handleGrad.addColorStop(0.45, '#6E5238');
  handleGrad.addColorStop(0.65, '#604A30');
  handleGrad.addColorStop(0.85, '#4A3320');
  handleGrad.addColorStop(1,    '#2C1A0C');

  ctx.beginPath();
  ctx.rect(headW / 2, -handleW / 2, handleLen, handleW);
  ctx.fillStyle = handleGrad;
  ctx.fill();

  // Wood grain lines clipped to handle shape
  ctx.save();
  ctx.beginPath();
  ctx.rect(headW / 2, -handleW / 2, handleLen, handleW);
  ctx.clip();
  for (let g = 0; g < 5; g++) {
    const t = (g + 0.5) / 5;
    const lineY = -handleW / 2 + handleW * t;
    ctx.beginPath();
    ctx.moveTo(headW / 2, lineY);
    ctx.lineTo(headW / 2 + handleLen, lineY);
    ctx.strokeStyle = g % 2 === 0 ? 'rgba(0,0,0,0.12)' : 'rgba(100,70,40,0.09)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
  ctx.restore();

  // === IRON HAMMER HEAD (centered at local origin) ===
  ctx.save();
  ctx.shadowBlur  = 18;
  ctx.shadowColor = 'rgba(0,0,0,0.55)';

  const headGrad = ctx.createLinearGradient(0, -headH / 2, 0, headH / 2);
  headGrad.addColorStop(0,    '#1E1E24');
  headGrad.addColorStop(0.12, '#32323C');
  headGrad.addColorStop(0.40, '#4A4A56');
  headGrad.addColorStop(0.58, '#525260');
  headGrad.addColorStop(0.80, '#3A3A44');
  headGrad.addColorStop(1,    '#1C1C22');

  ctx.beginPath();
  ctx.rect(-headW / 2, -headH / 2, headW, headH);
  ctx.fillStyle = headGrad;
  ctx.fill();
  ctx.restore();

  // Impact face strip — at the -X end (the striking face)
  const faceGrad = ctx.createLinearGradient(0, -headH / 2, 0, headH / 2);
  faceGrad.addColorStop(0,   '#282830');
  faceGrad.addColorStop(0.5, '#565664');
  faceGrad.addColorStop(1,   '#262830');
  ctx.beginPath();
  ctx.rect(-headW / 2, -headH / 2, 6, headH);
  ctx.fillStyle = faceGrad;
  ctx.fill();

  // Top-edge highlight on head
  ctx.beginPath();
  ctx.moveTo(-headW / 2, -headH / 2 + 2);
  ctx.lineTo( headW / 2, -headH / 2 + 2);
  ctx.strokeStyle = 'rgba(130,130,148,0.22)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

// ============================================================
// STRIKE GLOW — hot orange-white glow at impact point on anvil face
// ============================================================
function drawStrikeGlow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  intensity: number,
) {
  if (intensity <= 0) return;
  ctx.save();

  const outerR = 90 * intensity;
  const outer  = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
  outer.addColorStop(0,   `rgba(255, 160, 20,  ${0.40 * intensity})`);
  outer.addColorStop(0.4, `rgba(200,  80,  5,  ${0.18 * intensity})`);
  outer.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.ellipse(cx, cy, outerR, outerR * 0.50, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.shadowBlur  = 28 * intensity;
  ctx.shadowColor = `rgba(255, 200, 60, ${0.85 * intensity})`;
  const innerR = 30 * intensity;
  const inner  = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerR);
  inner.addColorStop(0,    `rgba(255, 255, 210, ${0.98 * intensity})`);
  inner.addColorStop(0.20, `rgba(255, 240, 140, ${0.90 * intensity})`);
  inner.addColorStop(0.55, `rgba(255, 160,  30, ${0.65 * intensity})`);
  inner.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = inner;
  ctx.beginPath();
  ctx.ellipse(cx, cy, innerR, innerR * 0.60, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

// ============================================================
// SPARKS — update physics and render golden/copper particles
// ============================================================
function drawSparks(
  ctx: CanvasRenderingContext2D,
  sparks: Spark[],
) {
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    s.x  += s.vx;
    s.y  += s.vy;
    s.vy += 0.15;
    s.vx *= 0.97;
    s.life -= 0.024;
    if (s.life <= 0) { sparks.splice(i, 1); continue; }

    ctx.save();
    ctx.shadowBlur  = 7;
    ctx.shadowColor = `rgba(255, 180, 40, ${s.life * 0.55})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
    const r = 255;
    const g = Math.round(180 + s.brightness * 75);
    const b = Math.round(40  + s.brightness * 55);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.life * 0.92})`;
    ctx.fill();
    if (s.life > 0.38) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 0.28 * s.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 210, ${(s.life - 0.38) * 1.6})`;
      ctx.fill();
    }
    ctx.restore();
  }
}

// ============================================================
// MAIN SCENE — position-based keyframe animation driven by scroll 0–1
//
// Timing defaults (match hammer-tuner defaults):
//   Strike 1: start=0.30, hit=0.42
//   Strike 2: start=0.52, hit=0.65
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

  // ── Layout anchors ─────────────────────────────────────────────
  // Anvil sits in the right ~55% of the canvas (canvas itself is already the right 58%).
  // anvilCX  = horizontal center of the anvil throat/body
  // anvilTopY = y of the TOP of the anvil working face
  const anvilCX    = w * 0.62;
  const anvilTopY  = h * 0.50;
  const anvilScale = 0.88;

  // Impact point: where the hammer face contacts the anvil
  // Slightly left of body center (working area between horn and hardy hole)
  const impactX = anvilCX - 20;
  const impactY = anvilTopY - 2;

  // ── Timing constants ───────────────────────────────────────────
  const APPEAR_START = 0.15;
  const S1_START     = 0.30;
  const S1_HIT       = 0.42;
  const S2_START     = 0.52;
  const S2_HIT       = 0.65;
  const L1_DUR       = 0.10;
  const L2_DUR       = 0.15;

  // ── Anvil alpha (fade in/out at section boundaries) ────────────
  const anvilAlpha = progress < 0.15
    ? Math.min(1, progress / 0.15)
    : progress > 0.85
      ? Math.max(0, 1 - (progress - 0.85) / 0.15)
      : 1;

  // ── Key poses ──────────────────────────────────────────────────
  // RAISED: hammer is held high to the right, ready to strike down-left.
  //   rot=315°: handle points upper-right, impact face (-X end) faces lower-left toward anvil.
  const RAISED: HammerPose = {
    hx:  impactX + 110,
    hy:  impactY - 195,
    rot: 315,
  };

  // IMPACT: hammer face (at -X end of head in local space) is on the anvil face.
  //   rot=270°: impact face points straight down (-X local → world -Y reversed = +Y... )
  //   At rot=270: local +X maps to world (cos270°, sin270°) = (0, -1) = UP.
  //               local -X maps to world DOWN (+Y). So impact face points DOWN. ✓
  //   Head center offset: the impact face is at x=-headW/2=-29 in local. After rotation 270°
  //   that becomes y=+29 below center. So center must be 29px ABOVE impactY: hy = impactY - 29.
  const IMPACT: HammerPose = {
    hx:  impactX,
    hy:  impactY - 29,
    rot: 270,
  };

  // BOUNCE: hammer lifts slightly after impact.
  //   Head rises a bit, rotation tilts back slightly past vertical.
  const BOUNCE: HammerPose = {
    hx:  impactX + 18,
    hy:  impactY - 65,
    rot: 285,
  };

  // ── Compute current pose ───────────────────────────────────────
  let pose: HammerPose | null = null;
  let hammerAlpha = 0;

  if (progress < APPEAR_START) {
    // Not yet visible
    hammerAlpha = 0;
  } else if (progress < S1_START) {
    // Fade in: drift from slightly off-screen to RAISED position
    const t     = (progress - APPEAR_START) / Math.max(0.001, S1_START - APPEAR_START);
    const eased = easeOut3(t);
    const OFFSCREEN: HammerPose = {
      hx:  RAISED.hx + 80,
      hy:  RAISED.hy - 60,
      rot: RAISED.rot - 25,
    };
    pose = lerpPose(OFFSCREEN, RAISED, eased);
    hammerAlpha = Math.min(1, t * 3);
  } else if (progress < S1_HIT) {
    // Strike 1: RAISED → IMPACT with ease-in (accelerating swing)
    const t = (progress - S1_START) / Math.max(0.001, S1_HIT - S1_START);
    pose = lerpPose(RAISED, IMPACT, easeIn3(t));
    hammerAlpha = 1;
  } else if (progress < S2_START) {
    // Between strikes: IMPACT → BOUNCE → RAISED
    const segDur = S2_START - S1_HIT;
    const t      = (progress - S1_HIT) / Math.max(0.001, segDur);
    if (t < 0.35) {
      pose = lerpPose(IMPACT, BOUNCE, easeOut3(t / 0.35));
    } else {
      pose = lerpPose(BOUNCE, RAISED, easeOut3((t - 0.35) / 0.65));
    }
    hammerAlpha = 1;
  } else if (progress < S2_HIT) {
    // Strike 2: RAISED → IMPACT with ease-in
    const t = (progress - S2_START) / Math.max(0.001, S2_HIT - S2_START);
    pose = lerpPose(RAISED, IMPACT, easeIn3(t));
    hammerAlpha = 1;
  } else if (progress < 0.85) {
    // After strike 2: IMPACT → BOUNCE → RAISED
    const segDur = 0.85 - S2_HIT;
    const t      = (progress - S2_HIT) / Math.max(0.001, segDur);
    if (t < 0.25) {
      pose = lerpPose(IMPACT, BOUNCE, easeOut3(t / 0.25));
    } else {
      pose = lerpPose(BOUNCE, RAISED, easeOut3((t - 0.25) / 0.75));
    }
    hammerAlpha = 1;
  } else {
    // Fade out at raised position
    pose = RAISED;
    hammerAlpha = Math.max(0, 1 - (progress - 0.85) / 0.15);
  }

  // ── Strike glow intensity ──────────────────────────────────────
  let glowIntensity = 0;

  if (progress >= S1_HIT && progress < S1_HIT + L1_DUR) {
    const t = (progress - S1_HIT) / L1_DUR;
    glowIntensity = Math.max(0, 1 - t * 2.2);
  }
  if (progress >= S2_HIT && progress < S2_HIT + L2_DUR) {
    const t  = (progress - S2_HIT) / L2_DUR;
    const g2 = Math.max(0, 1 - t * 2.0) * 1.25;
    glowIntensity = Math.max(glowIntensity, g2);
  }
  glowIntensity = Math.min(1, glowIntensity);

  // ── Ambient screen glow during strikes ────────────────────────
  if (glowIntensity > 0 && anvilAlpha > 0) {
    const ambR    = w * 0.40 * glowIntensity;
    const ambient = ctx.createRadialGradient(impactX, impactY, 0, impactX, impactY, ambR);
    ambient.addColorStop(0,   `rgba(255, 120, 20, ${0.14 * glowIntensity * anvilAlpha})`);
    ambient.addColorStop(0.5, `rgba(200,  60,  5, ${0.07 * glowIntensity * anvilAlpha})`);
    ambient.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = ambient;
    ctx.fillRect(0, 0, w, h);
  }

  // ── Draw: anvil ────────────────────────────────────────────────
  drawAnvil(ctx, anvilCX, anvilTopY, anvilScale, anvilAlpha);

  // ── Draw: strike glow on anvil face ───────────────────────────
  drawStrikeGlow(ctx, impactX, impactY + 4, glowIntensity * anvilAlpha);

  // ── Spawn sparks at strike moments ────────────────────────────
  const isStriking1 = progress > S1_HIT && progress < S1_HIT + L1_DUR * 0.45;
  const isStriking2 = progress > S2_HIT && progress < S2_HIT + L2_DUR * 0.50;

  if ((isStriking1 || isStriking2) && time % 2 === 0) {
    const burstCount = isStriking2 ? 9 : 6;
    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.random() * Math.PI * 1.6) - Math.PI * 1.3;
      const speed = 3.0 + Math.random() * 6.0;
      sparks.push({
        x:          impactX + (Math.random() - 0.5) * 14,
        y:          impactY - 2,
        vx:         Math.cos(angle) * speed,
        vy:         Math.sin(angle) * speed - 3.0,
        life:       0.6 + Math.random() * 0.5,
        size:       1.4 + Math.random() * 3.0,
        brightness: 0.55 + Math.random() * 0.45,
      });
    }
  }

  if (glowIntensity > 0.18 && time % 3 === 0) {
    sparks.push({
      x:          impactX + (Math.random() - 0.5) * 22,
      y:          impactY - 3,
      vx:         (Math.random() - 0.5) * 2.5,
      vy:         -(1.8 + Math.random() * 2.8),
      life:       0.4 + Math.random() * 0.32,
      size:       0.9 + Math.random() * 1.8,
      brightness: 0.5 + Math.random() * 0.38,
    });
  }

  // ── Draw: sparks (after anvil, before hammer) ─────────────────
  drawSparks(ctx, sparks);

  // ── Draw: hammer (topmost layer) ──────────────────────────────
  if (pose && hammerAlpha > 0) {
    const finalAlpha = hammerAlpha * (anvilAlpha > 0 ? 1 : 0);
    drawHammer(ctx, pose, finalAlpha);
  }
}

// ============================================================
// COMPONENT
// ============================================================
export function IronAnvilSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const stateRef   = useRef({ progress: 0, time: 0, sparks: [] as Spark[] });
  const rafRef     = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr    = Math.min(window.devicePixelRatio, 2);
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width  = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const s  = stateRef.current;
      const cw = canvas.width  / Math.min(window.devicePixelRatio, 2);
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
        start:   'top top',
        end:     '+=180%',
        pin:     true,
        scrub:   0.8,
      },
    });

    tl.to(proxy, {
      progress: 1,
      duration: 0.9,
      ease:     'none',
      onUpdate: () => { stateRef.current.progress = proxy.progress; },
    }, 0);

    textElements.forEach((el, i) => {
      tl.fromTo(el,
        { opacity: 0, x: -25 },
        { opacity: 1, x: 0, duration: 0.10, ease: 'power3.out' },
        0.28 + i * 0.06,
      );
    });

    tl.to(textRef.current,
      { opacity: 0, x: -20, duration: 0.10, ease: 'power2.in' },
      0.70,
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
            Mobile: reduced opacity so it reads as a background texture behind the text.
            lg+: full opacity, constrained to right 58%.
        */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[58%] pointer-events-none opacity-30 lg:opacity-100">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}
