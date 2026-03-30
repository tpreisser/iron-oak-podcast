'use client';

import { useRef, useEffect } from 'react';
import { useGSAP } from '@/hooks/useGSAP';

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  maxLife: number;
  size: number;
  brightness: number;
  type: 0 | 1 | 2;   // 0=large, 1=ember, 2=micro
  trail: number;      // trail length in px
}

// ============================================================
// ANVIL DRAWING — traced silhouette from reference
//
// cx/cy = center of the anvil body (cx = horizontal throat center,
//         cy = top of the working face).
// ============================================================
// Preload the anvil image once
let anvilImg: HTMLImageElement | null = null;
let anvilLoaded = false;
if (typeof window !== 'undefined') {
  anvilImg = new window.Image();
  anvilImg.onload = () => { anvilLoaded = true; };
  anvilImg.src = '/images/anvil.png';
}

function drawAnvil(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  alpha: number,
) {
  if (alpha <= 0 || !anvilLoaded || !anvilImg) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  // The image is 280x180. We want the top of the anvil face
  // to align with cy. The face is about 5% from the top of the image.
  // Scale the image to ~350px wide (matching previous anvil size) × scale factor
  const imgW = 350 * scale;
  const imgH = (180 / 280) * imgW;
  const faceOffsetY = imgH * 0.05; // face is near the top of the image

  // Center horizontally on cx, align face top to cy
  ctx.drawImage(anvilImg, cx - imgW * 0.55, cy - faceOffsetY, imgW, imgH);

  ctx.restore();
}

// ============================================================
// HAMMER DRAWING — pivot-rotation approach
//
// Called AFTER ctx.save(), ctx.translate(pivotX, pivotY),
// ctx.rotate(currentAngle) have been applied by the caller.
//
// In this local coordinate system:
//   - (0, 0) is the pivot (hand grip)
//   - +X points from the pivot toward the hammer head
//   - The handle runs from (0, 0) to (handleLength, 0)
//   - The head is centered at (handleLength, 0), perpendicular to handle
// ============================================================
function drawHammer(
  ctx: CanvasRenderingContext2D,
  handleLength: number,
  alpha: number,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  const handleW  = 14;   // handle thickness (perpendicular to handle axis)
  const headLen  = 56;   // head extent along the handle axis
  const headW    = 80;   // head extent perpendicular to the handle axis

  // === WOODEN HANDLE ===
  // Runs from (0, -handleW/2) to (handleLength, handleW/2) along local X
  const handleGrad = ctx.createLinearGradient(0, -handleW / 2, 0, handleW / 2);
  handleGrad.addColorStop(0,    '#3A2214');
  handleGrad.addColorStop(0.20, '#5C4530');
  handleGrad.addColorStop(0.45, '#6E5238');
  handleGrad.addColorStop(0.65, '#604A30');
  handleGrad.addColorStop(0.85, '#4A3320');
  handleGrad.addColorStop(1,    '#2C1A0C');

  ctx.beginPath();
  ctx.rect(0, -handleW / 2, handleLength, handleW);
  ctx.fillStyle = handleGrad;
  ctx.fill();

  // Wood grain lines clipped to handle shape
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, -handleW / 2, handleLength, handleW);
  ctx.clip();
  for (let g = 0; g < 5; g++) {
    const t    = (g + 0.5) / 5;
    const lineY = -handleW / 2 + handleW * t;
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(handleLength, lineY);
    ctx.strokeStyle = g % 2 === 0 ? 'rgba(0,0,0,0.12)' : 'rgba(100,70,40,0.09)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
  ctx.restore();

  // === IRON HAMMER HEAD ===
  // Centered at (handleLength, 0) in local space
  // headLen along X (handle axis), headW along Y (perpendicular)
  ctx.save();
  ctx.translate(handleLength, 0);

  // No shadowBlur — too expensive for 60fps canvas

  const headGrad = ctx.createLinearGradient(0, -headW / 2, 0, headW / 2);
  headGrad.addColorStop(0,    '#1E1E24');
  headGrad.addColorStop(0.12, '#32323C');
  headGrad.addColorStop(0.40, '#4A4A56');
  headGrad.addColorStop(0.58, '#525260');
  headGrad.addColorStop(0.80, '#3A3A44');
  headGrad.addColorStop(1,    '#1C1C22');

  ctx.beginPath();
  ctx.rect(-headLen / 2, -headW / 2, headLen, headW);
  ctx.fillStyle = headGrad;
  ctx.fill();
  ctx.restore();

  // Impact face strip — at the far end from pivot (+X side of head)
  // The head extends from (handleLength - headLen/2) to (handleLength + headLen/2).
  // The striking face is the +X end: at handleLength + headLen/2.
  ctx.save();
  ctx.translate(handleLength, 0);
  const faceGrad = ctx.createLinearGradient(0, -headW / 2, 0, headW / 2);
  faceGrad.addColorStop(0,   '#282830');
  faceGrad.addColorStop(0.5, '#565664');
  faceGrad.addColorStop(1,   '#262830');
  ctx.beginPath();
  ctx.rect(headLen / 2 - 6, -headW / 2, 6, headW);
  ctx.fillStyle = faceGrad;
  ctx.fill();

  // Top-edge highlight on head
  ctx.beginPath();
  ctx.moveTo(-headLen / 2, -headW / 2 + 2);
  ctx.lineTo( headLen / 2, -headW / 2 + 2);
  ctx.strokeStyle = 'rgba(130,130,148,0.22)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();

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
  // No shadowBlur — using gradients instead for performance
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
// SPARKS — hyper-realistic forge spark physics and rendering
//
// type 0 = large bright sparks   (fast, far, white-yellow core, long trail)
// type 1 = ember particles        (slow, floaty, orange-copper, medium trail)
// type 2 = micro sparks           (very fast, very short life, yellow-white)
// ============================================================
function drawSparks(
  ctx: CanvasRenderingContext2D,
  sparks: Spark[],
) {
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];

    // ── Physics — type-dependent drag and gravity ───────────────
    if (s.type === 0) {
      // Large sparks: low drag, normal gravity
      s.x  += s.vx;
      s.y  += s.vy;
      s.vy += 0.18;
      s.vx *= 0.985;
    } else if (s.type === 1) {
      // Embers: high drag, reduced gravity, gentle horizontal wobble
      s.x  += s.vx + Math.sin(s.life * 18 + s.brightness * 8) * 0.4;
      s.y  += s.vy;
      s.vy += 0.06;     // float more, fall slower
      s.vx *= 0.96;
    } else {
      // Micro sparks: very low drag (fly far fast), slightly less gravity
      s.x  += s.vx;
      s.y  += s.vy;
      s.vy += 0.14;
      s.vx *= 0.99;
    }

    s.life -= s.type === 1 ? 0.016 : s.type === 0 ? 0.022 : 0.038;
    if (s.life <= 0) { sparks.splice(i, 1); continue; }

    const lifeFrac = s.life / s.maxLife;   // 1 = brand new, 0 = dead

    ctx.save();

    // ── Motion trail — line drawn backward along velocity ──────
    if (s.trail > 0 && (s.type === 0 || s.type === 2)) {
      const speed  = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      if (speed > 0.5) {
        const nx     = -s.vx / speed;
        const ny     = -s.vy / speed;
        const tLen   = s.trail * lifeFrac;
        const tx     = s.x + nx * tLen;
        const ty     = s.y + ny * tLen;
        const trailA = lifeFrac * (s.type === 0 ? 0.75 : 0.5);
        const trailGrad = ctx.createLinearGradient(s.x, s.y, tx, ty);
        if (s.type === 0) {
          trailGrad.addColorStop(0, `rgba(255, 240, 180, ${trailA})`);
        } else {
          trailGrad.addColorStop(0, `rgba(255, 220, 80, ${trailA})`);
        }
        trailGrad.addColorStop(1, 'rgba(255, 120, 20, 0)');
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth   = s.size * lifeFrac * (s.type === 0 ? 1.0 : 0.6);
        ctx.lineCap     = 'round';
        ctx.stroke();
      }
    }

    // ── Ember type 1 — shorter, fatter trail (glow streak) ─────
    if (s.type === 1 && s.trail > 0) {
      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      if (speed > 0.3) {
        const nx = -s.vx / speed;
        const ny = -s.vy / speed;
        const tLen = s.trail * lifeFrac;
        const emberGrad = ctx.createLinearGradient(
          s.x, s.y, s.x + nx * tLen, s.y + ny * tLen,
        );
        emberGrad.addColorStop(0, `rgba(255, 140, 30, ${lifeFrac * 0.55})`);
        emberGrad.addColorStop(1, 'rgba(180, 60, 10, 0)');
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + nx * tLen, s.y + ny * tLen);
        ctx.strokeStyle = emberGrad;
        ctx.lineWidth   = s.size * lifeFrac * 1.2;
        ctx.lineCap     = 'round';
        ctx.stroke();
      }
    }

    // ── Glow bloom — soft radial halo ──────────────────────────
    if (s.type === 0) {
      // Glow via larger transparent circle instead of shadowBlur
    } else if (s.type === 1) {
      // No shadowBlur for ember sparks
    } else {
      // No shadowBlur for micro sparks
    }

    // ── Main spark body ─────────────────────────────────────────
    const radius = s.size * lifeFrac;

    if (s.type === 0) {
      // Orange-yellow body
      const r = 255;
      const g = Math.round(160 + s.brightness * 80);
      const b = Math.round(20  + s.brightness * 60);
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(0.1, radius), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${lifeFrac * 0.95})`;
      ctx.fill();

      // Hot white core — visible while spark is fresh (lifeFrac > 0.4)
      if (lifeFrac > 0.35) {
        const coreAlpha = (lifeFrac - 0.35) / 0.65;
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0.1, radius * 0.40), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 230, ${coreAlpha})`;
        ctx.fill();
      }
    } else if (s.type === 1) {
      // Ember: copper-orange, no white core
      const r = 255;
      const g = Math.round(100 + s.brightness * 60);
      const b = Math.round(10  + s.brightness * 30);
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(0.1, radius), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${lifeFrac * 0.88})`;
      ctx.fill();
    } else {
      // Micro: yellow-white flash
      const alpha = lifeFrac * 0.85;
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(0.1, radius), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 245, 160, ${alpha})`;
      ctx.fill();

      // Tiny white center
      if (lifeFrac > 0.5) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0.05, radius * 0.35), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(lifeFrac - 0.5) * 1.8})`;
        ctx.fill();
      }
    }

    ctx.restore();
  }
}

// ============================================================
// MAIN SCENE — pivot-rotation hammer animation.
//
// stateRef.current.offset is the only value that changes.
// Geometry (including impactAngle) is computed fresh each frame
// so it always fits the current canvas size regardless of resize.
// ============================================================
function drawScene(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  offset: number,
  time: number,
  sparks: Spark[],
  intensity: number, // 1.0 = full (first strike), 0.5 = lighter (second strike)
  yOffset: number = 0, // extra canvas space above the visible section (desktop headroom)
) {
  ctx.clearRect(0, 0, w, h);

  // ── Layout anchors ─────────────────────────────────────────────
  // yOffset shifts everything down so the anvil stays visually in the same
  // position while the canvas extends above the section for hammer headroom.
  const anvilCX    = w * 0.62;
  const anvilTopY  = (h - yOffset) * 0.25 + yOffset;
  const anvilScale = 0.88;

  // Impact point: where the hammer face contacts the anvil
  const impactX = anvilCX - 20;
  const impactY = anvilTopY - 2;

  // Pivot: hand-grip at the RIGHT side, slightly ABOVE anvil face.
  // Handle extends LEFT from here to the hammer head near the anvil.
  // Raised ~35px so the arc brings the head down onto the TOP face.
  const pivotX = w * 0.92;
  const pivotY = anvilTopY - 55;

  // Compute impact angle fresh from current canvas dimensions
  const dx = impactX - pivotX;
  const dy = impactY - pivotY;
  const impactAngle = Math.atan2(dy, dx);

  // Handle length: distance from pivot to impact point, corrected so
  // the striking FACE (at handleLength + headLen/2) lands on impactX/Y.
  // drawHammer centers the head at handleLength; the face is headLen/2
  // beyond that. Subtract headLen/2 so the face aligns with the impact point.
  const headLen = 56; // must match drawHammer's headLen
  const handleLength = Math.sqrt(dx * dx + dy * dy) - headLen / 2;

  // Current angle = impactAngle + offset (offset tweened by GSAP)
  const angle = impactAngle + offset;

  // ── Glow intensity — brightest when offset ≈ 0 (at impact) ────
  const angleDiff      = Math.abs(offset - 0.06);  // 0.06 is the impact offset
  const glowIntensity  = Math.max(0, 1 - angleDiff / 0.07) * intensity;

  // ── Ambient screen glow during strike ─────────────────────────
  if (glowIntensity > 0) {
    const ambR    = w * 0.40 * glowIntensity;
    const ambient = ctx.createRadialGradient(impactX, impactY, 0, impactX, impactY, ambR);
    ambient.addColorStop(0,   `rgba(255, 120, 20, ${0.14 * glowIntensity})`);
    ambient.addColorStop(0.5, `rgba(200,  60,  5, ${0.07 * glowIntensity})`);
    ambient.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = ambient;
    ctx.fillRect(0, 0, w, h);
  }

  // ── Draw: anvil ────────────────────────────────────────────────
  drawAnvil(ctx, anvilCX, anvilTopY, anvilScale, 1);

  // ── Draw: strike glow on anvil face ───────────────────────────
  drawStrikeGlow(ctx, impactX, impactY + 4, glowIntensity);

  // ── Spawn sparks at strike moment ─────────────────────────────
  // Helper: weight angle toward upward (70% upward, 20% sideways, 10% down)
  const spawnAngle = () => {
    const roll = Math.random();
    if (roll < 0.70) {
      // Upward arc: -PI to 0 (full semicircle upward), biased toward -PI/2
      return -(Math.random() * Math.PI);
    } else if (roll < 0.90) {
      // Sideways: near-horizontal left or right
      const side = Math.random() < 0.5 ? -1 : 1;
      return side * (Math.PI * 0.35 + Math.random() * Math.PI * 0.25);
    } else {
      // Downward — a few sparks fall toward the anvil body
      return Math.PI * 0.1 + Math.random() * Math.PI * 0.8;
    }
  };

  if (angleDiff < 0.12 && sparks.length < 40) {
    // ── Type 0: Large bright sparks — scaled by strike intensity ──
    const largeCount = Math.round((5 + Math.floor(Math.random() * 4)) * intensity);
    for (let i = 0; i < largeCount; i++) {
      const a     = spawnAngle();
      const speed = 4.5 + Math.random() * 6.5;
      const maxL  = 0.7 + Math.random() * 0.5;
      sparks.push({
        x:          impactX + (Math.random() - 0.5) * 10,
        y:          impactY - 2,
        vx:         Math.cos(a) * speed,
        vy:         Math.sin(a) * speed - 1.5,
        life:       maxL,
        maxLife:    maxL,
        size:       2.0 + Math.random() * 2.0,
        brightness: 0.65 + Math.random() * 0.35,
        type:       0,
        trail:      6 + Math.random() * 8,
      });
    }

    // ── Type 1: Ember particles — scaled by strike intensity ─────
    const emberCount = Math.round((15 + Math.floor(Math.random() * 6)) * intensity);
    for (let i = 0; i < emberCount; i++) {
      const a     = spawnAngle();
      const speed = 1.2 + Math.random() * 3.0;
      const maxL  = 0.9 + Math.random() * 0.7;
      sparks.push({
        x:          impactX + (Math.random() - 0.5) * 16,
        y:          impactY - 1,
        vx:         Math.cos(a) * speed,
        vy:         Math.sin(a) * speed - 0.8,
        life:       maxL,
        maxLife:    maxL,
        size:       0.5 + Math.random() * 1.0,
        brightness: 0.4 + Math.random() * 0.5,
        type:       1,
        trail:      3 + Math.random() * 4,
      });
    }

    // ── Type 2: Micro sparks — scaled by strike intensity ────────
    const microCount = Math.round((10 + Math.floor(Math.random() * 6)) * intensity);
    for (let i = 0; i < microCount; i++) {
      const a     = spawnAngle();
      const speed = 5.5 + Math.random() * 8.0;
      const maxL  = 0.25 + Math.random() * 0.20;
      sparks.push({
        x:          impactX + (Math.random() - 0.5) * 8,
        y:          impactY - 2,
        vx:         Math.cos(a) * speed,
        vy:         Math.sin(a) * speed - 2.0,
        life:       maxL,
        maxLife:    maxL,
        size:       0.3 + Math.random() * 0.5,
        brightness: 0.8 + Math.random() * 0.2,
        type:       2,
        trail:      3 + Math.random() * 5,
      });
    }
  }

  // Continuous trickle of embers while glow is visible
  if (glowIntensity > 0.18 && time % 6 === 0 && sparks.length < 50) {
    const a     = spawnAngle();
    const speed = 1.0 + Math.random() * 2.2;
    const maxL  = 0.5 + Math.random() * 0.4;
    sparks.push({
      x:          impactX + (Math.random() - 0.5) * 22,
      y:          impactY - 3,
      vx:         Math.cos(a) * speed,
      vy:         Math.sin(a) * speed - 0.5,
      life:       maxL,
      maxLife:    maxL,
      size:       0.6 + Math.random() * 1.2,
      brightness: 0.45 + Math.random() * 0.4,
      type:       1,
      trail:      3 + Math.random() * 3,
    });
  }

  // ── Draw: sparks (after anvil, before hammer) ─────────────────
  drawSparks(ctx, sparks);

  // ── Draw: hammer using pivot rotation ─────────────────────────
  // Translate to pivot, rotate by current angle, then draw in local space.
  // At impactAngle, the head end (at local X = handleLength) sits exactly
  // at world position (impactX, impactY).
  ctx.save();
  ctx.translate(pivotX, pivotY);
  ctx.rotate(angle);
  drawHammer(ctx, handleLength, 1);
  ctx.restore();
}

// ============================================================
// COMPONENT
// ============================================================
export function IronAnvilSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  // offset: angle offset from impact (negative = raised, 0 = striking)
  const stateRef   = useRef({ offset: 0.9, time: 0, sparks: [] as Spark[], sparked: false });
  const rafRef     = useRef(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
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

    // Pause canvas rendering when section is not visible
    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { rootMargin: '100px' }
    );
    observer.observe(section);

    // Desktop: canvas extends 200px above section; pass yOffset so
    // drawScene positions the anvil correctly within the visible area.
    const isDesktop = () => window.innerWidth >= 1024;

    const render = () => {
      if (visibleRef.current) {
        const s  = stateRef.current;
        const cw = canvas.width  / Math.min(window.devicePixelRatio, 2);
        const ch = canvas.height / Math.min(window.devicePixelRatio, 2);
        s.time += 1;
        drawScene(ctx, cw, ch, s.offset, s.time, s.sparks, 1.0, isDesktop() ? 250 : 0);
      }
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  useGSAP((gsap, ScrollTrigger) => {
    if (!sectionRef.current || !textRef.current) return;

    // ── Hammer animation: tween an offset from the impact angle ───
    // drawScene computes impactAngle fresh each frame from current
    // canvas dimensions, so the animation stays correct after resize.
    // We only tween a fixed offset value (negative = raised, 0 = striking).
    const anim = { offset: 0.9 };

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.15, paused: true });

    // Swing down
    tl.to(anim, {
      offset: 0.06,
      duration: 0.4,
      ease: 'power2.in',
      onUpdate: () => { stateRef.current.offset = anim.offset; },
    });

    // Back all the way up
    tl.to(anim, {
      offset: 0.9,
      duration: 0.45,
      ease: 'power2.out',
      onUpdate: () => { stateRef.current.offset = anim.offset; },
    });

    // ── ScrollTrigger: pin section, play/pause animation ───────────
    // Just play immediately — no pinning, no scroll gating
    tl.play();

    // ── Text animation: scroll-triggered fade-in (separate ScrollTrigger) ─
    const textElements = textRef.current.querySelectorAll('.why-text-item');
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start:   'top 80%',
        end:     'top 20%',
        toggleActions: 'play none none reverse',
      },
    });

    textElements.forEach((el, i) => {
      textTl.fromTo(el,
        { opacity: 0, x: -25 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' },
        i * 0.12,
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative lg:z-10 min-h-[70vh] lg:min-h-screen bg-[var(--bg-primary)] will-change-transform"
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
        {/* Canvas container.
            Mobile: -top-[25%] keeps the hammer animation in view.
            lg+: -top-[250px] extends canvas above section so the hammer
            swing isn't clipped. drawScene receives yOffset=250 to keep
            the anvil visually in the same position.
        */}
        <div className="absolute right-0 -top-[25%] lg:-top-[250px] bottom-0 w-[70%] lg:w-[58%] pointer-events-none opacity-30 lg:opacity-100 will-change-transform">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}
