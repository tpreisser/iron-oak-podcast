# CLAUDE.md
## Project
The Iron & Oak Podcast website. Next.js 16+, TypeScript, Tailwind v4, GSAP + ScrollTrigger, Lenis, Framer Motion. Vercel deployment.

## Current phase
Phase 6 — Polish & Deploy

## Last completed task
All effects integrated (gradient, forge intro, cursor, sparks, scripture chisel) — 928849e

## Next task
Final polish: ScriptureChisel integration into episode detail pages, BackgroundTransition, then deploy

## Architecture decisions
- Dark mode is DEFAULT (data-theme attribute on html)
- Fonts: Playfair Display (display), DM Sans (body), JetBrains Mono (accent)
- GSAP + ScrollTrigger for all scroll-driven animation (NOT Framer Motion)
- Framer Motion ONLY for page transitions (AnimatePresence)
- Lenis for smooth scroll, synced with ScrollTrigger
- Canvas 2D for gradient/particles (NOT WebGL/Three.js)
- All content in TypeScript data files (no CMS)
- CSS variables for all design tokens
- Tailwind v4 with @theme inline
- ThemeProvider must ALWAYS render context (not conditional — SSR crash fix)
- Server/client split pattern for pages with forms + metadata

## Known issues
- Episode video embeds are placeholders (no YouTube IDs yet)
- Newsletter forms are client-side only (no backend integration)
- Platform links (YouTube, Spotify, Apple) are placeholder #
- Host photos are initials placeholders (no images yet)
- BackgroundTransition (iron→oak scroll crossfade) not yet built

## Subagent context
- 134 pages built successfully (12 episodes, 109 questions, 1 series, 10 static)
- All effects operational: GradientBackground, ForgeIntro, CustomCursor, IronSparks, ScriptureChisel

## Key files
- src/app/layout.tsx — Root layout (providers, nav, footer, effects)
- src/app/page.tsx — Homepage (6 sections assembled)
- src/app/globals.css — Complete design system
- src/types/index.ts — All TypeScript interfaces
- src/data/episodes.ts — All 12 episodes, 109 questions
- src/components/effects/ — GradientBackground, ForgeIntro, IronSparks
- src/components/ui/ — Button, ScrollReveal, TextReveal, EpisodeCard, CustomCursor, ScriptureChisel, ThemeToggle, MagneticElement
- src/components/home/ — HeroSection, ConceptSection, FeaturedSeries, HostsSection, QuestionsCloud, SubscribeSection
- src/components/layout/ — Navigation, MobileMenu, Footer, PageTransition
