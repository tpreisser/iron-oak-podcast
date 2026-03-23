# CLAUDE.md
## Project
The Iron & Oak Podcast website. Next.js 16+, TypeScript, Tailwind v4, GSAP + ScrollTrigger, Lenis, Framer Motion. Vercel deployment.

## Current phase
Phase 0 — Audit & Infrastructure Setup

## Last completed task
Project scaffold created — initial Next.js setup

## Next task
Phase 0: Create design system (globals.css with all CSS variables, fonts, tokens)

## Architecture decisions
- Dark mode is DEFAULT (data-theme attribute on html)
- Fonts: Playfair Display (display), DM Sans (body), JetBrains Mono (accent) — NO Inter/Roboto/Arial/system-ui
- GSAP + ScrollTrigger for all scroll-driven animation (NOT Framer Motion)
- Framer Motion ONLY for page transitions (AnimatePresence)
- Lenis for smooth scroll, synced with ScrollTrigger
- Canvas 2D for gradient/particles (NOT WebGL/Three.js)
- lite-youtube-embed for video embeds
- All content in TypeScript data files (no CMS)
- CSS variables for all design tokens
- Tailwind v4 with @theme inline for custom tokens

## Known issues
- page.tsx is default Next.js template (needs full replacement)
- globals.css has only skeleton Tailwind defaults
- layout.tsx uses Geist fonts (needs Playfair/DM Sans/JetBrains)
- No application components exist yet

## Subagent context
- codebase-cartographer: completed initial audit — clean scaffold, 0 app code
- All 20 deps installed and working

## Key files
- src/app/layout.tsx — Root layout
- src/app/page.tsx — Homepage (needs full rebuild)
- src/app/globals.css — Design tokens (needs full rebuild)
- /Users/tylerpreisser/Downloads/IRON-OAK-DEFINITIVE-PROMPT.md — Complete spec
