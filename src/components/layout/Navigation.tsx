'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { mainNavItems } from '@/data/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MagneticElement } from '@/components/ui/MagneticElement';
import { MobileMenu } from './MobileMenu';
import { NAV_SCROLL_THRESHOLD } from '@/lib/constants';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > NAV_SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'backdrop-blur-[12px] bg-[var(--bg-primary)]/80 border-b border-[var(--border-default)]'
            : 'bg-transparent'
        )}
      >
        <div className="container-default flex items-center justify-between h-16 lg:h-20">
          {/* Logo: IRON in iron color, & in oak, OAK in oak */}
          <Link href="/" className="flex items-center gap-0 text-xl font-bold tracking-wider">
            <span className="text-[var(--accent-iron)]">IRON</span>
            <span className="text-[var(--accent-oak)] mx-1">&amp;</span>
            <span className="text-[var(--accent-oak)]">OAK</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {mainNavItems.map((item) => (
              <MagneticElement key={item.href} strength={0.2}>
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors duration-300',
                    pathname === item.href
                      ? 'text-[var(--accent-oak)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  )}
                >
                  {item.label}
                </Link>
              </MagneticElement>
            ))}
          </div>

          {/* Right side: theme toggle + subscribe CTA + hamburger */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/subscribe"
              className={cn(
                'hidden lg:inline-flex items-center justify-center h-9 px-5 text-sm font-medium',
                'rounded-full bg-[var(--accent-oak)] text-white',
                'hover:bg-[var(--accent-oak-light)] transition-all duration-300',
                'hover:scale-[1.03] hover:shadow-[var(--shadow-glow)]',
                'active:scale-[0.97]'
              )}
            >
              Subscribe
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5"
              aria-label="Toggle menu"
            >
              <span className={cn(
                'block w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300',
                mobileOpen && 'rotate-45 translate-y-2'
              )} />
              <span className={cn(
                'block w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300',
                mobileOpen && 'opacity-0'
              )} />
              <span className={cn(
                'block w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300',
                mobileOpen && '-rotate-45 -translate-y-2'
              )} />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
