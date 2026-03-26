---
name: iron-oak-mobile-patterns
description: Mobile responsiveness patterns, fixes, and known issues applied to the Iron & Oak Podcast site
type: project
---

## Breakpoint Convention
- Mobile breakpoint: default (no prefix) = 0–639px
- sm = 640px+, md = 768px+, lg = 1024px+
- Phase dots in FeaturedSeries use `w-8 md:w-11` (32px mobile, 44px md+)

## iOS Safari Fixes Applied
- `-webkit-text-size-adjust: 100%` on html (globals.css) — prevents text inflation on rotation
- All form inputs use `text-base sm:text-sm` — 16px minimum prevents iOS zoom on focus
- `env(safe-area-inset-bottom)` on Footer paddingBottom and ForgeIntro "Tap to continue" text
- `-webkit-backdrop-filter` already applied via global `[class*="backdrop-blur"]` rule in globals.css

## Form Mobile Patterns
- HeroSection and Footer forms: inputs get `w-full` on mobile, `sm:w-auto` or `sm:flex-1` on desktop
- Buttons get `w-full sm:w-auto` for full-width on mobile
- All form inputs: `min-h-[44px]` for Apple HIG tap target compliance

## Canvas Elements
- `canvas { max-width: 100%; }` in globals.css prevents horizontal overflow
- OakMissionSection: canvas `opacity-40 lg:opacity-100`, positioned `-right-[30%]` on mobile as background texture
- IronAnvilSection: canvas `opacity-30 lg:opacity-100`, full-width behind text on mobile
- Both canvas sections: text column has `relative z-10` to stay above canvas

## Typography Scale (globals.css)
- `--text-hero: clamp(2rem, 8vw, 7rem)` — 2rem floor (32px) for 320px+ screens
- `--text-h1: clamp(1.75rem, 5vw, 4rem)` — 1.75rem floor (28px)
- `--text-h2: clamp(1.375rem, 3.5vw, 2.5rem)` — 1.375rem floor (22px)
- Body text uses `text-base md:text-lg` in section components (16px minimum)

## Tap Target Rules
- Buttons: `min-h-[44px]` or `min-h-[48px]`
- Social icon links in Footer: `p-3 -m-3` (icon 20px + 24px padding = 44px hit area)
- FeaturedSeries phase buttons: `px-1 py-1 min-h-[44px]` wrapper around smaller visual dot

## Spacing / Padding Notes
- ConceptSection was `pt-64 md:pt-80` — reduced to `pt-32 md:pt-64 lg:pt-80` (8rem on mobile)
- OakMissionSection text: `pr-16 sm:pr-8 lg:pr-6` — extra right padding on mobile keeps text clear of canvas roots
- ForgeIntro logo: `w-[min(200px,60vw)]` on mobile — 60vw cap prevents edge-bleed on 320px phones

## Build & Deploy
- `npm run build` → Next.js static export to `/out`
- Deploy: `npx wrangler pages deploy out --project-name iron-oak-podcast --commit-dirty=true`
- Deployed to Cloudflare Pages at theironandoakpodcast.com (NOT GitHub Pages despite CLAUDE.md saying GH Pages)
