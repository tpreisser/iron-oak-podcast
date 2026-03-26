# CLAUDE.md — Iron & Oak Podcast Website

## Project Identity

**The Iron & Oak Podcast website** — A cinematic, faith-forward podcast platform for Tyler Preisser and Lincoln Myers. Twelve episodes exploring foundational theology through 109 deep questions. Built with Next.js 16, React 19, TypeScript, Tailwind v4, GSAP + ScrollTrigger, Lenis smooth scroll, and Canvas effects. Deployed as static export to GitHub Pages (`/iron-oak-podcast` basePath).

---

## Tech Stack Summary

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Framework** | Next.js | 16.2.1 | App router, static export (output: "export") |
| **Language** | TypeScript | 5.x | Strict mode, full coverage |
| **UI Library** | React | 19.2.4 | Latest, stable |
| **Styling** | Tailwind CSS | 4.x | @theme inline (no config file needed) |
| **Scroll Animation** | GSAP 3.14.2 + ScrollTrigger | 3.14.2 | ALL scroll-driven animations via GSAP, NOT Framer Motion |
| **Smooth Scroll** | Lenis | 1.3.20 | Synced to ScrollTrigger for smooth scrolling |
| **Page Transitions** | Framer Motion | 12.38.0 | ONLY for page transitions (AnimatePresence), NOT scroll animations |
| **Canvas Effects** | Canvas 2D (native) | — | GradientBackground, IronSparks (NOT WebGL/Three.js) |
| **Form Embeds** | lite-youtube-embed | 0.3.4 | YouTube embed lightweight package |
| **Utilities** | clsx + tailwind-merge | — | `cn()` helper for conditional Tailwind classes |
| **Dev Server** | Next.js dev | — | `npm run dev` |
| **Build** | Next.js static export | — | `npm run build` → `/out` directory |
| **Deployment** | GitHub Pages | — | Push `/out` to GH Pages, basePath: "/iron-oak-podcast" |

---

## Directory Map

```
iron-oak-podcast/
├── src/
│   ├── app/                          # Next.js App Router (all routes, 134 pages generated)
│   │   ├── layout.tsx                # Root layout: providers, Header, Footer, effects (ForgeIntro, IronSparks, ScrollToTop)
│   │   ├── page.tsx                  # Homepage: wires 7 sections (Hero, Concept, OakMission, IronAnvil, FeaturedSeries, Hosts, Sponsors)
│   │   ├── globals.css               # Complete design system: CSS vars (dark/light), fonts, spacing, animations, utilities
│   │   ├── (episode pages)
│   │   │   ├── episodes/page.tsx     # Server page + EpisodesPageClient.tsx (search, filter, grid)
│   │   │   ├── episodes/[slug]/page.tsx  # Server route + EpisodeDetailClient.tsx
│   │   │   ├── questions/page.tsx    # Server page + QuestionsPageClient.tsx (100+ searchable)
│   │   │   ├── questions/[slug]/page.tsx # Server route + QuestionDetailClient.tsx
│   │   ├── (series pages)
│   │   │   ├── series/page.tsx       # All series overview
│   │   │   ├── series/[slug]/page.tsx # Server route + SeriesDetailClient.tsx
│   │   ├── (static pages)
│   │   │   ├── about/page.tsx        # About: extended host bios, why Iron & Oak
│   │   │   ├── subscribe/page.tsx    # Subscribe: newsletter, platforms
│   │   │   ├── merch/page.tsx        # Coming soon: merch page
│   │   │   ├── resources/page.tsx    # Coming soon: resources
│   │   │   ├── contact/page.tsx      # Contact: form (client-side) + socials
│   │   │   ├── not-found.tsx         # 404 page
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── effects/                  # Complex canvas/animation components
│   │   │   ├── GradientBackground.tsx    # Canvas animated gradient background (4 moving blobs, oak/iron colors)
│   │   │   ├── ForgeIntro.tsx            # Fullscreen intro (fire/ember particles, text materialization, sessionStorage gate)
│   │   │   ├── IronSparks.tsx            # Particle burst on .spark-trigger clicks (golden/copper particles)
│   │   │
│   │   ├── home/                     # Homepage sections (all client-side, wrapped in ScrollReveal)
│   │   │   ├── HeroSection.tsx           # Hero: centered h1, subtitle, CTA buttons, scroll indicator
│   │   │   ├── ConceptSection.tsx        # Sticky scroll: "Iron sharpens iron" philosophy
│   │   │   ├── OakMissionSection.tsx     # Oak side: mission statement, deep roots theme
│   │   │   ├── IronAnvilSection.tsx      # Iron side: anvil metaphor, sharpening process
│   │   │   ├── FeaturedSeries.tsx        # 12 episode cards: horizontal scroll, ScrollTrigger scrub
│   │   │   ├── HostsSection.tsx          # Tyler (iron texture) + Lincoln (oak texture), split-screen
│   │   │   ├── SponsorsSection.tsx       # Sponsors/partners carousel
│   │   │
│   │   ├── layout/                   # Structural layout components
│   │   │   ├── Header.tsx                # Fixed nav: logo (scroll to top), Subscribe CTA, glass-morphism on scroll
│   │   │   ├── Navigation.tsx            # Desktop nav links (Episodes, Questions, Series, About, Subscribe)
│   │   │   ├── MobileMenu.tsx            # Mobile overlay menu (stagger animation, tap-friendly)
│   │   │   ├── Footer.tsx                # Footer: nav, socials, newsletter signup, gradient border
│   │   │   ├── PageTransition.tsx        # Framer Motion AnimatePresence wrapper (page fade in/out)
│   │   │
│   │   ├── ui/                       # Atomic UI components
│   │   │   ├── Button.tsx                # 3 variants (primary/secondary/ghost) × 3 sizes (sm/md/lg) + sparkTrigger
│   │   │   ├── ScrollReveal.tsx          # GSAP scroll-triggered reveal (up/down/left/right, delay, distance)
│   │   │   ├── TextReveal.tsx            # Line-by-line reveal animation
│   │   │   ├── EpisodeCard.tsx           # Episode card component (thumbnail, number, title, phase, hover)
│   │   │   ├── CustomCursor.tsx          # Desktop-only custom cursor (8px circle, desktop only, track pointer)
│   │   │   ├── MagneticElement.tsx       # Element that magically pulls cursor near it (hover effect)
│   │   │   ├── ScriptureChisel.tsx       # Character-by-character reveal animation for scripture
│   │   │   ├── ThemeToggle.tsx           # Dark/light mode toggle button
│   │   │   ├── Logo.tsx                  # Iron & Oak logo component
│   │   │   ├── ScrollToTop.tsx           # Scroll-to-top button (appears on scroll)
│   │   │   ├── ComingSoonForm.tsx        # Coming soon form (newsletter, waiting list)
│   │
│   ├── data/                         # TypeScript data files (no CMS, all static)
│   │   ├── episodes.ts                   # 12 episodes with nested 109 questions, scripture, phase
│   │   ├── questions.ts                  # Flat list of all 109 questions (pre-computed in episodes.ts)
│   │   ├── series.ts                     # Series metadata (1 series: "Foundations of the Faith")
│   │   ├── hosts.ts                      # Tyler + Lincoln bios, roles, textures (iron/oak)
│   │   ├── navigation.ts                 # Nav items, footer links, social links
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useGSAP.ts                    # Wrapper around GSAP + ScrollTrigger with cleanup
│   │   ├── useLenis.ts                   # Access Lenis smooth scroll context
│   │   ├── useTheme.ts                   # Access theme context (dark/light)
│   │   ├── useMagnetic.ts                # Magnetic element tracking (cursor pull)
│   │   ├── useCustomCursor.ts            # Custom cursor state (size, position)
│   │   ├── useMediaQuery.ts              # Breakpoint detection (mobile, tablet, desktop)
│   │
│   ├── lib/                          # Utilities and constants
│   │   ├── utils.ts                      # cn() (clsx + twMerge), slugify(), formatEpisodeNumber()
│   │   ├── constants.ts                  # ANIMATION presets, BREAKPOINTS, SCROLL_TRIGGER, SECTIONS IDs
│   │   ├── gsap-register.ts              # GSAP plugin registration (ScrollTrigger, SplitText)
│   │   ├── basePath.ts                   # assetPath() helper for /iron-oak-podcast basePath
│   │
│   ├── providers/                    # React Context providers
│   │   ├── ThemeProvider.tsx             # Dark/light mode context + localStorage persistence
│   │   ├── SmoothScrollProvider.tsx      # Lenis instance + ScrollTrigger sync
│   │   ├── CursorProvider.tsx            # Custom cursor state (if needed)
│   │
│   └── types/                        # TypeScript interfaces
│       └── index.ts                      # Episode, Series, Host, Question, Phase, NavItem
│
├── public/
│   └── images/                       # Static images (webp optimized)
│       ├── iron-oak-cross.webp           # Logo used in Header
│       ├── iron-oak-logo.webp            # OG image for social cards
│
├── .github/
│   └── workflows/                    # GitHub Actions (if any)
│
├── docs/
│   └── superpowers/plans/            # Design/planning docs (reference only)
│
├── (config files)
│   ├── next.config.ts                # Static export, basePath: "/iron-oak-podcast"
│   ├── tsconfig.json                 # TypeScript config (target ES2017, path aliases @/*)
│   ├── tailwind.config.ts            # (not needed — Tailwind v4 uses @theme inline in globals.css)
│   ├── postcss.config.mjs            # PostCSS + Tailwind
│   ├── eslint.config.mjs             # ESLint (Next.js config)
│   ├── package.json                  # Dependencies, scripts
│   ├── package-lock.json             # Exact versions
│   ├── .gitignore                    # Standard Node.js ignore patterns
│   ├── CLAUDE.md                     # (this file) — Project overview & conventions
│   ├── PLAN.md                       # Phase-by-phase task list
│   ├── TASKS.md                      # Active task queue
│   ├── KNOWLEDGE.md                  # Learning log, discoveries, patterns
│   ├── README.md                     # Boilerplate Next.js README (update before launch)
│
└── out/                              # Static export output (git-ignored)
    └── (all 134 pages pre-rendered as .html)
```

---

## Architecture & Data Flow

### Page Structure: Server + Client Split

Each dynamic page uses a **server/client split pattern**:

1. **Server Page** (`page.tsx`): Async, handles `generateStaticParams()`, `generateMetadata()`, data fetching
2. **Client Component** (`*Client.tsx`): Marked with `'use client'`, renders UI, handles interactions

Example: `/episodes/[slug]`

```
episodes/[slug]/page.tsx (Server)
  ↓ generateStaticParams() → calls episodes.ts
  ↓ generateMetadata() → SEO metadata
  ↓ Renders <EpisodeDetailClient episode={episode} />

EpisodeDetailClient.tsx ('use client')
  ↓ Wraps content in <ScrollReveal>, <TextReveal>
  ↓ Maps questions into interactive links
  ↓ Handles client-side interactions
```

### Data Flow

```
src/data/*.ts (static data)
  ↓
src/types/index.ts (TypeScript interfaces)
  ↓
src/app/**/page.tsx (server pages, generateStaticParams)
  ↓
src/app/**/*Client.tsx (client components, UI + effects)
  ↓
src/components/ (reusable components)
  ↓
src/lib/constants.ts (ANIMATION, SCROLL_TRIGGER presets)
  ↓
GSAP animations (ScrollTrigger, text reveals)
```

### Routing Structure

```
/                                    → Homepage (7 sections)
/episodes                            → Episode listing (12 cards)
/episodes/[slug]                     → Episode detail (questions, video, scripture)
/questions                           → Question listing (109 searchable)
/questions/[slug]                    → Question detail (answer, episode link, related)
/series                              → Series overview (1 series)
/series/[slug]                       → Series detail (phases, timeline)
/about                               → About: extended bios, why Iron & Oak
/subscribe                           → Newsletter + platform links
/contact                             → Contact form + socials
/merch, /resources                   → Coming soon pages
/404                                 → 404 page
```

### CSS Design System

All styling uses **CSS custom properties** (vars) for theme support:

**Dark Mode (DEFAULT)** — `data-theme="dark"` or `:root`
- `--bg-primary: #0F1114` (near black)
- `--bg-secondary: #1A1D23` (slightly lighter)
- `--text-primary: #F2EDE8` (off-white)
- `--accent-oak: #6B4226` (dark brown from brand)
- `--accent-iron: #8A9BAE` (steel blue)

**Light Mode** — `[data-theme="light"]`
- `--bg-primary: #FAF8F5` (cream)
- `--text-primary: #1A1D23` (dark brown)
- All other vars invert appropriately

**Typography Tokens**
- `--font-display: "Playfair Display"` (headlines)
- `--font-body: "DM Sans"` (body text)
- `--font-accent: "JetBrains Mono"` (code, special emphasis)
- `--text-h1`, `--text-h2`, `--text-h3`, `--text-body` use `clamp()` for responsive scaling
- **iOS Safari minimum**: 1rem (16px) on body text to prevent auto-zoom

**Spacing & Layout**
- `--section-padding: clamp(4rem, 10vh, 8rem)` (responsive section padding)
- `--container-max: 1280px` (page max width)
- `.container-default` class: max-width, auto margin, responsive padding

---

## Animation Strategy

### GSAP + ScrollTrigger (Scroll-Driven)

**Rule**: ALL scroll-driven animations go through GSAP + ScrollTrigger. Never use Framer Motion for scroll animations.

**Pattern**:

```tsx
'use client';
import { useGSAP } from '@/hooks/useGSAP';
import { ANIMATION, SCROLL_TRIGGER } from '@/lib/constants';

export function MyComponent() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP((gsap) => {
    gsap.from(ref.current, {
      opacity: 0,
      y: 40,
      duration: ANIMATION.textReveal.duration,
      ease: ANIMATION.textReveal.ease,
      scrollTrigger: {
        trigger: ref.current,
        start: SCROLL_TRIGGER.start,  // 'top 85%'
        toggleActions: 'play none none none',
      },
    });
  }, []);

  return <div ref={ref}>{children}</div>;
}
```

**Preset Library** (in `src/lib/constants.ts`):
- `fadeUp`: Virgin Galactic preset (opacity 0→1, y 15, stagger 0.15)
- `textReveal`: Typography reveal (opacity 0→1, y 40, ease power3.out)
- `lineStagger`: Text line stagger interval (0.08s)
- `cardHover`: Card hover animation (y -8px, 0.3s power2.out)

### Framer Motion (Page Transitions ONLY)

**Rule**: Framer Motion is ONLY for page-level AnimatePresence transitions, not scroll animations.

```tsx
// In layout or PageTransition wrapper:
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### Canvas Effects (Native 2D, NOT WebGL)

1. **GradientBackground**: Fullscreen canvas with 4 animated blobs (oak/iron colors, very slow movement)
2. **ForgeIntro**: Fullscreen ember particles + text materialization (fires once per session)
3. **IronSparks**: Particle burst on `.spark-trigger` button clicks

All canvas effects:
- Respect `prefers-reduced-motion: reduce`
- Use `IntersectionObserver` to pause when offscreen
- Cap device pixel ratio at 2.0 for performance

---

## Component Patterns

### Button Component

```tsx
<Button variant="primary|secondary|ghost" size="sm|md|lg" sparkTrigger={true}>
  Click me
</Button>
```

- **primary**: oak background, glowing hover
- **secondary**: border-only, oak text on hover
- **ghost**: text-only, subtle hover
- **sparkTrigger**: Adds `.spark-trigger` class → triggers IronSparks on click

### ScrollReveal Component

```tsx
<ScrollReveal delay={0.1} direction="up" duration={1.2} distance={40} once={true}>
  <h2>Headline</h2>
</ScrollReveal>
```

- **delay**: Stagger delay in seconds
- **direction**: up|down|left|right
- **duration**: Animation duration (default: 1.2s from ANIMATION.textReveal)
- **once**: If true, plays only once. If false, reverses on scroll out.
- Wraps children in a div with `will-change-transform` for performance

### EpisodeCard Component

```tsx
<EpisodeCard
  episode={episode}
  href={`/episodes/${episode.slug}`}
/>
```

Renders:
- Episode number (formatted EP 01, EP 02, etc.)
- Phase badge (dark background, oak text)
- Title with hover effect
- Subtitle preview
- Border hover effect (oak glow)

### Custom Cursor

- Desktop only (hidden on touch)
- 8px base circle, scales to 40px on hover
- Uses RAF + GSAP lerp for smooth tracking
- Hidden when `prefers-reduced-motion: reduce`

---

## Code Conventions

### File Naming

- **Components**: PascalCase (e.g., `HeroSection.tsx`, `EpisodeCard.tsx`)
- **Utilities/Hooks**: camelCase (e.g., `useGSAP.ts`, `utils.ts`)
- **Data files**: camelCase (e.g., `episodes.ts`, `hosts.ts`)
- **CSS files**: globals.css (global styles only)

### Import Patterns

Always use path aliases:

```tsx
// ✓ Good
import { Button } from '@/components/ui/Button';
import { episodes } from '@/data/episodes';
import { cn } from '@/lib/utils';

// ✗ Avoid relative imports
import { Button } from '../../../components/ui/Button';
```

### Component Structure

```tsx
'use client';  // Always at top for client components

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ComponentProps {
  children: React.ReactNode;
  className?: string;
}

export function MyComponent({ children, className }: ComponentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Side effects
  }, []);

  return (
    <div ref={ref} className={cn('base-styles', className)}>
      {children}
    </div>
  );
}
```

### Styling Rules

1. **Use CSS variables** for colors, fonts, spacing (never hardcode hex values)
2. **Use `cn()` for conditional classes**: `cn('base', active && 'active')`
3. **Tailwind first**: Use Tailwind utilities, only custom CSS in globals.css
4. **Respond to `prefers-reduced-motion`**: Skip animations if set
5. **Mobile-first**: Use Tailwind's `md:`, `lg:` prefixes, not breakpoint vars

```tsx
// ✓ Good
<div className="text-[var(--text-primary)] hover:text-[var(--accent-oak)] transition-colors">
  Text
</div>

// ✓ Good — conditional
<div className={cn('p-4', isActive && 'bg-[var(--bg-secondary)]')}>
  Conditional styles
</div>

// ✗ Avoid hardcoded colors
<div className="text-[#F2EDE8] bg-[#0F1114]">
  ✗ Bad — breaks theme switching
</div>
```

### Theme Context Pattern

Always use the `useTheme()` hook to access theme state:

```tsx
'use client';
import { useTheme } from '@/hooks/useTheme';

export function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current: {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
```

Theme is persisted to localStorage as `iron-oak-theme`.

### GSAP Usage Pattern

Always use the custom `useGSAP()` hook, NOT direct GSAP imports:

```tsx
'use client';
import { useGSAP } from '@/hooks/useGSAP';

export function MyComponent() {
  const ref = useRef(null);

  useGSAP((gsap, ScrollTrigger) => {
    // gsap and ScrollTrigger are already registered
    gsap.to(ref.current, {
      // animation config
    });

    // Return cleanup function (optional)
    return () => {
      // cleanup
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
```

---

## Development Workflow

### Installation & Setup

```bash
cd /Users/tylerpreisser/Desktop/iron-oak-podcast
npm install  # Install all dependencies
npm run dev  # Start dev server at http://localhost:3000
```

### Development Commands

```bash
npm run dev    # Start dev server (hot reload enabled)
npm run build  # Static export to /out
npm run start  # Preview production build (local)
npm run lint   # Run ESLint
```

### Build & Deployment

```bash
# Local static build
npm run build

# Preview (requires build first)
npm run start

# Deploy to GitHub Pages
# Push /out directory to gh-pages branch
# Or use GitHub Actions if configured
```

**Deployment Target**: GitHub Pages with basePath `/iron-oak-podcast`
- Config in `next.config.ts`: `basePath: "/iron-oak-podcast"`, `output: "export"`
- All asset paths handled via `assetPath()` helper in `/src/lib/basePath.ts`

---

## Known Issues & Gotchas

### Platform-Specific

1. **iOS Safari minimum font size**: Body text set to minimum 1rem (16px) to prevent unwanted auto-zoom on input focus
2. **iOS momentum scroll**: Enabled via `-webkit-overflow-scrolling: touch` for smooth momentum on touch devices
3. **Notch support**: Safe area insets applied via `env(safe-area-inset-left/right)`
4. **Touch cursor**: Custom cursor hidden on touch devices (via media query in CustomCursor component)

### Animation Edge Cases

1. **prefers-reduced-motion**: All animations respect this system preference. GradientBackground skips rendering, ForgeIntro disables particles, etc.
2. **Lenis + ScrollTrigger sync**: SmoothScrollProvider calls `lenis.on('scroll', ScrollTrigger.update)` to keep them in sync
3. **Canvas rendering**: GradientBackground uses IntersectionObserver to pause rendering when offscreen

### Known Incomplete Features

1. **Episode video embeds**: Currently placeholders. Need YouTube IDs in `episodes.ts`
2. **Newsletter forms**: Client-side only (no backend integration). Form submission logs to console.
3. **Platform links**: All social/platform links are `href="#"` placeholders. Update in `data/navigation.ts` and components.
4. **Host photos**: Currently show initials (TP, LM). Need actual images.
5. **BackgroundTransition**: Iron→Oak texture crossfade on scroll not yet built.

### Data Structure

All content is in `/src/data/*.ts` TypeScript files — **no CMS, no database**:

- **episodes.ts**: 12 episodes, each with nested 109 questions
- **series.ts**: Metadata for the series "Foundations of the Faith"
- **hosts.ts**: Tyler + Lincoln profiles
- **navigation.ts**: All nav, footer, and social links
- **questions.ts**: (pre-computed flat list from episodes, for search)

To add/edit content: Edit the `.ts` files directly, run `npm run dev`, and the site rebuilds automatically.

---

## Testing & Quality

### ESLint

```bash
npm run lint  # Check for style violations
```

Config: ESLint 9 + Next.js recommended rules (`eslint-config-next`)

### Browser Compatibility

- **Targets**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- **Polyfills**: None needed (all APIs are widely supported)
- **CSS fallbacks**: CSS variables with `@supports` checks where needed

### Accessibility

- **Color contrast**: WCAG AA minimum in both dark and light modes
- **Focus states**: All interactive elements have `focus-visible` ring
- **Motion**: Respects `prefers-reduced-motion: reduce`
- **Semantic HTML**: Use `<button>`, `<a>`, `<nav>`, etc.
- **ARIA labels**: Add for custom components (custom cursor, particle canvas, etc.)

---

## Performance Notes

1. **Canvas rendering**: Capped at 2x device pixel ratio to prevent memory bloat
2. **Intersection observers**: Used to pause offscreen canvas animations
3. **RAF throttling**: All requestAnimationFrame loops cleaned up on unmount
4. **Font optimization**: Google Fonts with `display: 'swap'` for fast web font loading
5. **Image optimization**: Use WebP format, set explicit width/height
6. **Lazy loading**: Consider next/dynamic for heavy components if needed

---

## Critical Principles

### 1. Dark Mode is DEFAULT
Never assume light mode. Always style for dark first, then provide light mode overrides via `[data-theme="light"]`.

### 2. GSAP for Scroll, Framer for Pages
This is a hard rule. Scroll animations = GSAP. Page transitions = Framer Motion. Mixing them causes performance issues.

### 3. CSS Variables ONLY
Never hardcode colors. Always use CSS variables that respect theme switching.

### 4. ScrollTrigger Cleanup
Always clean up ScrollTrigger instances on component unmount:

```tsx
useEffect(() => {
  return () => {
    ScrollTrigger.getAll().forEach(t => t.kill());
  };
}, []);
```

### 5. Static Export Reality
This is a **static site**. All 134 pages are pre-rendered at build time. No API routes, no dynamic rendering, no backend.

### 6. TypeScript Strict Mode
Full strict mode enabled. No `any` types. All props, data, and functions must be fully typed.

---

## Useful References

**PLAN.md**: Phase-by-phase task checklist (53 tasks total, phases 0-6)

**KNOWLEDGE.md**: Learning log, discoveries, animation presets, patterns from research

**TASKS.md**: Active task queue and in-progress work

---

## Quick Start for New Agents

1. **Read this file first** — You're reading it
2. **Understand the data flow** — All content comes from `/src/data/*.ts`
3. **Study `/src/lib/constants.ts`** — Animation presets live here
4. **Check `/src/app/globals.css`** — Design tokens and color system
5. **Explore a simple component** — Start with `/src/components/ui/Button.tsx`
6. **Try a full page** — Look at `/src/app/episodes/[slug]/page.tsx` → `/EpisodeDetailClient.tsx` pattern
7. **Test locally** — `npm run dev` and navigate to `http://localhost:3000`

---

## Questions? Issues?

- **Build failing?** Check `npm install` and `npm run build`
- **Styles not applying?** Verify CSS variables in globals.css, not hardcoded hex
- **Animation not working?** Make sure you're using `useGSAP()` hook and ScrollTrigger is registered
- **Theme switching broken?** Check ThemeProvider wraps entire app in layout.tsx

---

**Last Updated**: 2026-03-25
**Phase**: 6 — Polish & Deploy
**Status**: 134 pages built, all effects integrated, ready for final polish
