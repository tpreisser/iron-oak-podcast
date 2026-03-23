'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { NAV_SCROLL_THRESHOLD } from '@/lib/constants';

const navSections = [
  { label: 'About', id: 'concept' },
  { label: 'Series', id: 'featured-series' },
  { label: 'Hosts', id: 'hosts' },
  { label: 'Subscribe', id: 'subscribe' },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > NAV_SCROLL_THRESHOLD);

      // Determine active section
      const sections = navSections.map(s => ({
        id: s.id,
        el: document.getElementById(s.id),
      })).filter(s => s.el);

      let current = '';
      for (const section of sections) {
        if (section.el && section.el.getBoundingClientRect().top <= 150) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  }, []);

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
          {/* Logo — scrolls to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-0 text-xl font-bold tracking-wider"
          >
            <span className="text-[var(--accent-iron)]">IRON</span>
            <span className="text-[var(--accent-oak)] mx-1">&amp;</span>
            <span className="text-[var(--accent-oak)]">OAK</span>
          </button>

          {/* Desktop nav links — scroll to sections */}
          <div className="hidden lg:flex items-center gap-8">
            {navSections.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={cn(
                  'text-sm font-medium transition-colors duration-300',
                  activeSection === item.id
                    ? 'text-[var(--accent-oak)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={() => scrollTo('subscribe')}
              className={cn(
                'hidden lg:inline-flex items-center justify-center h-9 px-5 text-sm font-medium',
                'rounded-full bg-[var(--accent-oak)] text-white',
                'hover:bg-[var(--accent-oak-light)] transition-all duration-300',
                'hover:scale-[1.03] hover:shadow-[var(--shadow-glow)]',
                'active:scale-[0.97]'
              )}
            >
              Subscribe
            </button>

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

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} onScrollTo={scrollTo} />
    </>
  );
}
