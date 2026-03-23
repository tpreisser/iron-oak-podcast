'use client';

import { useEffect, useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { cn } from '@/lib/utils';

const navSections = [
  { label: 'About', id: 'concept' },
  { label: 'Series', id: 'featured-series' },
  { label: 'Hosts', id: 'hosts' },
  { label: 'Subscribe', id: 'subscribe' },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onScrollTo: (id: string) => void;
}

export function MobileMenu({ isOpen, onClose, onScrollTo }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClick = (id: string) => {
    onScrollTo(id);
    onClose();
  };

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
        {navSections.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className="mobile-menu-item font-[family-name:var(--font-display)] text-3xl text-[var(--text-primary)] hover:text-[var(--accent-oak)] transition-colors duration-300"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
