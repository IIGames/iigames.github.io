# II Games design

The site keeps the existing navy/cyan identity and Nevis lettering. Gameplay is the signature element. A bright cyan feature panel gives CubeGame a prominent home, while the remaining interface stays quiet.

Use Nevis for display headings and primary actions; use the system sans serif for body copy and navigation. Body starts at 17px, headings scale fluidly up to 96px, and long descriptions stay within 75 characters per line.

Colors: surface `#08141e`, raised surface `#122631`, text `#eef5ef`, secondary text `#b1c4c9`, action `#54e6ff`, focus `#ffd75e`. On the raised surface, text contrast is approximately 14:1 and secondary text approximately 8.5:1. Cyan panels use the dark surface color for text. Focus uses a visible 3px outline.

Desktop: horizontal navigation; split introduction; large gameplay image beside its action; a three-column game grid. Tablet: two columns. Mobile: expandable navigation, stacked feature and game sections, and one-column games below 520px. Content stays visible without JavaScript, including the navigation.

Native HTML anchors and buttons carry interaction. No autoplay, decorative blur, animated backgrounds, or runtime platform embeds. Reduced motion disables transitions. Images have reserved ratios, local responsive variants, and lazy loading below the first view.

Apple references informed the web foundations, rather than native app conventions: `layout.md › Visual hierarchy`, `accessibility.md › Vision` and `Mobility`, `typography.md › Conveying hierarchy`, and `branding.md › Best practices`. Review judged game-first imagery and accurate small-team copy more useful here than a large permanent sidebar.
