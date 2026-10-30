# II Games design

II Games uses a dark, artwork-led studio identity. Preserve the logo, self-hosted Nevis lettering, cyan primary actions, real game imagery, accurate credits, and informal small-team voice. All routes share the same neutral palette and navigation.

## Tokens

Surface `#0b0c12`, raised surface `#171820`, text `#f3f0fa`, secondary text `#bdbbc9`, line `#34353f`, action `#54e6ff`, focus `#ffd75e`. The homepage studio panel uses `#c3adff` with dark text. Game-specific colors belong in artwork; card backgrounds, headings, and links use shared tokens. Do not reintroduce per-game container colors.

Nevis carries display headings, capped at 96px. System sans serif carries body and controls. Responsive layouts use natural content height, 44px or larger controls, visible focus, enlarged-text support, and native anchors/buttons.

## Homepage

The introduction parts as the visitor scrolls into CubeGame. The scene expands and its image reframes; game cards, the studio panel, and closing section move with the scroll position. GSAP ScrollTrigger runs these transforms on compact and regular screens without pinning, viewport-height gates, or artificial spacer gaps. Text remains present when scripts fail.

Scroll motion follows the system reduced-motion setting automatically. There is no motion button or stored site preference. Enabling reduced motion reverts GSAP styles and triggers; a fresh reduced-motion visit does not load GSAP. Vendor files remain local to the homepage.

The gameplay carousel uses native horizontal scroll and snapping, with previous/next buttons, a slide count, arrow/Home/End keys, and touch scrolling. It never advances automatically. Images reserve their dimensions and load lazily. Without JavaScript, visitors can still scroll the screenshots.

Copy names the content and action directly: “Gameplay screenshots,” “More games,” and “View game.” Avoid slogans, forced wordplay, and decorative motion controls.

## Other pages

The catalog uses a two-column desktop grid and one-column mobile layout, neutral game cards, readable platform metadata, and All games/Browser/Windows/macOS filters. The archive remains visible separately. Without JavaScript, every game remains available.

Game details use a neutral download panel and restrained platform tags. About connects its introduction to actual game artwork and readable editorial sections. News uses an article feature panel. Assets and Add-Ons explain their empty state beside real game imagery and a catalog action. All factual game descriptions, destination URLs, and credits remain intact.

## Verification

`node tools/validate-site.mjs` validates all 18 generated pages and repeatable generation. `tools/landing-catalog-check.js` is a Playwright CLI run-code function for actual scroll movement, carousel controls, catalog filters, responsive layouts, 200% text, and JavaScript-free fallbacks. See DESIGN-REVIEW.md for the completed verification and limits.
