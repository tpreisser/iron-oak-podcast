'use client';

import { useMagnetic } from '@/hooks/useMagnetic';
import { cn } from '@/lib/utils';

interface MagneticElementProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: React.ElementType;
}

export function MagneticElement({
  children,
  className,
  strength = 0.3,
  as: Tag = 'div',
}: MagneticElementProps) {
  const { ref, handleMouseMove, handleMouseLeave } = useMagnetic(strength);

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('will-change-transform', className)}
    >
      {children}
    </Tag>
  );
}
