'use client';

import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { ANIMATION, SCROLL_TRIGGER } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  distance?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = ANIMATION.textReveal.duration,
  distance = 40,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (gsap) => {
      if (!ref.current) return;

      const directionMap = {
        up: { y: distance, x: 0 },
        down: { y: -distance, x: 0 },
        left: { x: distance, y: 0 },
        right: { x: -distance, y: 0 },
      };

      const { x, y } = directionMap[direction];

      gsap.from(ref.current, {
        opacity: 0,
        x,
        y,
        duration,
        delay,
        ease: ANIMATION.textReveal.ease,
        scrollTrigger: {
          trigger: ref.current,
          start: SCROLL_TRIGGER.start,
          toggleActions: once ? 'play none none none' : 'play reverse play reverse',
        },
      });
    },
    [delay, direction, duration, distance, once],
  );

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
}
