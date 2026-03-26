'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { assetPath } from "@/lib/basePath";
import { hosts } from '@/data/hosts';
import { cn } from '@/lib/utils';

const hostImages: Record<string, string> = {
  'Tyler Preisser': assetPath('/images/tyler-headshot.webp'),
  // Drop Lincoln's headshot at /public/images/lincoln-headshot.webp to activate
  // 'Lincoln Myers': '/images/lincoln-headshot.webp',
};

function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(25px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}
    >
      {children}
    </div>
  );
}

export function HostsSection() {
  return (
    <section id="hosts" className="section-padding bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <FadeIn className="text-center mb-16">
          <span className="font-[family-name:var(--font-accent)] text-sm tracking-[0.2em] uppercase text-[var(--accent-oak)]">
            Your Hosts
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-[var(--text-h1)] text-[var(--text-primary)] mt-2">
            Your Hosts
          </h2>
          <p className="font-[family-name:var(--font-body)] text-[var(--text-secondary)] mt-3 text-lg">
            Coming soon.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {hosts.map((host, i) => (
            <FadeIn key={host.name} delay={i * 200}>
              <div className="text-center">
                {/* Initials icon */}
                <div className="mb-6 flex justify-center">
                  <div
                    className={cn(
                      'w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-2xl font-bold font-[family-name:var(--font-display)]',
                      host.texture === 'iron'
                        ? 'bg-[var(--accent-iron)]/10 text-[var(--accent-iron)] border-2 border-[var(--accent-iron)]/30'
                        : 'bg-[var(--accent-oak)]/10 text-[var(--accent-oak)] border-2 border-[var(--accent-oak)]/30'
                    )}
                  >
                    {host.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                <h3
                  className={cn(
                    'font-[family-name:var(--font-display)] text-[var(--text-h2)] leading-tight mb-1',
                    host.texture === 'iron' ? 'text-[var(--accent-iron-light)]' : 'text-[var(--accent-oak-light)]'
                  )}
                >
                  {host.name}
                </h3>

                <p className="font-[family-name:var(--font-accent)] text-sm text-[var(--text-tertiary)] tracking-wider mb-4">
                  Bio coming soon.
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
