'use client';

import { useRef, useEffect } from 'react';

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
    if (thickness < 1.5 || depth > maxDepth) return;

    // Shorter segments on thinner branches, longer on thick trunks
    const segLen = thickness > 30 ? (30 + rand() * 35) : (15 + rand() * 25);
    // Dramatic curves on trunks, tighter on thin branches
    const curveStrength = thickness > 30 ? 0.15 : 0.25;
    const curve = (rand() - 0.5) * curveStrength;
    const newAngle = angle + curve;
    const x2 = x + Math.cos(newAngle) * segLen;
    const y2 = y + Math.sin(newAngle) * segLen;

    segments.push({
      x1: x, y1: y, x2, y2,
      thickness,
      depth,
      birthProgress: Math.min(progress, 0.95),
      color: depth === 0 ? '#5C4530' : depth === 1 ? '#6B4832' : depth <= 3 ? '#7A5438' : '#8B6340',
      grainOffset: rand() * 10,
    });

    // Taper — faster on branches, slower on trunks
    const baseTaper = depth === 0 ? 0.96 : 0.92;
    const distFromRight = Math.max(0, (width - x) / width);
    const distPenalty = distFromRight * 0.06;
    const newThickness = thickness * (baseTaper - distPenalty - rand() * 0.03);
    const newProgress = progress + 0.006 + rand() * 0.004;

    // Continue main branch
    growBranch(x2, y2, newAngle, newThickness, depth, newProgress, maxDepth);

    // FREQUENT branching — this is what creates the tree-like structure
    // Thick trunks branch a lot, thin ones less
    const branchChance = thickness > 40 ? 0.25 : thickness > 20 ? 0.20 : thickness > 8 ? 0.15 : 0.08;
    if (rand() < branchChance && thickness > 3) {
      // Wide branch angles — go in all directions, not just horizontal
      const branchAngle = newAngle + (rand() > 0.5 ? 1 : -1) * (0.5 + rand() * 1.0);
      // Branches are significantly thinner than parent
      const branchThickness = thickness * (0.3 + rand() * 0.25);
      growBranch(x2, y2, branchAngle, branchThickness, depth + 1, newProgress + 0.015, maxDepth);
    }

    // Second branch possibility on very thick roots
    if (thickness > 35 && rand() < 0.08) {
      const branchAngle2 = newAngle + (rand() > 0.5 ? 1 : -1) * (0.6 + rand() * 0.8);
      const branchThickness2 = thickness * (0.25 + rand() * 0.2);
      growBranch(x2, y2, branchAngle2, branchThickness2, depth + 1, newProgress + 0.02, maxDepth);
    }
  }

  // 3 massive main trunks — like the reference image
  // They enter from the right at different angles, creating a radiating pattern
  const startPoints = [
    { y: centerY - height * 0.12, angle: Math.PI + 0.3, thickness: 80 },  // curves upward-left
    { y: centerY + height * 0.02, angle: Math.PI - 0.05, thickness: 90 }, // goes mostly straight left
    { y: centerY + height * 0.18, angle: Math.PI - 0.35, thickness: 75 }, // curves downward-left
  ];

  startPoints.forEach((sp, i) => {
    growBranch(width + 10, sp.y, sp.angle, sp.thickness, 0, i * 0.02, 6);
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
  const visibleRef = useRef(false);

  // Canvas setup: resize, generate roots, render loop, IntersectionObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

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

    // Pause canvas rendering when section is not visible (performance)
    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { rootMargin: '100px' }
    );
    observer.observe(section);

    // Render loop
    const render = () => {
      if (visibleRef.current) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawRoots(ctx, segmentsRef.current, progressRef.current, canvas.width, canvas.height);
        }
      }
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  // Scroll-driven: roots progress + text/canvas fade in AND fade out
  useEffect(() => {
    const section = sectionRef.current;
    const textEl = textRef.current;
    const canvasWrap = canvasRef.current?.parentElement?.parentElement;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // Start progress when section top is 40% from the bottom of viewport (enters early)
      const earlyStart = vh * 0.4;
      const scrollable = rect.height - vh + earlyStart;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, (earlyStart - rect.top) / scrollable));
      progressRef.current = progress;

      // Fade in during 0-10%, hold 10-70%, fade out 70-100%
      let opacity = 0;
      if (progress < 0.10) {
        opacity = progress / 0.10;
      } else if (progress < 0.70) {
        opacity = 1;
      } else {
        opacity = 1 - (progress - 0.70) / 0.30;
      }
      opacity = Math.max(0, Math.min(1, opacity));

      if (textEl) textEl.style.opacity = String(opacity);
      if (canvasWrap) (canvasWrap as HTMLElement).style.opacity = String(opacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--bg-primary)] overflow-hidden"
      /* Mobile: 140vh reduces the excess scroll distance between IronAnvilSection
         and OakMissionSection while keeping the roots animation fully visible.
         Tailwind min-h classes don't support non-integer vh units in v4 so inline style is correct here. */
      style={{ minHeight: '180vh' }}
    >
      {/* Canvas layer — absolutely fills the section, sticky so it stays in view while scrolling */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="sticky top-0 h-screen">
          {/* Roots Canvas — right side.
              Mobile: positioned further right (w-[90%] -right-[30%]) so roots are partially visible
              as a background element but don't dominate the readable text area.
              lg+: normal positioning w-[73%] -right-[15%].
          */}
          <div className="absolute -right-[30%] lg:-right-[15%] top-0 bottom-0 w-[90%] lg:w-[73%] opacity-40 lg:opacity-100">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Text layer — sticky so it stays in place while user scrolls through the section */}
      <div className="sticky top-0 h-screen flex items-center">
        {/* Text — left side
            On mobile: full-width with extra right padding so roots behind don't cover text.
            On lg+: 45% width, roots fill the right side.
        */}
        <div ref={textRef} className="w-full lg:w-[45%] px-6 pr-16 sm:pr-8 lg:pr-6 lg:pl-12 xl:pl-20 relative z-10">
          <span
            className="mission-text-item block font-[family-name:var(--font-accent)] text-sm tracking-[0.2em] uppercase text-[var(--accent-oak)] mb-4"
            style={{}}
          >
            Our Mission
          </span>
          <h2
            className="mission-text-item font-[family-name:var(--font-display)] text-[var(--text-h1)] text-[var(--text-primary)] leading-tight mb-6"
            style={{}}
          >
            What&apos;s Our Mission?
          </h2>
          {/* text-base on mobile (16px) — stays readable; text-lg on md+ */}
          <p
            className="mission-text-item text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-4 max-w-lg"
            style={{}}
          >
            To create a space where the hardest questions about faith aren&apos;t avoided — they&apos;re welcomed. Where Scripture is the foundation, not a prop. Where honesty matters more than polish.
          </p>
          <p
            className="mission-text-item text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg"
            style={{}}
          >
            Iron &amp; Oak exists to sharpen believers and invite skeptics into the same conversation — one that doesn&apos;t flinch.
          </p>
        </div>
      </div>
    </section>
  );
}
