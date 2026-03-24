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

  const prev = () => setActivePhase(p => Math.max(0, p - 1));
  const next = () => setActivePhase(p => Math.min(series.phases.length - 1, p + 1));
  const phase = series.phases[activePhase];
  const phaseEpisodes = episodes.filter(ep => ep.phaseNumber === phase.number);

  return (
    <section
      ref={sectionRef}
      id="featured-series"
      className="section-padding bg-[var(--bg-primary)]"
    >
      <div className="max-w-6xl mx-auto px-8 md:px-12 lg:px-16">
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
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
            Five phases. Twelve episodes. The whole story of the Christian faith.
          </p>
        </div>

        <div
          className="transition-all duration-1000 delay-300"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
        >
          {/* Phase selector bar */}
          <div className="relative mb-10">
            <div className="absolute top-5 left-0 right-0 h-[2px] bg-[var(--border-default)]" />
            <div
              className="absolute top-5 left-0 h-[2px] bg-[var(--accent-oak)] transition-all duration-500"
              style={{ width: `${((activePhase + 1) / series.phases.length) * 100}%` }}
            />

            <div className="relative flex justify-between">
              {series.phases.map((p, i) => (
                <button
                  key={p.slug}
                  onClick={() => setActivePhase(i)}
                  className="flex flex-col items-center group"
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                      'font-[family-name:var(--font-accent)] transition-all duration-300',
                      'border-2 z-10 relative',
                      i <= activePhase
                        ? 'bg-[var(--accent-oak)] border-[var(--accent-oak)] text-white'
                        : 'bg-[var(--bg-primary)] border-[var(--border-default)] text-[var(--text-tertiary)]'
                    )}
                  >
                    {p.number}
                  </div>
                  <span
                    className={cn(
                      'mt-3 text-xs md:text-sm font-medium transition-colors duration-300 text-center',
                      i === activePhase ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
                    )}
                  >
                    <span className="hidden md:inline">{p.name}</span>
                    <span className="md:hidden">P{p.number}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Arrow navigation + detail card */}
          <div className="flex items-stretch gap-4">
            {/* Left arrow */}
            <button
              onClick={prev}
              disabled={activePhase === 0}
              className={cn(
                'flex-shrink-0 w-12 flex items-center justify-center rounded-[var(--radius-lg)] border transition-all duration-300',
                activePhase === 0
                  ? 'border-[var(--border-default)] text-[var(--text-tertiary)] opacity-30 cursor-not-allowed'
                  : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent-oak)] hover:text-[var(--accent-oak)]'
              )}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Detail card */}
            <div className="flex-1 rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden">
              <div className="p-8 md:p-10 lg:p-12">
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                  {/* Phase number */}
                  <span className="font-[family-name:var(--font-accent)] text-6xl md:text-7xl font-bold text-[var(--accent-oak)]/20 leading-none flex-shrink-0">
                    {String(phase.number).padStart(2, '0')}
                  </span>

                  <div className="flex-1">
                    <span className="font-[family-name:var(--font-accent)] text-xs tracking-[0.2em] uppercase text-[var(--accent-oak)] mb-2 block">
                      Phase {phase.number}
                    </span>
                    <h3 className="font-[family-name:var(--font-display)] text-[var(--text-h2)] text-[var(--text-primary)] mb-3">
                      {phase.name}
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                      {phase.description}
                    </p>

                    {/* Episode list */}
                    <div>
                      <span className="font-[family-name:var(--font-accent)] text-xs tracking-[0.15em] uppercase text-[var(--text-tertiary)] mb-3 block">
                        {phaseEpisodes.length} Episode{phaseEpisodes.length !== 1 ? 's' : ''}
                      </span>
                      <div className="space-y-2">
                        {phaseEpisodes.map(ep => (
                          <div
                            key={ep.slug}
                            className="flex items-baseline gap-3 py-2 border-b border-[var(--border-default)] last:border-0"
                          >
                            <span className="font-[family-name:var(--font-accent)] text-xs text-[var(--accent-oak)] flex-shrink-0">
                              EP {String(ep.number).padStart(2, '0')}
                            </span>
                            <span className="font-[family-name:var(--font-display)] text-[var(--text-primary)]">
                              {ep.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right arrow */}
            <button
              onClick={next}
              disabled={activePhase === series.phases.length - 1}
              className={cn(
                'flex-shrink-0 w-12 flex items-center justify-center rounded-[var(--radius-lg)] border transition-all duration-300',
                activePhase === series.phases.length - 1
                  ? 'border-[var(--border-default)] text-[var(--text-tertiary)] opacity-30 cursor-not-allowed'
                  : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent-oak)] hover:text-[var(--accent-oak)]'
              )}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-[var(--text-tertiary)]">
            <span className="font-[family-name:var(--font-accent)] tracking-wider">12 episodes</span>
            <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]" />
            <span className="font-[family-name:var(--font-accent)] tracking-wider">One story</span>
          </div>
        </div>
      </div>
    </section>
  );
}
