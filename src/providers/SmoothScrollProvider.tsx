'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, registerGSAPPlugins } from '@/lib/gsap-register';

interface SmoothScrollContextType {
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null });

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    registerGSAPPlugins();

    // Disable GSAP lag smoothing so Lenis controls the scroll timing
    gsap.ticker.lagSmoothing(0);

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      autoRaf: false, // We drive RAF through GSAP's ticker, not Lenis's own loop
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker instead of a separate RAF loop.
    // This ensures scroll position updates and GSAP animations are
    // calculated in the same frame, eliminating the double-update
    // race condition that causes micro-jank on pinned sections.
    const tickerCallback = (time: number) => {
      lenisInstance.raf(time * 1000); // GSAP ticker uses seconds, Lenis expects ms
    };
    gsap.ticker.add(tickerCallback);

    setLenis(lenisInstance);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenisInstance.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}
