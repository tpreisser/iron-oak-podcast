import type { Series } from '@/types';

export const series: Series = {
  title: 'Foundations of the Faith',
  slug: 'foundations-of-the-faith',
  tagline: 'One Season. Five Phases. The Whole Story.',
  description:
    'Season One walks through the essential doctrines of the Christian faith — from the sufficiency of Scripture to the ultimate hope of the new creation. Twelve episodes. Five phases. Every question you were afraid to ask.',
  phases: [
    {
      number: 1,
      name: 'Foundation',
      slug: 'foundation',
      description:
        'What we build everything on — Scripture, God\'s character, and the Trinity.',
    },
    {
      number: 2,
      name: 'The Fall',
      slug: 'the-fall',
      description: 'Understanding what went wrong and why it matters.',
    },
    {
      number: 3,
      name: 'Redemption',
      slug: 'redemption',
      description:
        'Jesus, the resurrection, and the gospel that changes everything.',
    },
    {
      number: 4,
      name: 'The Christian Life',
      slug: 'the-christian-life',
      description:
        'The Holy Spirit, the church, and what it means to follow Jesus.',
    },
    {
      number: 5,
      name: 'Hard Questions',
      slug: 'hard-questions',
      description:
        'The questions that test faith and demand honest answers.',
    },
  ],
  episodeCount: 12,
};
