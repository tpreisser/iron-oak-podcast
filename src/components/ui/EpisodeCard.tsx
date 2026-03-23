'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { ANIMATION } from '@/lib/constants';
import { cn, formatEpisodeNumber } from '@/lib/utils';
import type { Episode } from '@/types';

interface EpisodeCardProps {
  episode: Episode;
  className?: string;
  index?: number;
}

export function EpisodeCard({ episode, className, index = 0 }: EpisodeCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  // Card hover animation via GSAP for smooth 60fps
  useGSAP((gsap) => {
    if (!cardRef.current) return;
    const card = cardRef.current;

    const handleEnter = () => {
      gsap.to(card, {
        y: ANIMATION.cardHover.y,
        duration: ANIMATION.cardHover.duration,
        ease: ANIMATION.cardHover.ease,
        boxShadow: 'var(--shadow-glow)',
      });
    };

    const handleLeave = () => {
      gsap.to(card, {
        y: 0,
        duration: ANIMATION.cardHover.duration,
        ease: ANIMATION.cardHover.ease,
        boxShadow: 'none',
      });
    };

    card.addEventListener('mouseenter', handleEnter);
    card.addEventListener('mouseleave', handleLeave);

    return () => {
      card.removeEventListener('mouseenter', handleEnter);
      card.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <Link
      ref={cardRef}
      href={`/episodes/${episode.slug}`}
      className={cn(
        'group block rounded-[var(--radius-lg)] border border-[var(--border-default)]',
        'bg-[var(--bg-secondary)] p-6 will-change-transform',
        'transition-[border-color] duration-300',
        'hover:border-[rgba(196,132,62,0.3)]',
        className
      )}
    >
      {/* Episode number */}
      <span className="font-[family-name:var(--font-accent)] text-sm text-[var(--accent-oak)] tracking-wider">
        {formatEpisodeNumber(episode.number)}
      </span>

      {/* Phase badge */}
      <div className="mt-2 mb-3">
        <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-[var(--bg-accent-surface)] text-[var(--accent-oak-light)]">
          {episode.phase}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-[family-name:var(--font-display)] text-[var(--text-h3)] leading-tight text-[var(--text-primary)] mb-2">
        {episode.title}
      </h3>

      {/* Subtitle */}
      <p className="text-[var(--text-body)] text-[var(--text-secondary)] line-clamp-2">
        {episode.subtitle}
      </p>

      {/* Question count */}
      <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
        <span className="text-sm text-[var(--text-tertiary)]">
          {episode.questions.length} questions
        </span>
      </div>
    </Link>
  );
}
