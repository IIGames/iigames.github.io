# II Games design

The site keeps the dark/cyan identity and Nevis lettering. Gameplay is the signature element. Deep violet surfaces echo CubeGame's world, with cyan headings and actions. Each game gets a readable accent drawn from its art: warm amber for No man's land, pink for SCP, lavender for Crystal Stealer, and magenta for Neon Shooter Mayhem.

Use Nevis for display headings and primary actions; use the system sans serif for body copy and navigation. Body starts at 17px, headings scale fluidly up to 96px, and long descriptions stay within 75 characters per line.

Colors: surface `#0b0d1b`, raised surface `#20203d`, text `#f4f1ff`, secondary text `#c2bfd9`, action `#54e6ff`, focus `#ffd75e`, violet `#bea4ff`. Secondary text on raised surfaces is 8.80:1. Feature text on `#30214f` is 10.19:1; cyan is 9.71:1. Focus uses a visible 3px outline. A static violet atmosphere is deliberate; the detector's radial-halo warnings refer to this backdrop rather than a shadow effect.

Desktop: horizontal navigation; split introduction; large gameplay image beside its action; a three-column game grid. Tablet: two columns. Mobile: expandable navigation, stacked feature and game sections, and one-column games below 520px. Content stays visible without JavaScript, including the navigation.

Native HTML anchors and buttons carry interaction. The feature opens once with a 720ms crop/brightness transition, like a level viewport opening. A 600ms companion panel movement completes that moment; mobile omits the spatial panel movement. Menu clipping and arrows confirm interaction, and supported browsers use brief cross-page fades. Reduced motion removes movement and fades; static hover colors remain. No looping animation, autoplay, extra library, or runtime platform embed. Images retain reserved ratios, local responsive variants, and lazy loading below the first view.

Apple references informed the web foundations, rather than native app conventions: `layout.md › Visual hierarchy`, `accessibility.md › Vision` and `Mobility`, `typography.md › Conveying hierarchy`, and `branding.md › Best practices`. Review judged game-first imagery and accurate small-team copy more useful here than a large permanent sidebar.
