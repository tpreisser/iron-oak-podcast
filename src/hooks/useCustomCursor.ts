'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-register';
import { useCursorContext } from '@/providers/CursorProvider';
import { ANIMATION } from '@/lib/constants';

export function useCustomCursor() {
  const { variant, isEnabled } = useCursorContext();
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isEnabled || !cursorRef.current) return;

    const cursor = cursorRef.current;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const { x, y } = posRef.current;
      gsap.to(cursor, {
        x,
        y,
        duration: ANIMATION.cursorLerp,
        ease: 'none',
        overwrite: true,
      });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isEnabled]);

  // Update cursor size based on variant
  useEffect(() => {
    if (!isEnabled || !cursorRef.current) return;
    const cursor = cursorRef.current;

    const sizes: Record<string, number> = {
      default: ANIMATION.cursorDefault,
      hover: ANIMATION.cursorHover,
      text: 2,
      hidden: 0,
    };

    gsap.to(cursor, {
      width: sizes[variant] || ANIMATION.cursorDefault,
      height: sizes[variant] || ANIMATION.cursorDefault,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [variant, isEnabled]);

  return { cursorRef, isEnabled };
}
