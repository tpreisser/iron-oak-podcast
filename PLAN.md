# PLAN.md — Master Execution Plan

Source spec: /Users/tylerpreisser/Downloads/IRON-OAK-DEFINITIVE-PROMPT.md

## Phase 0: Audit & Infrastructure
- [x] 1. codebase-cartographer maps project
- [ ] 2. Create CLAUDE.md, PLAN.md, TASKS.md, KNOWLEDGE.md
- [ ] 3. Design system: globals.css (all CSS vars, fonts, tokens, dark/light)
- [ ] 4. Types: src/types/index.ts (Episode, Series, Host, Question, Phase)
- [ ] 5. Data layer: episodes.ts, series.ts, hosts.ts, questions.ts, navigation.ts
- [ ] 6. Lib: utils.ts (cn, slugify), constants.ts, gsap-register.ts
- [ ] 7. Providers: ThemeProvider, SmoothScrollProvider, CursorProvider
- [ ] 8. Hooks: useGSAP, useLenis, useTheme, useMagnetic, useCustomCursor, useMediaQuery
- [ ] 9. Root layout.tsx rebuild (fonts, providers, metadata, structure)

## Phase 1: Core UI Components
- [ ] 10. Button component (primary/secondary/ghost + micro-interactions)
- [ ] 11. ScrollReveal component (GSAP scroll-triggered wrapper)
- [ ] 12. TextReveal component (line-by-line GSAP animation)
- [ ] 13. MagneticElement component
- [ ] 14. EpisodeCard component
- [ ] 15. ThemeToggle component

## Phase 2: Layout Components
- [ ] 16. Navigation (glass-morphism, logo colors, magnetic links, responsive)
- [ ] 17. MobileMenu (full-screen overlay, stagger animation)
- [ ] 18. Footer (gradient border, nav, socials, newsletter)
- [ ] 19. PageTransition (Framer Motion AnimatePresence)

## Phase 3: Homepage Sections
- [ ] 20. HeroSection (centered layout, GSAP timeline, newsletter input, scroll indicator)
- [ ] 21. ConceptSection (sticky scroll, line-by-line text reveals)
- [ ] 22. FeaturedSeries (horizontal scroll 12 episode cards, ScrollTrigger scrub)
- [ ] 23. HostsSection (split-screen, iron/oak textures, mirrored reveal)
- [ ] 24. QuestionsCloud (15-20 floating questions, hover/click interaction)
- [ ] 25. SubscribeSection (dark bg, warm glow, email input, platform icons)
- [ ] 26. Homepage assembly (page.tsx wires all sections)

## Phase 4: Effects & Animation
- [ ] 27. Research gradient implementations (internet-investigator)
- [ ] 28. GradientBackground (canvas animated gradient, Iron & Oak colors)
- [ ] 29. ForgeIntro (ember particles, text materialization, sessionStorage gate)
- [ ] 30. BackgroundTransition (iron->oak texture crossfade on scroll)
- [ ] 31. CustomCursor (desktop only, 8px circle, GSAP lerp)
- [ ] 32. IronSparks (canvas particle burst on CTA clicks)
- [ ] 33. ScriptureChisel (char-by-char reveal, SplitText or manual)

## Phase 5: Content Pages
- [ ] 34. Episodes listing page (search, phase filter, card grid, stagger)
- [ ] 35. Episode detail page (video embed, questions, talk track, scripture chisel)
- [ ] 36. Questions listing page (100+ searchable/filterable)
- [ ] 37. Question detail page (question, episode link, timestamp, related)
- [ ] 38. Series overview page
- [ ] 39. Series detail page (phase timeline, vertical line, nodes on scroll)
- [ ] 40. About page (hero, why section, expanded bios, textures)
- [ ] 41. Subscribe page (newsletter, platforms)
- [ ] 42. Merch + Resources coming soon pages
- [ ] 43. Contact page (form + socials)
- [ ] 44. 404 page

## Phase 6: Polish
- [ ] 45. Copy fix pass (remove ALL spec language — r-squared-writer)
- [ ] 46. Card hover effects on every card (translateY, shadow, border)
- [ ] 47. Button micro-interactions (scale, glow)
- [ ] 48. ui-mobile full pass (touch targets, mobile menu, responsive)
- [ ] 49. Performance pass (60fps, lazy loading, prefers-reduced-motion)
- [ ] 50. SEO pass (meta, OG, Twitter Cards, JSON-LD)
- [ ] 51. Dark + light mode verification (every page, every component)
- [ ] 52. Final QA (web-code-executor every page, both themes, all breakpoints)
- [ ] 53. Deploy Vercel, push, tag v2.0.0
