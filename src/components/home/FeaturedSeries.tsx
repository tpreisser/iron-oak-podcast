'use client';

import { useState, useRef, useEffect } from 'react';
import { series } from '@/data/series';
import { episodes } from '@/data/episodes';
import { cn } from '@/lib/utils';

export function FeaturedSeries() {
  const [activePhase, setActivePhase] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const phase = series.phases[activePhase];
  const phaseEpisodes = episodes.filter(ep => ep.phaseNumber === phase.number);

  return (
    <section
      ref={sectionRef}
      id="featured-series"
      className="section-padding bg-[var(--bg-primary)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Header */}
        <div
          className="text-center mb-14 transition-all duration-1000"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
        >
          <span className="font-[family-name:var(--font-accent)] text-sm tracking-[0.2em] uppercase text-[var(--accent-oak)]">
            Season One
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-[var(--text-h1)] text-[var(--text-primary)] mt-3 mb-3">
            {series.title}
          </h2>
          <p className="font-[family-name:var(--font-body)] text-white/70 max-w-2xl mx-auto text-lg">
            Five phases. Twelve episodes. The whole story of the Christian faith.
          </p>
        </div>

        <div
          className="transition-all duration-1000 delay-300"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
        >
          {/* Phase selector bar */}
          <div className="relative mb-10">
            {/* Connecting line — aligns with dot center.
                Mobile dots are w-8 h-8 (32px) → center at 16px = top-4 (plus 4px button padding = top-5).
                md+ dots are w-11 h-11 (44px) → center at 22px = top-[22px] plus padding = top-[26px].
                Using top-5 for both is close enough given the button padding offsets. */}
            <div className="absolute top-5 left-0 right-0 h-[2px] bg-[var(--border-default)]" />
            {/* Filled portion up to active dot */}
            <div
              className="absolute top-5 left-0 h-[2px] bg-[var(--accent-oak)] transition-all duration-500"
              style={{ width: `${(activePhase / (series.phases.length - 1)) * 100}%` }}
            />

            {/* On mobile, 5 dots at 44px each = 220px + gaps — too wide for 320px screens.
                Shrink dots to w-8 h-8 (32px) on mobile but keep the touch target large via
                generous padding on the button itself. md+ restores full w-11 h-11 (44px). */}
            <div className="relative flex justify-between">
              {series.phases.map((p, i) => (
                <button
                  key={p.slug}
                  onClick={() => setActivePhase(i)}
                  className="flex flex-col items-center group px-1 py-1 min-h-[44px]"
                  aria-label={`Phase ${p.number}: ${p.name}`}
                  aria-pressed={i === activePhase}
                >
                  <div
                    className={cn(
                      'w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center text-xs md:text-sm font-bold',
                      'font-[family-name:var(--font-accent)] transition-all duration-300',
                      'border-2 z-10 relative',
                      i <= activePhase
                        ? 'bg-[var(--accent-oak)] border-[var(--accent-oak)] text-white'
                        : 'bg-[var(--bg-primary)] border-[var(--accent-iron)]/30 text-[var(--accent-iron)]'
                    )}
                    style={{
                      transform: i === activePhase ? 'scale(1.2)' : 'scale(1)',
                    }}
                  >
                    {p.number}
                  </div>
                  <span
                    className={cn(
                      'mt-2 text-xs font-medium transition-colors duration-300 text-center',
                      'font-[family-name:var(--font-accent)]',
                      i === activePhase ? 'text-white' : 'text-[var(--accent-iron)]'
                    )}
                  >
                    {/* Mobile: show abbreviated "P1"–"P5"; md+: show full phase name */}
                    <span className="hidden md:inline">{p.name}</span>
                    <span className="md:hidden">P{p.number}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Detail card */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden relative">
            {/* Large watermark phase number */}
            <span
              aria-hidden="true"
              className="absolute top-4 right-6 font-[family-name:var(--font-accent)] text-[8rem] md:text-[10rem] font-bold leading-none select-none pointer-events-none"
              style={{ color: 'var(--accent-oak)', opacity: 0.25 }}
            >
              {String(phase.number).padStart(2, '0')}
            </span>

            {/* p-4 on tiny phones (320px), stepping up through breakpoints */}
            <div className="p-4 sm:p-8 md:p-10 lg:p-12 relative">
              <div className="flex flex-col gap-6">
                {/* Phase label */}
                <span className="font-[family-name:var(--font-accent)] text-xs tracking-[0.2em] uppercase text-[var(--accent-oak)] block">
                  Phase {phase.number}
                </span>

                {/* Phase title */}
                <h3 className="font-[family-name:var(--font-display)] text-[var(--text-h2)] text-white -mt-4">
                  {phase.name}
                </h3>

                {/* Description */}
                <p className="font-[family-name:var(--font-body)] text-white/70 leading-relaxed">
                  {phase.description}
                </p>

                {/* Episode list */}
                <div>
                  {/* Episode count label */}
                  <span className="font-[family-name:var(--font-accent)] text-xs tracking-[0.15em] uppercase text-[var(--accent-oak)] mb-3 block">
                    {phaseEpisodes.length} Episode{phaseEpisodes.length !== 1 ? 's' : ''}
                  </span>

                  <div className="divide-y divide-[var(--border-default)]">
                    {phaseEpisodes.map(ep => (
                      <div
                        key={ep.slug}
                        className="flex items-baseline gap-3 py-3 first:border-t border-[var(--border-default)]"
                      >
                        <span className="font-[family-name:var(--font-accent)] text-xs text-[var(--accent-oak)] flex-shrink-0">
                          EP {String(ep.number).padStart(2, '0')}
                        </span>
                        <span className="font-[family-name:var(--font-body)] text-white">
                          {ep.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-white/50">
            <span className="font-[family-name:var(--font-accent)] tracking-wider">12 episodes</span>
            <span className="w-1 h-1 rounded-full bg-[var(--accent-oak)]" />
            <span className="font-[family-name:var(--font-accent)] tracking-wider">One story</span>
          </div>
        </div>
      </div>
    </section>
  );
}
