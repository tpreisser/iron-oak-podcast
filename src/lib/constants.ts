// Animation presets (derived from Virgin Galactic source analysis)
export const ANIMATION = {
  // Virgin Galactic proven preset
  fadeUp: {
    opacity: 0,
    y: 15,
    duration: 1.5,
    stagger: 0.15,
    ease: 'power2.out',
  },
  // Iron & Oak text reveal
  textReveal: {
    opacity: 0,
    y: 40,
    duration: 1.2,
    ease: 'power3.out',
  },
  // Headline line stagger
  lineStagger: 0.08,
  // Card hover
  cardHover: {
    y: -8,
    duration: 0.3,
    ease: 'power2.out',
  },
  // Page transitions
  pageExit: {
    opacity: 0,
    y: -20,
    duration: 0.3,
  },
  pageEnter: {
    opacity: 0,
    y: 20,
    duration: 0.4,
  },
  // Custom cursor lerp factor
  cursorLerp: 0.15,
  // Cursor sizes
  cursorDefault: 8,
  cursorHover: 40,
} as const;

// Breakpoints matching Tailwind defaults
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ScrollTrigger defaults
export const SCROLL_TRIGGER = {
  start: 'top 85%',
  end: 'bottom 15%',
  toggleActions: 'play none none none',
} as const;

// Nav scroll threshold for glass-morphism
export const NAV_SCROLL_THRESHOLD = 100;

// Forge intro duration
export const FORGE_INTRO_DURATION = 3500; // ms

// Section IDs for scroll navigation
export const SECTIONS = {
  hero: 'hero',
  concept: 'concept',
  series: 'featured-series',
  hosts: 'hosts',
  questions: 'questions-cloud',
  subscribe: 'subscribe',
} as const;
