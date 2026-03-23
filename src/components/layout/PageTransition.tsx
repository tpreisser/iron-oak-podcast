'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ANIMATION } from '@/lib/constants';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: ANIMATION.pageEnter.opacity, y: ANIMATION.pageEnter.y }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: ANIMATION.pageExit.opacity, y: ANIMATION.pageExit.y }}
        transition={{ duration: ANIMATION.pageEnter.duration, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
