export interface Phase {
  number: number;
  name: string;
  slug: string;
  description: string;
}

export interface Question {
  id: string;
  text: string;
  slug: string;
  episodeSlug: string;
  episodeNumber: number;
  episodeTitle: string;
  phase: string;
  phaseNumber: number;
  talkTrack?: string;
  youtubeTimestamp?: string;
}

export interface Episode {
  number: number;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  phase: string;
  phaseNumber: number;
  questions: Question[];
  scripture: { reference: string; text: string };
  youtubeId?: string;
}

export interface Series {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  phases: Phase[];
  episodeCount: number;
}

export interface Host {
  name: string;
  role: string;
  shortBio: string;
  fullBio: string;
  texture: 'iron' | 'oak';
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
