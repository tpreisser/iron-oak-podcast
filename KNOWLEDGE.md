# KNOWLEDGE.md — Learning Log

## Technical Discoveries
- Next.js 16.2.1 with React 19.2.4 — latest versions
- Tailwind v4 uses @theme inline directive (no tailwind.config.ts needed)
- GSAP 3.14.2 — ScrollTrigger included free, SplitText requires Club
- Lenis 1.3.20 — must sync with ScrollTrigger via lenis.on('scroll', ScrollTrigger.update)

## Reference Site Findings (from definitive prompt)
- **Stripe**: Custom 800-line WebGL "MiniGL" for gradient. Open-source: jordienr gist, whatamesh.vercel.app, wave-gradient npm
- **Unseen Studio**: Three.js 3D, Highway.js transitions, Navier-Stokes fluid sim. We adapt: custom cursor (DOM + GSAP lerp), Lenis, page transitions
- **Hyper Dreams**: Webflow + PixiJS displacement, Grained.js film grain (0.35 opacity), GSAP TweenMax
- **Virgin Galactic**: Nuxt 3, custom "AstroGL" on OGL. GSAP ScrollTrigger (124 refs). Proven preset: { opacity:0, y:15, duration:1.5, stagger:0.15, ease:"power2.out" }
- **Key insight**: None use Framer Motion for signature effects. Magic = Canvas/WebGL + GSAP + custom engineering

## What Failed and Why
(logging as we go)

## What Worked Well
(logging as we go)

## Reusable Patterns
- GSAP text reveal: `gsap.from(el, { opacity:0, y:40, duration:1.2, ease:"power3.out", scrollTrigger:{ trigger:el, start:"top 85%" } })`
- Virgin Galactic preset: `{ opacity:0, y:15, duration:1.5, stagger:0.15, ease:"power2.out" }`
- Card hover: translateY:-8px, shadow->glow, border->oak 30%, 0.3s power2.out
- Nav glass-morphism: after 100px scroll, backdrop-filter blur(12px), bg rgba(15,17,20,0.8)
- Custom cursor: 8px circle, --accent-oak border, RAF loop cursorX += (mouseX-cursorX)*0.15
