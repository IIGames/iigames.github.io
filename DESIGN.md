---
name: II Games
description: Dark, artwork-led studio website with editorial news pages.
colors:
  surface: "#0b0c12"
  raised: "#171820"
  text: "#f3f0fa"
  muted: "#bdbbc9"
  line: "#34353f"
  accent: "#54e6ff"
  signal: "#ffd75e"
typography:
  display:
    fontFamily: "Nevis, system-ui, sans-serif"
    fontWeight: 700
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    lineHeight: 1.65
  article-body:
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.125rem, 1.4vw, 1.25rem)"
    lineHeight: 1.8
rounded:
  news-cover: "4px"
  button: "8px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 5rem)"
  section: "clamp(3rem, 7vw, 7rem)"
---
# II Games design

II Games uses a dark, artwork-led studio identity. Preserve the logo, self-hosted Nevis lettering, cyan primary actions, real game imagery, accurate credits, and informal small-team voice. All routes share the same neutral palette and navigation.

## Tokens

Surface `#0b0c12`, raised surface `#171820`, text `#f3f0fa`, secondary text `#bdbbc9`, line `#34353f`, action `#54e6ff`, focus `#ffd75e`. The homepage studio note uses the page surface, a dividing line, and the shared text colors. Game-specific colors belong in artwork; card backgrounds, headings, and links use shared tokens. Do not reintroduce per-game container colors.

Nevis carries display headings, capped at 96px. System sans serif carries body and controls. Responsive layouts use natural content height, 44px or larger controls, visible focus, enlarged-text support, and native anchors/buttons.

## Homepage

The homepage opens with a compact introduction beside a catalog action. The full CubeGame image follows immediately, with its description below. Keep the artwork uncropped and the page static during scroll. No decorative cube, corner frame, staggered card offsets, or animated studio mark. The remaining sections use smaller headings and consistent spacing.

The gameplay carousel uses native horizontal scroll and snapping, with previous/next buttons, a slide count, arrow/Home/End keys, and touch scrolling. It never advances automatically. Images reserve their dimensions and load lazily. Without JavaScript, visitors can still scroll the screenshots.

Copy names the content and action directly: “Gameplay screenshots,” “More games,” and “View game.” Avoid slogans, forced wordplay, and decorative motion controls.

## Other pages

The catalog uses a two-column desktop grid and one-column mobile layout, neutral game cards, readable platform metadata, and All games/Browser/Windows/macOS filters. The archive remains visible separately. Without JavaScript, every game remains available.

Game details use a neutral download panel and restrained platform tags. About connects its introduction to actual game artwork and readable editorial sections. News uses a three-column editorial archive and dedicated reading pages; its details are recorded below. Assets and Add-Ons explain their empty state beside real game imagery and a catalog action. All factual game descriptions, destination URLs, and credits remain intact.

## Verification

`npm run validate` currently validates all 23 generated pages and repeatable generation, deriving news routes from the catalog. `tools/landing-catalog-check.js` is a Playwright CLI run-code function for static scrolling, first-screen artwork, carousel controls, catalog filters, responsive layouts, 200% text, and JavaScript-free fallbacks. See DESIGN-REVIEW.md for the completed verification and limits.

## News and shared navigation

News keeps the shared dark surface and reserves color for square image or gradient covers. Cards have no raised container, a 4px cover radius, system-sans titles at 1.125rem, and a compact category/date line. The archive uses three columns, two at 1050px and below, and one at 760px and below. Category controls use an underline for the selected state; sorting uses a native select. Both wrap at enlarged text sizes.

Article headings are centered, with date and category above, summary below, then reading time and sharing controls. The cover is 16:9 and at most 960px wide. Body copy is at most 68ch, 1.125–1.25rem with 1.8 line height. Body headings use system sans serif; the article title keeps Nevis. Images can carry muted captions, while tables and code blocks scroll locally. Author details and up to three related articles close the page.

Gradient covers use the sky, iris, and ember presets defined in `news.css`. They are decorative cover artwork, hidden from assistive technology; they do not spread into page backgrounds. Image covers use descriptive alt text. The archive and articles are generated as static HTML; JavaScript adds filtering, sorting, and sharing.

The shared logo is 186px wide and retains its 230:70 proportions, shrinking only when constrained. At 760px and below, JavaScript enhances the navigation into a right-side drawer with a backdrop. Its width is at most 320px, it scrolls independently, and opening it locks page scrolling and makes background content inert. Focus enters the close button, stays inside with Tab, and returns to Menu on dismissal. Close, backdrop, Escape, navigation, and resizing to desktop dismiss it. Without JavaScript, navigation remains in normal document flow. Reduced motion removes transitions.
