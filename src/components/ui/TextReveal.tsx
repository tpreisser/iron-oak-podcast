'use client';

import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { ANIMATION, SCROLL_TRIGGER } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface TextRevealProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  delay?: number;
  splitBy?: 'words' | 'lines';
  stagger?: number;
}

export function TextReveal({
  children,
  as: Tag = 'h2',
  className,
  delay = 0,
  splitBy = 'words',
  stagger = ANIMATION.lineStagger,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    (gsap) => {
      if (!containerRef.current) return;

      const elements = containerRef.current.querySelectorAll('.text-reveal-item');
      if (!elements.length) return;

      gsap.from(elements, {
        opacity: 0,
        y: ANIMATION.textReveal.y,
        duration: ANIMATION.textReveal.duration,
        ease: ANIMATION.textReveal.ease,
        stagger,
        delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: SCROLL_TRIGGER.start,
        },
      });
    },
    [delay, stagger],
  );

  const items = splitBy === 'words' ? children.split(' ') : children.split('\n');

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={cn('overflow-hidden', className)}
    >
      {items.map((item, i) => (
        <span
          key={i}
          className="text-reveal-item inline-block will-change-transform"
          style={{ display: splitBy === 'lines' ? 'block' : 'inline-block' }}
        >
          {item}
          {splitBy === 'words' && i < items.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
}
