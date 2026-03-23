'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGSAP } from '@/hooks/useGSAP';
import { mainNavItems } from '@/data/navigation';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Stagger animation for menu items
  useGSAP((gsap) => {
    if (!menuRef.current) return;
    const items = menuRef.current.querySelectorAll('.mobile-menu-item');

    if (isOpen) {
      gsap.fromTo(items,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <div
      ref={menuRef}
      className={cn(
        'fixed inset-0 z-40 lg:hidden transition-all duration-500',
        'bg-[var(--bg-primary)] flex flex-col items-center justify-center',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
      style={{ top: '64px' }}
    >
      <div className="flex flex-col items-center gap-8">
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              'mobile-menu-item font-[family-name:var(--font-display)] text-3xl transition-colors duration-300',
              pathname === item.href
                ? 'text-[var(--accent-oak)]'
                : 'text-[var(--text-primary)] hover:text-[var(--accent-oak)]'
            )}
          >
            {item.label}
          </Link>
        ))}

        <Link
          href="/subscribe"
          onClick={onClose}
          className="mobile-menu-item mt-4 inline-flex items-center justify-center h-12 px-8 text-lg font-medium rounded-full bg-[var(--accent-oak)] text-white hover:bg-[var(--accent-oak-light)] transition-colors duration-300"
        >
          Subscribe
        </Link>
      </div>
    </div>
  );
}
