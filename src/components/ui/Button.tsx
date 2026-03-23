'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Button                                                                     */
/* -------------------------------------------------------------------------- */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  sparkTrigger?: boolean;
}

const baseStyles =
  'inline-flex items-center justify-center font-medium transition-all duration-300 ease-out rounded-[var(--radius-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-oak)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]';

const variants = {
  primary:
    'bg-[var(--accent-oak)] text-white hover:bg-[var(--accent-oak-light)] hover:scale-[1.03] hover:shadow-[var(--shadow-glow)]',
  secondary:
    'border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--accent-oak)] hover:text-[var(--accent-oak)] hover:scale-[1.03]',
  ghost:
    'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
};

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-13 px-8 text-lg',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', sparkTrigger = false, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          sparkTrigger && 'spark-trigger',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

/* -------------------------------------------------------------------------- */
/*  ButtonLink                                                                 */
/* -------------------------------------------------------------------------- */

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  sparkTrigger?: boolean;
}

const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    { className, variant = 'primary', size = 'md', sparkTrigger = false, children, ...props },
    ref,
  ) => {
    return (
      <a
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          sparkTrigger && 'spark-trigger',
          className,
        )}
        {...props}
      >
        {children}
      </a>
    );
  },
);

ButtonLink.displayName = 'ButtonLink';

export { Button, ButtonLink };
export type { ButtonProps, ButtonLinkProps };
