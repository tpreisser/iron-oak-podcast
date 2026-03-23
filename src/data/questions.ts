import { episodes } from './episodes';
import type { Question } from '@/types';

export const questions: Question[] = episodes.flatMap((ep) => ep.questions);

export function getQuestionBySlug(slug: string): Question | undefined {
  return questions.find((q) => q.slug === slug);
}

export function getQuestionsByEpisode(episodeSlug: string): Question[] {
  return questions.filter((q) => q.episodeSlug === episodeSlug);
}

export function getQuestionsByPhase(phaseNumber: number): Question[] {
  return questions.filter((q) => q.phaseNumber === phaseNumber);
}
