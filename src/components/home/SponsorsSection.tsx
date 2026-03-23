'use client';

import Image from 'next/image';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { cn } from '@/lib/utils';

export function SponsorsSection() {
  return (
    <section className="section-padding bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-8 md:px-12 lg:px-16">
        <ScrollReveal className="text-center mb-12">
          <span className="font-[family-name:var(--font-accent)] text-sm tracking-[0.2em] uppercase text-[var(--accent-iron-light)]">
            Sponsored By
          </span>
        </ScrollReveal>

        {/* Intertech — logo image, big and centered */}
        <ScrollReveal delay={0.1} className="flex justify-center mb-16">
          <Image
            src="/images/intertech-logo.png"
            alt="Intertech — Wichita, Kansas"
            width={500}
            height={200}
            className="w-[300px] md:w-[400px] lg:w-[500px] h-auto"
          />
        </ScrollReveal>

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
