'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, registerGSAPPlugins } from '@/lib/gsap-register';

export function useGSAP(callback: (gsap: typeof import('gsap').gsap, ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger) => void | (() => void), deps: React.DependencyList = []) {
  const cleanupRef = useRef<(() => void) | void>(undefined);

  useEffect(() => {
    registerGSAPPlugins();
    cleanupRef.current = callback(gsap, ScrollTrigger);

    return () => {
      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
