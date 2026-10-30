# Design verification

The homepage now has clearly scroll-linked motion across the introduction, CubeGame scene, selection, studio panel, and closing action. The old desktop-only pinned sequence and subtle compact fallback were replaced. Scroll motion follows the system reduced-motion setting automatically; the motion button has been removed.

A five-game screenshot carousel supports native touch scrolling, snapping, arrow buttons, slide count, and ArrowLeft/ArrowRight/Home/End keys. It never auto-advances. The catalog uses one neutral background (`rgb(23, 24, 32)`) across all cards, white headings, and consistent cyan links. Shared navigation, game details, About, News, Assets, and Add-Ons were updated to match.

## Completed checks

- Actual wheel scrolling changed the headline from 0 to -54.6px and changed the scene scale from 1.1576 to 1.1199 during the tested scroll interval.
- Carousel advanced to slide 2, reached slide 5 with End, disabled Next at the end, and returned to slide 1 with Home.
- Enabling the system reduced-motion preference removed all ScrollTriggers. Disabling it restored the effects. The removed motion button is absent.
- Platform filters returned Browser: 2 games, Windows: 6 games, macOS: 2 games, All games: 6 games.
- Nine representative routes passed at 320, 375, 768, 1024, 1440, and 1920px without horizontal overflow or broken images. The same routes passed 200% text checks at 320, 768, and 1440px.
- Mobile menu and Escape dismissal passed. JavaScript-free carousel/navigation and the complete catalog remained available.
- Desktop and mobile screenshots were reviewed together. Carousel alignment and animation clipping were fixed in one batch, then confirmed with no failures or browser errors.
- All 18 pages passed SEO metadata, canonical sitemap, robots policy, local link/case, preserved-content, and repeatable-build validation. Both JavaScript files passed syntax checks.

Primary and secondary text on the dark page have 17.34:1 and 10.33:1 contrast. Studio copy and secondary heading on lavender have 7.10:1 and 5.10:1 contrast.

Apple HIG foundations informed accessibility, readable hierarchy, optional motion, and artwork-first branding; native Apple app navigation conventions do not apply to this website. These judgments use the local accessibility, typography, color, layout, branding, dark-mode, motion, and cross-platform references.

GSAP and ScrollTrigger remain self-hosted and homepage-only. The carousel and catalog filters add no library. Animation uses transforms and bounded opacity; images reserve dimensions and lazy-load below the introduction. Real-device frame rate, production Core Web Vitals, Safari, and Firefox were not measured.

Browser checks: `tools/landing-catalog-check.js`. Screenshots: `output/playwright/revision-*.png`.

The homepage copy pass replaced the requested slogans with direct labels and game descriptions. It also removed “creative spice,” simplified action labels, reduced heading sizes, aligned the carousel heading to the page grid, and corrected figure/caption markup. Desktop/mobile captures and the browser regression check passed after these changes.
