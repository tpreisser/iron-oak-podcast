'use client';

import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import Image from 'next/image';
import { assetPath } from "@/lib/basePath";
import { ButtonLink } from '@/components/ui/Button';
import { GradientBackground } from '@/components/effects/GradientBackground';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP((gsap) => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(section.querySelector('.hero-logo'), { opacity: 0, scale: 0.9, duration: 1 }, 0)
      .from(section.querySelector('.hero-text'), { opacity: 0, x: 30, duration: 1 }, 0.3)
      .from(section.querySelector('.hero-email'), { opacity: 0, y: 20, duration: 0.8 }, 1.0)
      .from(section.querySelector('.hero-scroll'), { opacity: 0, duration: 0.8 }, 1.2);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <GradientBackground className="z-0" />

      {/* px: 1rem on tiny phones, scaling up to 8rem on xl desktop */}
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
        {/* Two-column: text left, logo right — stacks on mobile */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16">
          {/* Text — left side */}
          <div className="hero-text text-center lg:text-left flex-1 w-full">
            <h1 className="font-[family-name:var(--font-display)] text-[var(--text-hero)] leading-[1.1] text-[var(--text-primary)] mb-4 md:mb-5">
              Where Iron Sharpens Iron and Deep Roots Hold
            </h1>

            <p className="text-[var(--text-secondary)] max-w-xl mb-6 md:mb-8 text-base md:text-xl mx-auto lg:mx-0">
              Two men from the Kansas plains digging into Scripture, doubt, and the questions that matter most.
            </p>

            {/* Email form: stacks vertically on mobile, side-by-side on sm+ */}
            <div className="hero-email max-w-md mt-2 mx-auto lg:mx-0">
              <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Be the first to hear new episodes"
                  className="flex-1 h-12 px-5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-oak)] transition-colors duration-300 text-sm"
                />
                {/* min-h-12 ensures 48px tap target on mobile */}
                <button
                  type="submit"
                  className="h-12 min-h-[48px] px-6 rounded-full bg-[var(--accent-oak)] text-white font-medium text-sm hover:bg-[var(--accent-oak-light)] transition-colors duration-300 active:scale-[0.97]"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Logo — right side; smaller on mobile to not crowd text */}
          <div className="hero-logo flex-shrink-0">
            <Image
              src={assetPath("/images/iron-oak-logo-new.webp")}
              alt="The Iron & Oak Podcast"
              width={400}
              height={400}
              className="w-[160px] sm:w-[220px] md:w-[300px] lg:w-[360px] h-auto"
              priority
            />
          </div>
        </div>
      </div>

      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-[var(--text-tertiary)] tracking-wider uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-[var(--border-default)] flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-[var(--accent-oak)] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
