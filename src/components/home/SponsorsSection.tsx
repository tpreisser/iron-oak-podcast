'use client';

import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function SponsorsSection() {
  return (
    <section className="section-padding bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <ScrollReveal className="text-center mb-12">
          <span className="font-[family-name:var(--font-accent)] text-sm tracking-[0.2em] uppercase text-[var(--accent-iron-light)]">
            Sponsored By
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="flex justify-center">
          <span className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-wide">
            Mark G. Allen
          </span>
        </ScrollReveal>
      </div>
    </section>
  );
}
