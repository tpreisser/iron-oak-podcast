'use client';

import Image from 'next/image';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function SponsorsSection() {
  return (
    <section className="section-padding bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-8 md:px-12 lg:px-16">
        <ScrollReveal className="text-center mb-12">
          <span className="font-[family-name:var(--font-accent)] text-sm tracking-[0.2em] uppercase text-[var(--accent-iron-light)]">
            Sponsored By
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="flex justify-center">
          <Image
            src="/images/enertech-logo.svg"
            alt="Enertech — Wichita, Kansas"
            width={500}
            height={150}
            className="w-[280px] md:w-[380px] lg:w-[450px] h-auto"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
