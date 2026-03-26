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

  ctx.shadowBlur  = 18;
  ctx.shadowColor = 'rgba(0,0,0,0.55)';

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
) {
  ctx.clearRect(0, 0, w, h);

  // ── Layout anchors ─────────────────────────────────────────────
  const anvilCX    = w * 0.62;
  const anvilTopY  = h * 0.50;
  const anvilScale = 0.88;

  // Impact point: where the hammer face contacts the anvil
  const impactX = anvilCX - 20;
  const impactY = anvilTopY - 2;

  // Pivot: hand-grip at the RIGHT side, slightly ABOVE anvil face.
  // Handle extends LEFT from here to the hammer head near the anvil.
  // Raised ~35px so the arc brings the head down onto the TOP face.
  const pivotX = w * 0.92;
  const pivotY = anvilTopY - 70;

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
  const glowIntensity  = Math.max(0, 1 - angleDiff / 0.07);

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
  if (angleDiff < 0.05 && time % 2 === 0) {
    const burstCount = 7;
    for (let i = 0; i < burstCount; i++) {
      const a     = (Math.random() * Math.PI * 1.6) - Math.PI * 1.3;
      const speed = 3.0 + Math.random() * 6.0;
      sparks.push({
        x:          impactX + (Math.random() - 0.5) * 14,
        y:          impactY - 2,
        vx:         Math.cos(a) * speed,
        vy:         Math.sin(a) * speed - 3.0,
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
  const stateRef   = useRef({ offset: 0.9, time: 0, sparks: [] as Spark[] });
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
      drawScene(ctx, cw, ch, s.offset, s.time, s.sparks);
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

    // ── Hammer animation: tween an offset from the impact angle ───
    // drawScene computes impactAngle fresh each frame from current
    // canvas dimensions, so the animation stays correct after resize.
    // We only tween a fixed offset value (negative = raised, 0 = striking).
    const anim = { offset: 0.9 };

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5, paused: true });

    // Swing down — stop at +0.06 so bottom edge of head touches face (not center through it)
    tl.to(anim, {
      offset: 0.06,
      duration: 0.4,
      ease: 'power2.in',
      onUpdate: () => { stateRef.current.offset = anim.offset; },
    });

    // Bounce back up
    tl.to(anim, {
      offset: 0.25,
      duration: 0.25,
      ease: 'power2.out',
      onUpdate: () => { stateRef.current.offset = anim.offset; },
    });

    // Strike again
    tl.to(anim, {
      offset: 0.06,
      duration: 0.35,
      ease: 'power2.in',
      onUpdate: () => { stateRef.current.offset = anim.offset; },
    });

    // Raise back up high
    tl.to(anim, {
      offset: 0.9,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => { stateRef.current.offset = anim.offset; },
    });

    // ── ScrollTrigger: pin section, play/pause animation ───────────
    ScrollTrigger.create({
      trigger:     sectionRef.current,
      start:       'top top',
      end:         '+=180%',
      pin:         true,
      onEnter:     () => tl.play(),
      onLeave:     () => tl.pause(),
      onEnterBack: () => tl.play(),
      onLeaveBack: () => tl.pause(),
    });

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
