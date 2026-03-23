'use client';

import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { cn } from '@/lib/utils';

export function SponsorsSection() {
  return (
    <section className="section-padding bg-[var(--bg-secondary)]">
      <div className="container-default max-w-5xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <span className="font-[family-name:var(--font-accent)] text-sm tracking-[0.2em] uppercase text-[var(--accent-iron-light)]">
            Partners
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-[var(--text-h2)] text-[var(--text-primary)] mt-2">
            Partnered With Purpose
          </h2>
        </ScrollReveal>

        {/* Sponsor grid — 4 placeholder slots */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  'aspect-[3/2] rounded-[var(--radius-lg)] border border-dashed',
                  'border-[var(--border-default)] bg-[var(--bg-tertiary)]',
                  'flex items-center justify-center',
                  'transition-all duration-300',
                  'hover:border-[var(--accent-oak)]/30 hover:bg-[var(--bg-accent-surface)]'
                )}
              >
                <div className="text-center px-4">
                  {/* Subtle placeholder icon */}
                  <svg className="w-8 h-8 mx-auto mb-2 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="text-xs text-[var(--text-tertiary)] font-[family-name:var(--font-accent)] tracking-wider">
                    Partner Slot
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.2} className="text-center">
          <p className="text-[var(--text-secondary)] mb-4">
            Interested in partnering with Iron &amp; Oak?
          </p>
          <a
            href="mailto:hello@ironandoak.fm"
            className={cn(
              'inline-flex items-center justify-center h-11 px-6 text-sm font-medium',
              'rounded-full border border-[var(--accent-iron)] text-[var(--accent-iron-light)]',
              'hover:bg-[var(--accent-iron)]/10 transition-all duration-300'
            )}
          >
            Get in Touch
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
