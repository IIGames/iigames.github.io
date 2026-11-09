// Optional authoring tool. GitHub Pages serves the generated HTML directly.
import fs from "node:fs";
import path from "node:path";
import {loadNews} from "./news.mjs";
import {newsIndex, newsArticle} from "./news-view.mjs";
import {gameCredits, gameCopyright, legalPages, contactEmail} from "./legal-view.mjs";
const root = path.resolve(import.meta.dirname, "..");
const siteOrigin = "https://iigames.github.io";
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const write = (p, value) => fs.writeFileSync(path.join(root, p), value);
const escape = (text) =>
  String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
const absoluteUrl = (path) =>
  `${siteOrigin}${path.startsWith("/") ? path : `/${path}`}`;
const catalog = JSON.parse(read("games/catalog.json"));
// Validate the complete news input before writing any generated pages.
const news = loadNews(root);
const nav = [
  ["Home", ""],
  ["Games", "games"],
  ["Add-Ons", "addons"],
  ["Assets", "assets"],
  ["News", "news"],
  ["Newsletter", "newsletter"],
  ["About", "about"],
  ["Press kit", "press"],
];
function shell(title, body, current, prefix = "./", seo = {}) {
  const pageTitle = seo.title || `${title} · II Games Studio`;
  const description = seo.description || `${title} from II Games Studio.`;
  const canonicalUrl = absoluteUrl(seo.canonicalPath || "/");
  const imageUrl = absoluteUrl(
    seo.image || "assets/optimized/ii-games-social.jpg",
  );
  const metadata = [
    `<meta name="description" content="${escape(description)}">`,
    seo.keywords ? `<meta name="keywords" content="${escape(seo.keywords)}">` : "",
    seo.noIndex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow">',
    `<link rel="canonical" href="${canonicalUrl}">`,
    `<meta property="og:type" content="${seo.type || "website"}">`,
    `<meta property="og:site_name" content="II Games Studio">`,
    `<meta property="og:title" content="${escape(pageTitle)}">`,
    `<meta property="og:description" content="${escape(description)}">`,
    `<meta property="og:url" content="${canonicalUrl}">`,
    `<meta property="og:image" content="${imageUrl}">`,
    `<meta property="og:image:alt" content="${escape(seo.imageAlt || "II Games Studio — independent games")}">`,
    ...(imageUrl.endsWith('ii-games-social.jpg') ? ['<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">', '<meta property="og:image:type" content="image/jpeg">'] : []),
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escape(pageTitle)}">`,
    `<meta name="twitter:description" content="${escape(description)}">`,
    `<meta name="twitter:image" content="${imageUrl}">`,
    `<meta name="twitter:image:alt" content="${escape(seo.imageAlt || "II Games Studio — independent games")}">`,
    seo.structuredData
      ? `<script type="application/ld+json">${JSON.stringify(seo.structuredData).replaceAll("<", "\\u003c")}</script>`
      : "",
    seo.headExtra || "",
  ]
    .filter(Boolean)
    .join("");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><script src="${prefix}javascript/theme.js"></script>${metadata}<title>${escape(pageTitle)}</title><link rel="icon" href="${prefix}assets/optimized/favicon.png"><link rel="stylesheet" href="${prefix}main.css"><script src="${prefix}javascript/site.js" defer></script>${current === "Home" ? `<link rel="stylesheet" href="${prefix}landing.css">` : ""}${current === "News" ? `<link rel="stylesheet" href="${prefix}news.css"><script src="${prefix}javascript/news.js" defer></script>` : ""}<link rel="stylesheet" href="${prefix}theme.css"></head>
<body class="${current === "Home" ? "landing" : "page-" + (current || "teaser").toLowerCase().replaceAll(" ", "-")}"><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="${prefix}" aria-label="II Games home"><img src="${prefix}assets/optimized/ii-games-logo.png" width="230" height="70" alt="II Games"></a><button class="nav-toggle" aria-expanded="false" aria-controls="nav-panel">Menu</button><div class="nav-backdrop" hidden></div><div class="nav-panel" id="nav-panel"><div class="nav-panel-top"><span>II Games</span><button class="nav-close" type="button" aria-label="Close menu"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M6 18 18 6"/></svg></button></div><nav id="site-nav" aria-label="Main navigation">${nav.map(([label, url]) => `<a href="${prefix}${url}"${current === label ? ' aria-current="page"' : ""}>${label}</a>`).join("")}<button class="theme-toggle" type="button" data-theme-toggle hidden aria-label="Switch to light mode"><svg class="theme-sun" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg><svg class="theme-moon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z"/></svg></button></nav><div class="nav-panel-footer"><a href="https://iigamesofficial.itch.io/">itch.io</a><a href="https://gamejolt.com/@IIGamesOfficial/games">Game Jolt</a></div></div></header>
<main id="main" tabindex="-1">${body}</main><footer class="site-footer"><div><p>© II Games Studio · 2020–${new Date().getFullYear()}</p></div><div><a href="https://iigamesofficial.itch.io/">itch.io</a><a href="https://gamejolt.com/@IIGamesOfficial/games">Game Jolt</a><a href="${prefix}about">About the studio</a><a href="${prefix}press">Press kit</a><a href="${prefix}newsletter">Newsletter</a></div><div class="footer-legal"><a href="${prefix}privacy">Privacy Policy</a><a href="${prefix}terms">Terms of Use / Licensing</a><a href="${prefix}contact">Contact and legal notice</a><a href="mailto:${contactEmail}">${contactEmail}</a></div></footer></body></html>`;
}
function image(src, alt, eager = false) {
  const small = src.replace(/\.jpg$/, "-small.jpg");
  const smallPath = small.replace(/^\.\.\//, "").replace(/^\.\//, "");
  const responsive =
    small !== src && fs.existsSync(path.join(root, smallPath))
      ? ` srcset="${escape(small)} 640w, ${escape(src)} 1440w" sizes="(max-width: 520px) 100vw, (max-width: 1050px) 50vw, 55vw"`
      : "";
  return `<img src="${escape(src)}"${responsive} alt="${escape(alt)}" width="1280" height="720" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
function card(game, eager = false) {
  return `<article class="game-card" data-platforms="${escape(game.platforms.join(","))}"><a href="./games/${game.slug.toLowerCase()}">${game.cover ? image("./" + game.cover, game.title + " gameplay", eager) : `<div class="type-cover" ><span>${escape(game.title)}</span></div>`}<div class="card-meta"><p>${escape(game.genre)}</p><span>${escape(game.platforms.join(" / "))}</span></div><h2>${escape(game.title)}</h2><p class="card-description">${escape(game.summary.replaceAll("!", "."))}</p><span class="text-link">View game <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></a></article>`;
}
const cube = catalog.find((g) => g.slug === "CubeGame");
const studioStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteOrigin}/#organization`,
      name: "II Games Studio",
      alternateName: ["II Games", "IIGames", "II Games Official"],
      url: `${siteOrigin}/`,
      logo: absoluteUrl("assets/optimized/ii-games-logo.png"),
      foundingDate: "2020",
      description:
        "II Games Studio is an independent game development studio making 2D platformers and atmospheric horror games.",
      sameAs: [
        "https://iigamesofficial.itch.io/",
        "https://gamejolt.com/@IIGamesOfficial/games",
        "https://substack.com/@iigames",
        "https://iigames.substack.com/",
        "https://www.tiktok.com/@iigamesstudio",
        "https://www.youtube.com/@iigamesstudio",
        "https://x.com/IIGamesOfficial",
        "https://www.instagram.com/iigamesstudio",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteOrigin}/#website`,
      name: "II Games Studio",
      alternateName: ["II Games", "IIGames", "II Games Official"],
      url: `${siteOrigin}/`,
      publisher: { "@id": `${siteOrigin}/#organization` },
      inLanguage: "en",
    },
  ],
};
write(
  "index.html",
  shell(
    "Home",
    `
<section class="studio-hero" aria-labelledby="landing-title">
  <video class="hero-video" muted loop playsinline preload="none" poster="./assets/optimized/neon-platforms.jpg" aria-hidden="true" tabindex="-1" data-hero-video><source data-src="./assets/ii-games-hero.mp4" type="video/mp4"></video>
  <div class="hero-copy"><h1 id="landing-title">II Games Studio</h1><p class="hero-tagline">Fast platformers. Unsettling worlds.</p><p>II Games Studio makes 2D platformers and atmospheric horror games built around a clear mechanic.</p><a class="button" href="./games">Explore the games <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></div>
  <button class="hero-pause" type="button" hidden aria-label="Pause background video">Pause video</button>
</section>
<section class="world-section" aria-labelledby="featured-title"><div class="world-stage featured-game">
  <a class="feature-art" href="./games/cubegame" aria-label="View CubeGame">${image(
    "./" + cube.cover,
    "CubeGame: a cube in a neon pixel-art world",
    true,
  )
    .replace('width="1280" height="720"', 'width="1440" height="674"')
    .replace(/sizes="[^"]*"/, 'sizes="(max-width: 1440px) 92vw, 1280px"')}</a>
  <div class="feature-copy"><div><div class="world-caption"><span class="checkpoint-meta"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 21V3m0 1h13l-3 4 3 4H5"/></svg>2D platformer</span><span>Windows</span></div><h2 id="featured-title">CubeGame</h2><p class="feature-tagline">Set the flag. Take on the bosses</p></div><div class="feature-description"><p>Jump through levels, take on bosses and place a flag to choose where you respawn.</p><a class="button button-light" href="./games/cubegame">View CubeGame <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></div></div>
</div></section>
<section class="gameplay-carousel section" data-carousel aria-roledescription="carousel" aria-labelledby="carousel-title"><div class="section-heading"><h2 id="carousel-title">Gameplay screenshots</h2><div class="carousel-controls" hidden><button type="button" class="icon-button carousel-prev" aria-label="Previous screenshot"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button><output class="carousel-count" aria-live="polite">1 / 5</output><button type="button" class="icon-button carousel-next" aria-label="Next screenshot"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button></div></div><div class="carousel-viewport" tabindex="0" aria-label="Gameplay screenshots. Use the left and right arrow keys to browse."><figure class="carousel-slide" role="group" aria-roledescription="slide" aria-label="1 of 5"><a href="./games/cubegame"><img src="./assets/optimized/CubeGame-shot-7.jpg" alt="CubeGame boss encounter above a series of platforms" width="1280" height="720" loading="lazy" decoding="async"></a><figcaption><div><h3>CubeGame</h3><p>2D · Platformer · Story</p></div><a class="text-link" href="./games/cubegame">View game <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></figcaption></figure><figure class="carousel-slide" role="group" aria-roledescription="slide" aria-label="2 of 5"><a href="./games/nomansland"><img src="./assets/optimized/NoMansLand-shot-1.jpg" alt="No man's land gameplay screenshot" width="1280" height="720" loading="lazy" decoding="async"></a><figcaption><div><h3>No man's land</h3><p>3D · First-person shooter</p></div><a class="text-link" href="./games/nomansland">View game <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></figcaption></figure><figure class="carousel-slide" role="group" aria-roledescription="slide" aria-label="3 of 5"><a href="./games/crystalstealer"><img src="./assets/optimized/CrystalStealer-shot-1.jpg" alt="Crystal Stealer gameplay screenshot" width="1280" height="720" loading="lazy" decoding="async"></a><figcaption><div><h3>Crystal Stealer</h3><p>3D · Platformer</p></div><a class="text-link" href="./games/crystalstealer">View game <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></figcaption></figure><figure class="carousel-slide" role="group" aria-roledescription="slide" aria-label="4 of 5"><a href="./games/scp173simulator"><img src="./assets/optimized/SCP173Simulator-shot-1.jpg" alt="SCP 173 Simulator gameplay screenshot" width="1280" height="720" loading="lazy" decoding="async"></a><figcaption><div><h3>SCP 173 Simulator</h3><p>3D · Horror · Simulation</p></div><a class="text-link" href="./games/scp173simulator">View game <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></figcaption></figure><figure class="carousel-slide" role="group" aria-roledescription="slide" aria-label="5 of 5"><a href="./games/neonshootermayhem"><img src="./assets/optimized/NeonShooterMayhem-shot-1.jpg" alt="Neon Shooter Mayhem gameplay screenshot" width="1280" height="720" loading="lazy" decoding="async"></a><figcaption><div><h3>Neon Shooter Mayhem</h3><p>2D · Top-down shooter</p></div><a class="text-link" href="./games/neonshootermayhem">View game <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></figcaption></figure></div></section>
<section class="section world-selection" aria-labelledby="worlds-title"><div class="section-heading"><h2 id="worlds-title">More games</h2><a class="text-link" href="./games">All games <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></div><div class="game-grid">${catalog
      .filter((g) =>
        ["SCP173Simulator", "NoMansLand", "SlowlyStrange"].includes(
          g.slug,
        ),
      )
      .map((g) =>
        card(g)
          .replace(/sizes="[^"]*"/, 'sizes="(max-width: 760px) 90vw, 440px"')
          .replaceAll("<h2>", "<h3>")
          .replaceAll("</h2>", "</h3>"),
      )
      .join("")}</div></section>
<section class="studio-note"><div><h2>About II Games Studio</h2></div><div class="studio-copy"><p>Founded in 2020, II Games Studio is an independent game development studio focused on fast-paced gameplay and striking atmospheres.</p><p>The studio builds around a clear mechanic, from player-placed checkpoints to horror seen through the creature’s eyes.</p><a class="text-link" href="./about">About II Games Studio <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></div></section>
<section class="studio-note"><div><h2>Studio newsletter</h2></div><div class="studio-copy"><p>Read the II Games Studio newsletter on Substack. Subscribe there to receive future posts by email.</p><a class="text-link" href="./newsletter">Read the newsletter <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></div></section>
<section class="landing-outro"><h2>Find your next game</h2><a class="button" href="./games">Browse all games <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a><a class="back-to-top text-link" href="#main">Back to top <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20V4m-6 6 6-6 6 6"/></svg></a></section>`,
    "Home",
    "./",
    {
      canonicalPath: "/",
      title:
        "II Games Studio | Official Site – Indie 2D Platformer & Horror Games",
      description:
        "II Games Studio is an independent game developer founded in 2020. Play mechanics-driven 2D platformers and atmospheric horror games.",
      keywords:
        "II Games Studio, II Games, IIGames, II Games Official, II-Games, indie game studio, 2D platformers, atmospheric horror games, indie games",
      image: "assets/optimized/ii-games-social.jpg",
      imageAlt: "II Games Studio — independent games",
      structuredData: studioStructuredData,
      headExtra:
        '<meta name="google-site-verification" content="KfsYoNDCpkQhF7QEryFJC1IH0r2B3b7TfLn7jHr0Cg0">',
    },
  ),
);
const publicGames = catalog.filter((g) => !g.hidden && !g.archive);
write(
  "games.html",
  shell(
    "Games",
    `<header class="page-intro catalog-intro"><h1>The games</h1><p>Browse the games below, or filter by the platform you play on.</p></header><section class="catalog-library" aria-label="Game catalog"><div class="catalog-toolbar"><div class="platform-filters" role="group" aria-label="Filter games by platform" hidden><button type="button" data-platform="all" aria-pressed="true">All games</button><button type="button" data-platform="Browser" aria-pressed="false">Browser</button><button type="button" data-platform="Windows" aria-pressed="false">Windows</button><button type="button" data-platform="macOS" aria-pressed="false">macOS</button></div><p class="catalog-count" role="status">${publicGames.length} games</p></div><div class="game-grid catalog-grid">${publicGames.map((g, i) => card(g, i === 0)).join("")}</div><p class="catalog-empty notice" hidden>No games for this platform yet. Choose another platform to see more games.</p></section><section class="section"><div class="section-heading"><h2>Earlier experiments</h2></div><div class="game-grid archive-grid">${catalog
      .filter((g) => g.archive && !g.hidden)
      .map((g) => card(g))
      .join("")}</div></section>`,
    "Games",
    "./",
    {
      canonicalPath: "/games",
      title: "Games — II Games Studio",
      description:
        "Play 2D and 3D games from II Games Studio. Find platformers and horror games, plus arcade prototypes in the earlier experiments archive.",
      image: "assets/optimized/ii-games-social.jpg",
      imageAlt: "II Games Studio — independent games",
    },
  ),
);
write(
  "game.html",
  shell(
    "Games",
    `<header class="page-intro"><h1>The games</h1><p>Choose a game for screenshots and play links.</p></header><div class="game-grid">${publicGames.map((g) => card(g)).join("")}</div>`,
    "Games",
    "./",
    {
      canonicalPath: "/games",
      title: "Games — II Games Studio",
      description:
        "Play 2D and 3D games from II Games Studio. Find platformers and horror games, plus arcade prototypes in the earlier experiments archive.",
      image: "assets/optimized/ii-games-social.jpg",
      imageAlt: "II Games Studio — independent games",
      noIndex: true,
    },
  ),
);
for (const game of catalog) {
  const oldFile = `games/${game.slug.toLowerCase()}.html`;
  let details = game.details || "";
  if (!details && fs.existsSync(path.join(root, oldFile))) {
    const old = read(oldFile);
    details =
      old.match(
        /<div class="game-description-content">([\s\S]*?)<\/div>/,
      )?.[1] || "";
    details = details
      .replace(
        /<highlighted-bold-text>(.*?)<\/highlighted-bold-text>/g,
        "<h2>$1</h2>",
      )
      .replace(/<header-text>(.*?)<\/header-text>/g, "<strong>$1</strong>")
      .replace(/<grey-text>([\s\S]*?)<\/grey-text>/g, "<span>$1</span>");
    // Persist original descriptions and credits so rebuilding never depends on old markup.
    game.details = details;
  }
  // Older descriptions used one paragraph around headings. Keep their words,
  // but use a flow container so heading markup remains valid HTML.
  if (
    details.includes("<h2>") &&
    /^\s*<p>/.test(details) &&
    /<\/p>\s*$/.test(details)
  ) {
    details = details
      .replace(/^\s*<p>/, '<div class="legacy-copy">')
      .replace(/<\/p>\s*$/, "</div>");
    game.details = details;
  }
  const actions = (game.links || [])
    .map(
      (link, i) =>
        `<a class="button${i ? " button-secondary" : ""}" href="${escape(link.url)}">${escape(link.label)}</a>`,
    )
    .join("");
  let media = game.screenshots?.length
    ? `<section class="screenshots section" aria-labelledby="screenshots-title"><h2 id="screenshots-title">Screenshots</h2><div class="screenshot-grid">${game.screenshots.map((src, i) => `<a href="../${src}" aria-label="Open ${escape(game.title)} screenshot ${i + 1}">${image("../" + src, game.title + " screenshot " + (i + 1))}</a>`).join("")}</div></section>`
    : "";
  if (game.trailer)
    media =
      `<section class="section"><h2>Trailer</h2><video controls preload="none" poster="../${escape(game.cover)}" aria-label="${escape(game.title)} trailer"><source src="../${escape(game.trailer)}" type="video/mp4"><a href="../${escape(game.trailer)}">Download the trailer</a></video></section>` +
      media;
  const canonicalPath = `/games/${game.slug.toLowerCase()}`;
  const gameDescription =
    game.hidden || game.archive
      ? `${game.title} is an archived project from II Games Studio. Play this earlier experiment or browse the studio’s current game selection.`
      : `${game.summary} ${game.genre} game${game.platforms.length ? ` for ${game.platforms.join(", ")}` : ""}.`;
  const gameStructuredData =
    !game.hidden
      ? {
          "@context": "https://schema.org",
          "@type": "VideoGame",
          name: game.title,
          description: game.summary,
          image: game.cover ? absoluteUrl(game.cover) : undefined,
          url: absoluteUrl(canonicalPath),
          genre: game.genre,
          gamePlatform: game.platforms,
          publisher: { "@id": `${siteOrigin}/#organization` },
          inLanguage: "en",
        }
      : undefined;
  write(
    oldFile,
    shell(
      game.title,
      `<a class="back-link" href="../games">Back to games</a><header class="game-intro"><h1>${escape(game.title)}</h1><p>${escape(game.summary)}</p><div class="game-facts"><span>${escape(game.genre)}</span><span>${escape(game.platforms.join(" / "))}</span>${game.status ? `<span>${escape(game.status)}</span>` : ""}</div></header>${game.hidden ? '<p class="notice">This is an archived, hidden project page.</p>' : ""}<section class="game-stage">${game.cover ? image("../" + game.cover, game.title + " gameplay", true) : `<div class="type-cover" ><span>${escape(game.title)}</span></div>`}<div class="download-panel"><h2>Play ${escape(game.title)}</h2><p>${escape(game.downloadNote || "Choose a platform below for the game and available downloads.")}</p><div class="actions">${actions || "<p>No public download is available on this page.</p>"}</div>${game.date ? `<p class="game-meta">Released ${escape(game.date)}</p>` : ""}</div></section>${details ? `<section class="game-details section">${details}</section>` : ""}${media}${gameCredits(game)}<section class="more-games"><h2>More from the studio</h2><a class="button button-secondary" href="../games">Browse all games</a></section>${gameCopyright}`,
      "Games",
      "../",
      {
        canonicalPath,
        title: `Play ${game.title} | II Games Studio`,
        description: gameDescription,
        image: game.cover,
        imageAlt: `${game.title} game cover art`,
        noIndex: Boolean(game.hidden),
        structuredData: gameStructuredData,
      },
    ),
  );
}
write("games/catalog.json", JSON.stringify(catalog, null, 2) + "\n");
const studioArt = [
  ["city-at-night", "City at night", "Concrete architecture above a city skyline under a cloudy night sky"],
  ["red-room", "Red room", "A distorted red-lit room with a figure behind vertical bars"],
  ["neon-platforms", "Neon platforms", "A purple forest platforming scene with bright pink hazards"],
  ["facility-corridor", "Facility corridor", "A dim tiled corridor with exposed pipes and harsh overhead light"],
  ["red-lit-stairwell", "Stairwell lighting", "A red-lit stairwell beside a green exit light"],
  ["creature-study", "Creature study", "A shadowed creature with bright eyes in a dark room"],
  ["light-in-the-dark", "Light in the dark", "A narrow beam of light across wooden floorboards"]
];
function artFigure([slug,title,alt]) {
 return `<figure><a href="./assets/optimized/${slug}.jpg" aria-label="Open ${escape(title)}"><img src="./assets/optimized/${slug}.jpg" srcset="./assets/optimized/${slug}-small.jpg 640w, ./assets/optimized/${slug}.jpg 1600w" sizes="(max-width: 760px) 92vw, 48vw" alt="${escape(alt)}" width="1600" height="900" loading="lazy" decoding="async"></a><figcaption>${title}</figcaption></figure>`;
}
write(
  "about.html",
  shell(
    "About",
    `<header class="page-intro"><h1>About II Games Studio</h1><p>Founded in 2020, II Games Studio is an independent game development studio dedicated to fast-paced gameplay and striking atmospheres.</p><p>The studio starts with a mechanic and builds a world around it. A respawn flag changes the route through a platformer. A horror game puts the creature in the player’s hands.</p></header>
<section class="section art-section" aria-labelledby="showcase-title"><div class="section-heading"><h2 id="showcase-title">Showcase</h2><p>Selected work from the studio.</p></div><div class="studio-art-grid showcase-grid">${studioArt.slice(0,3).map(artFigure).join("")}</div></section>
<section class="studio-note"><h2>What the studio makes</h2><div><p><em>CubeGame</em> is a retro-styled platformer with player-placed checkpoints and boss fights. <em>SCP 173 Simulator</em> reverses the usual horror perspective: the player controls SCP-173 inside a containment facility.</p><p><em>No man’s land</em> brings PS1-inspired graphics to the trenches of World War I. Its focus is the fear of combat. <em>Slowly Strange</em> finds horror in an everyday routine.</p></div></section>
<section class="section art-section" aria-labelledby="concepts-title"><div class="section-heading"><h2 id="concepts-title">Concepts</h2><p>Environment and lighting studies. Work in progress.</p></div><div class="studio-art-grid concepts-grid">${studioArt.slice(3).map(artFigure).join("")}</div></section>
<section class="studio-note"><h2>How we make games</h2><div><p>The studio works primarily in Unity, with Unreal Engine for selected projects and Blender for 3D models. Game pages credit collaborators and external resources.</p><p>Game jams are a place to test a mechanic under a deadline. Earlier prototypes remain playable in the <a href="./games">game catalog</a>.</p></div></section>
<section class="studio-note"><h2>Contact and coverage</h2><div><p>For questions and feedback, contact II Games Studio through <a href="https://iigamesofficial.itch.io/">itch.io</a> or <a href="https://gamejolt.com/@IIGamesOfficial">Game Jolt</a>.</p><p>Writing about a game or planning a video? The <a href="./press">press kit</a> has studio facts and downloadable media.</p></div></section>`,
    "About",
    "./",
    {
      canonicalPath: "/about",
      title: "About — II Games Studio",
      description:
        "Founded in 2020, II Games Studio is an independent game development studio dedicated to fast-paced gameplay and striking atmospheres. See selected work and concepts.",
    },
  ),
);
write("newsletter.html", shell("Newsletter", `
<header class="page-intro"><h1>The II Games Studio newsletter</h1><p>Follow II Games Studio on Substack. Read the newsletter and subscribe for future posts.</p><div><a class="button" href="https://iigames.substack.com/?utm_campaign=pub&amp;utm_medium=web">Read and subscribe on Substack <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></div></header>
<section class="studio-note"><h2>Stay in touch</h2><div><p>Read posts on Substack or subscribe there to receive the newsletter by email.</p><p>For game releases and development notes on this site, visit <a href="./news">studio news</a>. Ready to play? <a href="./games">Browse the games</a>.</p></div></section>`, "Newsletter", "./", {
 canonicalPath: "/newsletter", title: "Newsletter — II Games Studio",
 description: "Read the II Games Studio newsletter on Substack. Subscribe to receive future posts by email, or browse studio news and games on the website."
}));
const pressKitBytes = fs.statSync(path.join(root, "assets/press-kit/ii-games-studio-press-kit.zip")).size;
write("press.html", shell("Press kit", `
<header class="page-intro"><h1>II Games Studio<br>Press kit</h1><p>Studio facts and original-resolution game media for journalists and content creators.</p><div><a class="button" href="./assets/press-kit/ii-games-studio-press-kit.zip" download>Download press kit · ${Math.ceil(pressKitBytes / 1048576)} MB</a><p class="press-download-note">ZIP · Transparent logos, fact sheet, screenshots and video.</p></div></header>
<section class="studio-note"><h2>Studio facts</h2><div><dl class="press-facts"><div><dt>Name</dt><dd>II Games Studio (also known as II Games)</dd></div><div><dt>Founded</dt><dd>2020</dd></div><div><dt>Focus</dt><dd>Mechanics-driven platformers and atmospheric horror</dd></div><div><dt>Website</dt><dd><a href="https://iigames.github.io/">iigames.github.io</a></dd></div><div><dt>Operator</dt><dd>Iliya Soleimani</dd></div><div><dt>Location</dt><dd>Iran</dd></div><div><dt>Contact</dt><dd><a href="mailto:${contactEmail}">${contactEmail}</a></dd></div></dl><p>Founded in 2020, II Games Studio is an independent game development studio dedicated to fast-paced gameplay and striking atmospheres.</p><a class="text-link" href="./assets/press-kit/studio-fact-sheet.txt" download>Download the fact sheet</a></div></section>
<section class="section"><div class="section-heading"><h2>Studio logos</h2><p>Transparent PNGs for light and dark backgrounds.</p></div><div class="press-logos"><a href="./assets/press-kit/logos/ii-games-wordmark-white-transparent.png" download><div class="logo-preview"><img src="./assets/press-kit/logos/ii-games-wordmark-white-transparent.png" alt="II Games white wordmark" width="1920" height="1080" loading="lazy"></div><span>White wordmark · PNG</span></a><a href="./assets/press-kit/logos/ii-games-wordmark-black-transparent.png" download><div class="logo-preview logo-preview-light"><img src="./assets/press-kit/logos/ii-games-wordmark-black-transparent.png" alt="II Games black wordmark" width="1920" height="1080" loading="lazy"></div><span>Light theme logo (black) · PNG</span></a></div><p>The ZIP also includes transparent symbol logos and the supplied studio logo variants.</p></section>
<section class="studio-note"><h2>Game media</h2><div><p>The ZIP contains original-resolution screenshots for ${catalog.filter(g=>!g.hidden).map(g=>escape(g.title)).join(", ")}.</p><p>Video includes the CubeGame and CubeGame Alpha trailers, plus a Slowly Strange gameplay clip. Screenshots retain their source resolution; no images have been upscaled.</p><p>For platform links and individual game credits, visit the <a href="./games">game catalog</a>. Please credit II Games Studio when using these materials in coverage.</p></div></section>`, "Press kit", "./", {
 canonicalPath: "/press", title: "Press kit — II Games Studio",
 description: "Download the II Games Studio press kit: transparent studio logos, a fact sheet, original-resolution game screenshots and trailers for press and content creators."
}));
for (const [file, title, word] of [
  ["addons.html", "Add-Ons", "add-ons"],
  ["assets.html", "Assets", "assets"],
]) {
  const seo =
    title === "Add-Ons"
      ? {
          canonicalPath: "/addons",
          title: "Game add-ons — II Games Studio",
          description:
            "Find add-ons and extras for II Games Studio projects. This page will list published add-ons; playable games are available in the catalog.",
        }
      : {
          canonicalPath: "/assets",
          title: "Game assets — II Games Studio",
          description:
            "Find game assets from II Games Studio. This page will list published resources; the game catalog has playable releases and prototypes.",
        };
  write(
    file,
    shell(
      title,
      `<header class="page-intro"><h1>${title}.</h1><p>Resources from II Games Studio.</p></header><section class="empty-state"><div><h2>${title} are not available yet</h2><p>Published ${word} will appear here. Visit the game catalog for playable releases and prototypes.</p><a class="button" href="./games">Browse games <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></div><a class="empty-art" href="./games/cubegame" aria-label="Explore CubeGame">${image("./" + cube.cover, "CubeGame gameplay")}</a></section>`,
      title,
      "./",
      seo,
    ),
  );
}
// News pages are generated from JSON and Markdown, never from generated HTML.
for (const post of news) {
  const canonicalPath = '/news/' + post.slug;
  write('news/' + post.slug + '.html', shell(post.title,newsArticle(post,news),'News','../',{
    canonicalPath, title:post.title+' — II Games Studio', description:post.summary, type:'article',
    image:post.cover.image, imageAlt:post.cover.alt,
    headExtra:'<meta property="article:published_time" content="'+post.date+'T00:00:00Z">',
    structuredData:{'@context':'https://schema.org','@type':'NewsArticle',headline:post.title,
      description:post.summary,datePublished:post.date,author:{'@type':'Organization',name:post.author},
      publisher:{'@type':'Organization',name:'II Games Studio',url:siteOrigin},
      mainEntityOfPage:absoluteUrl(canonicalPath),articleSection:post.categoryLabel,
      image:absoluteUrl(post.cover.image || 'assets/optimized/ii-games-logo.png')}
  }));
}
write('news.html',shell('News',newsIndex(news),'News','./',{
  canonicalPath:'/news',title:'News — II Games Studio',
  description:'Release news and development notes from II Games Studio. Read about the mechanics behind the games and browse the studio archive.'
}));
write(
  "teaser.html",
  shell(
    "Teaser",
    `<header class="page-intro"><h1>Play SCP 173 Simulator</h1><p>Control SCP-173 inside a containment facility. The game page has downloads and gameplay details.</p><a class="button" href="./games/scp173simulator">View SCP 173 Simulator</a></header>`,
    undefined,
    "./",
    {
      canonicalPath: "/teaser",
      title: "SCP 173 Simulator teaser — II Games Studio",
      description:
        "See the SCP 173 Simulator teaser and visit its game page for details and downloads.",
      image: catalog.find((g) => g.slug === "SCP173Simulator").cover,
      imageAlt: "SCP 173 Simulator cover art",
      noIndex: true,
    },
  ),
);

for (const page of legalPages) {
  write(page.route + ".html", shell(page.title, page.body, "Legal", "./", {
    canonicalPath: "/" + page.route,
    title: page.title + " — II Games Studio",
    description: page.description,
  }));
}

const sitemapPaths = [
  "/",
  "/games",
  "/about",
  "/press",
  "/addons",
  "/assets",
  "/news",
  "/newsletter",
  ...legalPages.map(page => "/" + page.route),
  ...news.map(post => `/news/${post.slug}`),
  ...catalog.filter(game => !game.hidden).map((game) => `/games/${game.slug.toLowerCase()}`),
];
const xmlEscape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
const sitemapDate = "2026-11-09";
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map((route) => `  <url>\n    <loc>${xmlEscape(absoluteUrl(route))}</loc>\n    <lastmod>${sitemapDate}</lastmod>\n  </url>`).join("\n")}\n</urlset>\n`,
);
write(
  "robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`,
);
console.log(
  `Built home, catalog, ${catalog.length} game pages, and studio pages. No runtime build or API required.`,
);
