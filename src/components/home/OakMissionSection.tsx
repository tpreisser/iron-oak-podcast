'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useGSAP } from '@/hooks/useGSAP';

interface Segment {
  x1: number; y1: number;
  x2: number; y2: number;
  thickness: number;
  depth: number;
  birthProgress: number; // 0-1: when this segment appears during scroll
  color: string;
  grainOffset: number;
}

// Seeded random for consistent roots across renders
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateRoots(width: number, height: number): Segment[] {
  const segments: Segment[] = [];
  const rand = seededRandom(42);
  const centerY = height * 0.5;

  function growBranch(
    x: number, y: number,
    angle: number, thickness: number,
    depth: number, progress: number,
    maxDepth: number
  ) {
    if (thickness < 2.5 || depth > maxDepth || x < width * 0.2) return;

    const segLen = 22 + rand() * 30;
    const curve = (rand() - 0.5) * 0.18; // gentler curves
    const newAngle = angle + curve;
    const x2 = x + Math.cos(newAngle) * segLen;
    const y2 = y + Math.sin(newAngle) * segLen;

    segments.push({
      x1: x, y1: y, x2, y2,
      thickness,
      depth,
      birthProgress: Math.min(progress, 0.95),
      color: depth === 0 ? '#4A3322' : depth === 1 ? '#5C3D28' : depth <= 3 ? '#6B4832' : '#7A5438',
      grainOffset: rand() * 10,
    });

    const newThickness = thickness * (0.96 - rand() * 0.03);
    const newProgress = progress + 0.008 + rand() * 0.006;

    growBranch(x2, y2, newAngle, newThickness, depth, newProgress, maxDepth);

    const branchChance = depth === 0 ? 0.10 : depth === 1 ? 0.08 : 0.06;
    if (rand() < branchChance && thickness > 4) {
      const branchAngle = newAngle + (rand() > 0.5 ? 1 : -1) * (0.5 + rand() * 0.7);
      const branchThickness = thickness * (0.4 + rand() * 0.25);
      growBranch(x2, y2, branchAngle, branchThickness, depth + 1, newProgress + 0.02, maxDepth);
    }
  }

  // 4 main root trunks — slightly thicker than the version you liked
  const startPoints = [
    { y: centerY - height * 0.15, angle: Math.PI + 0.12, thickness: 38 },
    { y: centerY - height * 0.05, angle: Math.PI - 0.06, thickness: 44 },
    { y: centerY + height * 0.05, angle: Math.PI + 0.08, thickness: 40 },
    { y: centerY + height * 0.15, angle: Math.PI - 0.10, thickness: 36 },
  ];

  startPoints.forEach((sp, i) => {
    growBranch(width + 10, sp.y, sp.angle, sp.thickness, 0, i * 0.02, 5);
  });

  return segments;
}

function drawRoots(
  ctx: CanvasRenderingContext2D,
  segments: Segment[],
  progress: number, // 0-1 scroll progress
  width: number,
  height: number,
) {
  ctx.clearRect(0, 0, width, height);

  // Draw segments that have been "born" by current progress
  // Sort by depth so deeper (thicker) roots draw first
  const visible = segments
    .filter(s => s.birthProgress <= progress)
    .sort((a, b) => a.depth - b.depth);

  for (const seg of visible) {
    // How "grown" is this segment (0 = just appeared, 1 = fully grown)
    const segAge = Math.min(1, (progress - seg.birthProgress) / 0.05);
    if (segAge <= 0) continue;

    // Interpolate endpoint for growing effect
    const ex = seg.x1 + (seg.x2 - seg.x1) * segAge;
    const ey = seg.y1 + (seg.y2 - seg.y1) * segAge;

    // Main root stroke — quadratic curve for smoothness
    const cpx = (seg.x1 + ex) / 2 + (seg.y2 - seg.y1) * 0.15;
    const cpy = (seg.y1 + ey) / 2 + (seg.x1 - seg.x2) * 0.15;
    ctx.beginPath();
    ctx.moveTo(seg.x1, seg.y1);
    ctx.quadraticCurveTo(cpx, cpy, ex, ey);
    ctx.strokeStyle = seg.color;
    ctx.lineWidth = seg.thickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.9;
    ctx.stroke();

    // Wood grain — thin lighter lines along the root
    if (seg.thickness > 4 && segAge > 0.3) {
      const grainAlpha = Math.min(0.25, segAge * 0.3);
      const dx = ey - seg.y1;
      const dy = -(ex - seg.x1);
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = dx / len;
      const ny = dy / len;

      // 2-3 grain lines per thick root
      const grainCount = seg.thickness > 12 ? 3 : seg.thickness > 6 ? 2 : 1;
      for (let g = 0; g < grainCount; g++) {
        const offset = (g - (grainCount - 1) / 2) * (seg.thickness * 0.25);
        ctx.beginPath();
        ctx.moveTo(seg.x1 + nx * offset, seg.y1 + ny * offset);
        ctx.lineTo(ex + nx * offset, ey + ny * offset);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = grainAlpha * 0.5;
        ctx.stroke();
      }

      // Dark grain line (crack/crevice)
      if (seg.thickness > 10) {
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = grainAlpha * 0.4;
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
  }
}

export function OakMissionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const segmentsRef = useRef<Segment[]>([]);
  const progressRef = useRef(0);
  const rafRef = useRef(0);

  // Generate roots on mount
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // Regenerate roots for new dimensions
      segmentsRef.current = generateRoots(rect.width * dpr, rect.height * dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Render loop
    const render = () => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawRoots(ctx, segmentsRef.current, progressRef.current, canvas.width, canvas.height);
      }
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useGSAP((gsap, ScrollTrigger) => {
    if (!sectionRef.current || !textRef.current) return;

    const textElements = textRef.current.querySelectorAll('.mission-text-item');
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

    // 0.0–0.55: Roots grow (progress 0→1)
    tl.to(proxy, {
      progress: 1,
      duration: 0.55,
      ease: 'none',
      onUpdate: () => { progressRef.current = proxy.progress; },
    }, 0);

    // 0.08–0.40: Text fades in
    textElements.forEach((el, i) => {
      tl.fromTo(el,
        { opacity: 0, x: -25 },
        { opacity: 1, x: 0, duration: 0.10, ease: 'power3.out' },
        0.08 + i * 0.06
      );
    });

    // 0.65–0.85: Text fades, roots shrink back
    tl.to(textRef.current,
      { opacity: 0, x: -20, duration: 0.10, ease: 'power2.in' },
      0.62
    );
    tl.to(proxy, {
      progress: 0,
      duration: 0.20,
      ease: 'power2.in',
      onUpdate: () => { progressRef.current = proxy.progress; },
    }, 0.68);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center">
        {/* Text — left side */}
        <div ref={textRef} className="w-full lg:w-[45%] px-6 lg:pl-12 xl:pl-20 relative z-10">
          <span className="mission-text-item block font-[family-name:var(--font-accent)] text-sm tracking-[0.2em] uppercase text-[var(--accent-oak)] mb-4 opacity-0">
            Our Mission
          </span>
          <h2 className="mission-text-item font-[family-name:var(--font-display)] text-[var(--text-h1)] text-[var(--text-primary)] leading-tight mb-6 opacity-0">
            What&apos;s Our Mission?
          </h2>
          <p className="mission-text-item text-lg text-[var(--text-secondary)] leading-relaxed mb-4 max-w-lg opacity-0">
            To create a space where the hardest questions about faith aren&apos;t avoided — they&apos;re welcomed. Where Scripture is the foundation, not a prop. Where honesty matters more than polish.
          </p>
          <p className="mission-text-item text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg opacity-0">
            Iron &amp; Oak exists to sharpen believers and invite skeptics into the same conversation — one that doesn&apos;t flinch.
          </p>
        </div>

        {/* Roots — Canvas, right side, extends past viewport to avoid hard clip */}
        <div className="absolute -right-[15%] top-0 bottom-0 w-[80%] lg:w-[73%] pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}
