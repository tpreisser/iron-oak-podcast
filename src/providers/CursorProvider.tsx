'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type CursorVariant = 'default' | 'hover' | 'text' | 'hidden';

interface CursorContextType {
  variant: CursorVariant;
  setCursorVariant: (variant: CursorVariant) => void;
  isEnabled: boolean;
}

const CursorContext = createContext<CursorContextType>({
  variant: 'default',
  setCursorVariant: () => {},
  isEnabled: false,
});

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>('default');
  // Only enable on devices with fine pointer (desktop)
  const [isEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  const setCursorVariant = useCallback((v: CursorVariant) => {
    setVariant(v);
  }, []);

  return (
    <CursorContext.Provider value={{ variant, setCursorVariant, isEnabled }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursorContext() {
  return useContext(CursorContext);
}
