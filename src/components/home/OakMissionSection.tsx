'use client';

import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';

// Each root is a thick filled shape — organic twisted ribbon
// Darker shades behind (drawn first), lighter in front (drawn last)
function TwistedRoots({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 500" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* === BACK LAYER — darkest roots === */}

      {/* Root 1: thick bottom root, dark */}
      <path
        d="M 920 320 C 850 330, 780 310, 720 325 C 660 340, 610 360, 540 345
           C 470 330, 420 355, 350 340 C 280 325, 220 350, 150 335
           C 100 325, 40 340, -20 330
           L -20 350 C 40 360, 100 348, 150 358
           C 220 373, 280 348, 350 363 C 420 378, 470 353, 540 368
           C 610 383, 660 363, 720 348 C 780 333, 850 353, 920 343 Z"
        fill="#3D2B1A"
        opacity="0.85"
      />

      {/* Root 2: upper back root */}
      <path
        d="M 920 180 C 860 170, 800 190, 740 175 C 680 160, 630 185, 570 170
           C 510 155, 460 178, 400 165 C 340 152, 290 170, 230 160
           C 180 152, 120 165, 60 155 L 10 150
           L 10 170 C 70 178, 130 168, 180 175
           C 240 185, 300 167, 360 180 C 420 193, 470 170, 530 183
           C 590 196, 640 175, 700 188 C 760 201, 820 183, 920 195 Z"
        fill="#2E1F10"
        opacity="0.7"
      />

      {/* === MIDDLE LAYER — medium roots === */}

      {/* Root 3: main central thick root — the dominant one */}
      <path
        d="M 930 240 C 870 235, 810 255, 750 240 C 700 228, 650 260, 590 245
           C 530 230, 480 258, 420 242 C 360 226, 310 255, 250 238
           C 190 221, 140 248, 80 232 C 40 222, -10 238, -40 230
           L -40 265 C -10 272, 40 258, 80 268
           C 140 284, 190 257, 250 274 C 310 291, 360 262, 420 278
           C 480 294, 530 266, 590 282 C 650 298, 700 268, 750 278
           C 810 292, 870 272, 930 278 Z"
        fill="#4A3322"
        opacity="0.9"
      />

      {/* Root 4: twisting over root 3 */}
      <path
        d="M 920 260 C 880 248, 840 272, 790 255 C 740 238, 700 268, 650 252
           C 600 236, 560 262, 510 248 C 460 234, 420 260, 370 245
           C 320 230, 280 258, 230 242 C 180 226, 140 250, 90 238
           L 50 228
           L 50 248 C 100 258, 140 270, 190 256
           C 240 242, 280 278, 330 265 C 380 252, 420 280, 470 268
           C 520 256, 560 282, 610 272 C 660 262, 700 288, 750 275
           C 800 262, 840 292, 920 282 Z"
        fill="#5C3D28"
        opacity="0.85"
      />

      {/* Root 5: thin twisting tendril weaving through */}
      <path
        d="M 920 225 C 875 218, 830 240, 780 228 C 730 216, 690 242, 640 230
           C 590 218, 550 238, 500 226 C 450 214, 410 236, 360 224
           C 310 212, 270 232, 220 222 C 170 212, 130 228, 80 220
           L 80 234 C 130 242, 170 228, 220 238
           C 270 248, 310 228, 360 240 C 410 252, 450 230, 500 242
           C 550 254, 590 234, 640 246 C 690 258, 730 232, 780 244
           C 830 256, 875 234, 920 241 Z"
        fill="#6B4832"
        opacity="0.8"
      />

      {/* === FRONT LAYER — lightest, on top === */}

      {/* Root 6: prominent front root crossing over everything */}
      <path
        d="M 925 275 C 880 265, 835 290, 785 272 C 735 254, 695 285, 645 268
           C 595 251, 555 278, 505 262 C 455 246, 415 275, 365 258
           C 315 241, 280 268, 230 252 C 180 236, 145 260, 100 248
           L 60 240
           L 60 258 C 105 268, 145 280, 195 266
           C 245 252, 280 288, 330 278 C 380 268, 415 295, 465 282
           C 515 269, 555 298, 605 288 C 655 278, 695 305, 745 292
           C 795 279, 835 310, 925 298 Z"
        fill="#7A5438"
        opacity="0.95"
      />

      {/* Root 7: small tendril on top, lightest */}
      <path
        d="M 920 295 C 870 288, 820 302, 770 292 C 720 282, 670 298, 620 290
           C 570 282, 520 296, 470 288 C 420 280, 370 294, 320 286
           C 270 278, 220 290, 170 284 L 120 278
           L 120 290 C 170 296, 220 302, 270 294
           C 320 302, 370 308, 420 298 C 470 304, 520 310, 570 300
           C 620 306, 670 312, 720 302 C 770 308, 820 316, 920 310 Z"
        fill="#8B6340"
        opacity="0.75"
      />

      {/* === BARK TEXTURE LINES — thin strokes along root bodies === */}
      <g stroke="#2A1A0D" strokeWidth="0.5" opacity="0.3">
        {/* Along main root */}
        <path d="M 920 252 C 810 262, 650 248, 500 255 C 350 262, 200 248, 50 255" fill="none" />
        <path d="M 920 260 C 800 268, 640 256, 480 263 C 320 270, 160 258, -20 265" fill="none" />
        {/* Along front root */}
        <path d="M 920 282 C 790 276, 640 285, 480 272 C 320 266, 180 278, 60 248" fill="none" />
        {/* Along upper root */}
        <path d="M 920 188 C 780 180, 620 192, 460 182 C 300 172, 150 184, 10 162" fill="none" />
      </g>

      {/* === HIGHLIGHTS — very subtle light edges === */}
      <g stroke="#9B7B58" strokeWidth="0.8" opacity="0.15" fill="none">
        <path d="M 920 240 C 810 235, 700 250, 580 242 C 460 234, 340 248, 220 238 C 120 230, 40 240, -20 234" />
        <path d="M 920 270 C 820 264, 720 278, 600 268 C 480 258, 360 272, 240 262" />
      </g>
    </svg>
  );
}

export function OakMissionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rootsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP((gsap, ScrollTrigger) => {
    if (!sectionRef.current || !rootsRef.current || !textRef.current) return;

    const textElements = textRef.current.querySelectorAll('.mission-text-item');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 0.8,
      },
    });

    // 0.0–0.3: Roots slide in from right
    tl.fromTo(rootsRef.current,
      { xPercent: 100, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 0.25, ease: 'power3.out' },
      0
    );

    // 0.1–0.45: Text fades in alongside roots finishing
    textElements.forEach((el, i) => {
      tl.fromTo(el,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.1, ease: 'power3.out' },
        0.1 + i * 0.07
      );
    });

    // 0.7–0.95: Everything exits — roots slide back out right, text fades
    tl.to(textRef.current,
      { opacity: 0, x: -30, duration: 0.12, ease: 'power2.in' },
      0.72
    );
    tl.to(rootsRef.current,
      { xPercent: 100, opacity: 0, duration: 0.2, ease: 'power3.in' },
      0.75
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center">
        {/* Text — left side */}
        <div ref={textRef} className="w-full lg:w-1/2 px-6 lg:pl-12 xl:pl-20 relative z-10">
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

        {/* Roots — right side, slides in from off-screen */}
        <div
          ref={rootsRef}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[70%] lg:w-[55%] pointer-events-none opacity-0"
        >
          <TwistedRoots className="w-full h-auto" />
        </div>
      </div>
    </section>
  );
}
