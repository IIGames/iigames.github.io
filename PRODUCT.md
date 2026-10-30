# II Games

II Games is a small game development team, currently one person with collaborators expected to join. The website helps players discover games, read about them, and reach verified play/download destinations.

The site is static HTML, CSS, and JavaScript hosted on GitHub Pages. Existing game URLs, credits, and download destinations must stay available. Local previews use `game.html`; each game also has a direct `Games/<slug>.html` page.

The writing is direct and informal, drawn from the existing site and game descriptions. Do not invent release dates, collaborators, platforms, or game capabilities.

The catalog is `Games/catalog.json`. `node tools/build-site.mjs` regenerates committed lowercase HTML filenames for authoring; visitors and GitHub Pages do not need Node or a build step.
