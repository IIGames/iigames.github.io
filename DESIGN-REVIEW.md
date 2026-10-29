# II Games design review

The site is a game portfolio for a small studio. Players should see the games first, then reach a game page and its play/download links. The review used two independent passes: a design assessment and a technical/detector assessment. Findings were combined before the final fixes.

## Changes from the previous site

- The fixed 300px sidebar consumed most of a narrow window. It is replaced with horizontal navigation and a mobile menu. Native anchors restore direct navigation, reloads, and browser history.
- Small, equally weighted headings and boxed sections obscured priority. Large Nevis headings now sit beside real gameplay; body text uses a readable system font. The existing navy/cyan identity stays intact.
- Rebuild warnings dated 2023 appeared before the games. They are removed. Studio copy now reflects the current one-person team and expected collaborators.
- The original featured screenshot was covered by a tutorial message. The feature uses an unobstructed gameplay screenshot instead.
- Several platform icons had no accessible label or valid destination. Games now have explicit text links to verified itch.io and Game Jolt pages.
- Every public game has a dedicated HTML page. Original CubeGame credits and descriptions, the earlier games, and the alpha trailer remain available.

## Verification

18 pages passed 126 page/width checks at 320, 375, 768, 1024, 1280, 1440, and 1920px. No horizontal overflow or JavaScript errors remained. The homepage also passed 200% text-size checks at 320, 768, and 1440px after long headings were allowed to wrap.

The menu opens and closes, Escape returns focus, direct local game links reload, and all eight visible games and navigation remain accessible with JavaScript disabled. Local file paths and case were checked for Linux/GitHub Pages compatibility. Two builds produce identical HTML and retain the article, game credits, and alpha trailer.

Text on the raised surface is 14.06:1; secondary text is 8.62:1. The 3px keyboard focus ring and skip link are visible. Reduced motion disables transitions. The logo was reduced from 580,420 to 14,723 bytes; game imagery uses local JPEG variants and lazy loading below the first view.

The final detector returned nine padding warnings on `game-stage` wrappers. These are false positives: gameplay deliberately reaches the outer edge, while `.download-panel` supplies 20–40px of text inset. Desktop/mobile captures confirmed the spacing. The earlier skip-link contrast finding was fixed.

GitHub Pages deployment itself was not changed or published. Production route behavior needs its final smoke check after deployment; existing file names and dedicated game paths remain intact.

## Guidance applied

Apple's foundations apply to this web site; native app navigation conventions do not.

- `layout.md › Visual hierarchy`: “Order content by relative importance.” Gameplay and the play/download path lead.
- `accessibility.md › Vision`: text supports enlargement, adequate contrast, and visible focus.
- `accessibility.md › Mobility`: controls provide comfortable hit areas and keyboard access.
- `typography.md › Conveying hierarchy`: display and body roles stay distinct at different sizes.
- `branding.md › Best practices`: “Ensure branding always defers to content.” The logo stays in the header; the games carry the visual identity.

Impeccable supplied the responsive, layout, type, clarity, and performance checks. The writing pass used no-slop and the existing game descriptions. Further questions were skipped because implementation followed the approved plan.
