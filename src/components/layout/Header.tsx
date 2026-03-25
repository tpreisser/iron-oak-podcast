'use client';

import { useState, useEffect } from 'react';
import { assetPath } from "@/lib/basePath";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { NAV_SCROLL_THRESHOLD } from '@/lib/constants';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > NAV_SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'backdrop-blur-[12px] bg-[var(--bg-primary)]/80 border-b border-[var(--border-default)]'
          : 'bg-transparent'
      )}
    >
      <div className="container-default flex items-center justify-between h-16 lg:h-20">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Image
            src={assetPath("/images/iron-oak-icon.webp")}
            alt="Iron & Oak"
            width={120}
            height={120}
            className="w-10 h-10 lg:w-12 lg:h-12"
          />
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('subscribe');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={cn(
            'inline-flex items-center justify-center h-9 px-5 text-sm font-medium',
            'rounded-full bg-[var(--accent-oak)] text-white',
            'hover:bg-[var(--accent-oak-light)] transition-all duration-300',
            'hover:scale-[1.03] hover:shadow-[var(--shadow-glow)]',
            'active:scale-[0.97]'
          )}
        >
          Subscribe
        </button>
      </div>
    </header>
  );
}
