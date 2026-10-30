# II Games design

World Portals applies the requested Liquid Glass system: pearl canvas, navy lettering, diffused blue/lilac light, and a compact floating glass navigation bar. Game artwork remains the signature. Long descriptions and game information use nearly opaque white surfaces; blur is confined to the functional navigation layer. Existing factual copy, game links, credits, and SEO metadata stay intact.

Tokens: canvas #f4f6fb, reading surface #ffffff, display #192235, body #202633, secondary #505c70, links #2855b4, primary #315dc6, dividers #dce5f3. Panel corners 28px, controls 16px, capsule metadata. Artwork accents use darker tones for legibility on white. Nevis remains the English display face; system sans serif handles body and controls. Body 17px; display scales 44–96px; section headings 28–48px.

Desktop: horizontal glass navigation; split introduction; featured artwork beside its description; three-column game gallery. Compact: expandable navigation, stacked feature, two-column gallery, one column below 520px. Content remains visible without JavaScript. Logical spacing and isolated metadata support direction changes.

Motion thesis: selecting game artwork carries that same image into its destination, making discovery feel like entering a world. Stable, unique view-transition names are authored on covers by the generator. Native cross-document View Transitions provide a 420ms shared-element transition on supporting browsers; regular anchors remain the fallback. No animation library, render loop, shaders, pointer tracking, or added JavaScript. Reduced motion disables cross-document animation. Reduced transparency and increased contrast use opaque navigation. Desktop keyboard focus stays visible.

Images retain explicit dimensions and existing responsive variants. Card, leading-card, feature, and screenshot sizes reflect their layouts; below-fold images stay lazy. Production remains static HTML/CSS/JavaScript on GitHub Pages. Regenerate HTML with node tools/build-site.mjs.

Apple foundations applied to the web: layout.md › Visual hierarchy, accessibility.md, typography.md, color.md, liquid-glass.md › The two layers, motion.md › Best practices. Familiar web anchors and buttons carry interaction.
