'use client';

import { useSmoothScroll } from '@/providers/SmoothScrollProvider';

export function useLenis() {
  const { lenis } = useSmoothScroll();
  return lenis;
}
