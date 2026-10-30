// Optional authoring tool. GitHub Pages serves the generated HTML directly.
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const siteOrigin = 'https://iigames.github.io';
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, value) => fs.writeFileSync(path.join(root, p), value);
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const absoluteUrl = path => `${siteOrigin}${path.startsWith('/') ? path : `/${path}`}`;
const catalog = JSON.parse(read('Games/catalog.json'));
const gameAccents = {NoMansLand:'#e7ba72', SCP173Simulator:'#ffa1a7', CrystalStealer:'#c1a5ff', NeonShooterMayhem:'#ff9bda', CubeGame:'#54e6ff', StationInvasion:'#80e6cc', SlowlyStrange:'#c1a5ff', 'CubeGame-Alpha':'#ffc58b'};
const nav = [['Home',''],['Games','games'],['Add-Ons','addons'],['Assets','assets'],['News','news'],['About','about']];
function shell(title, body, current, prefix = './', seo = {}) {
  const pageTitle = seo.title || `${title} · II Games`;
  const description = seo.description || `${title} from II Games.`;
  const canonicalUrl = absoluteUrl(seo.canonicalPath || '/');
  const imageUrl = absoluteUrl(seo.image || 'Assets/optimized/ii-games-logo.png');
  const metadata = [
    `<meta name="description" content="${escape(description)}">`,
    seo.noIndex ? '<meta name="robots" content="noindex,follow">' : '',
    `<link rel="canonical" href="${canonicalUrl}">`,
    `<meta property="og:type" content="${seo.type || 'website'}">`,
    `<meta property="og:site_name" content="II Games">`,
    `<meta property="og:title" content="${escape(pageTitle)}">`,
    `<meta property="og:description" content="${escape(description)}">`,
    `<meta property="og:url" content="${canonicalUrl}">`,
    `<meta property="og:image" content="${imageUrl}">`,
    `<meta property="og:image:alt" content="${escape(seo.imageAlt || 'II Games logo')}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escape(pageTitle)}">`,
    `<meta name="twitter:description" content="${escape(description)}">`,
    `<meta name="twitter:image" content="${imageUrl}">`,
    `<meta name="twitter:image:alt" content="${escape(seo.imageAlt || 'II Games logo')}">`,
    seo.structuredData ? `<script type="application/ld+json">${JSON.stringify(seo.structuredData).replaceAll('<', '\\u003c')}</script>` : '',
    seo.headExtra || ''
  ].filter(Boolean).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${metadata}<title>${escape(pageTitle)}</title><link rel="icon" href="${prefix}Assets/optimized/favicon.png"><link rel="stylesheet" href="${prefix}main.css"><script src="${prefix}JavaScript/site.js" defer></script></head>
<body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="${prefix}" aria-label="II Games home"><img src="${prefix}Assets/optimized/ii-games-logo.png" width="230" height="70" alt="II Games"></a><button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav" aria-label="Main navigation">${nav.map(([label,url]) => `<a href="${prefix}${url}"${current === label ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav></header>
<main id="main" tabindex="-1">${body.replace('Small team.<br>Different worlds.', 'Small team.<br><span class="hero-color">Different worlds.</span>')}</main><footer class="site-footer"><div><p>© II Games · 2020–${new Date().getFullYear()}</p></div><div><a href="https://iigamesofficial.itch.io/">itch.io</a><a href="https://gamejolt.com/@IIGamesOfficial/games">Game Jolt</a><a href="${prefix}about">About the studio</a></div></footer></body></html>`;
}
function image(src, alt, eager = false) {
 const small = src.replace(/\.jpg$/, '-small.jpg');
 const smallPath = small.replace(/^\.\.\//, '').replace(/^\.\//, '');
 const responsive = small !== src && fs.existsSync(path.join(root,smallPath)) ? ` srcset="${escape(small)} 640w, ${escape(src)} 1440w" sizes="(max-width: 520px) 100vw, (max-width: 1050px) 50vw, 55vw"` : '';
 return `<img src="${escape(src)}"${responsive} alt="${escape(alt)}" width="1280" height="720" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
function card(game, eager = false) {
 return `<article class="game-card" style="--game-accent:${gameAccents[game.slug] || '#54e6ff'}"><a href="./Games/${game.slug.toLowerCase()}">${game.cover ? image('./'+game.cover, game.title+' gameplay', eager) : `<div class="type-cover" style="--game-color:${game.color}"><span>${escape(game.title)}</span></div>`}<div class="card-meta"><p>${escape(game.genre)}</p><span>${escape(game.platforms.join(' / '))}</span></div><h2>${escape(game.title)}</h2><p class="card-description">${escape(game.summary)}</p><span class="text-link">View game <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></a></article>`;
}
const cube = catalog.find(g => g.slug === 'CubeGame');
const studioStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteOrigin}/#organization`,
      name: 'II Games',
      url: `${siteOrigin}/`,
      logo: absoluteUrl('Assets/optimized/ii-games-logo.png'),
      sameAs: ['https://iigamesofficial.itch.io/', 'https://gamejolt.com/@IIGamesOfficial/games']
    },
    {
      '@type': 'WebSite',
      '@id': `${siteOrigin}/#website`,
      name: 'II Games',
      url: `${siteOrigin}/`,
      publisher: { '@id': `${siteOrigin}/#organization` },
      inLanguage: 'en'
    }
  ]
};
write('index.html', shell('Home', `<section class="home-intro"><h1>Small team.<br>Different worlds.</h1><p>We make simple 2D and 3D games for fun, with a touch of creative spice.</p><a class="button" href="./games">Explore the games</a></section><section class="featured-game" aria-labelledby="featured-title"><a class="feature-art" href="./Games/cubegame">${image('./'+cube.cover,'CubeGame: a cube in a pixel-art world',true)}</a><div class="feature-copy"><p class="game-meta">${cube.genre} · ${cube.platforms.join(' / ')}</p><h2 id="featured-title">CubeGame</h2><p>${cube.summary}</p><a class="button button-light" href="./Games/cubegame">Meet the cube</a></div></section><section class="section"><div class="section-heading"><h2>More worlds to try.</h2><a class="text-link" href="./games">All games</a></div><div class="game-grid">${catalog.filter(g=>['SCP173Simulator','CrystalStealer','NeonShooterMayhem'].includes(g.slug)).map(g=>card(g)).join('')}</div></section><section class="studio-note"><h2>Made for the fun of it.</h2><div><p>II Games is a small game development team. It’s just me for now, with more people joining soon.</p><p>We make games that are familiar and easy to understand, then add something a little different.</p><a class="text-link" href="./about">About II Games</a></div></section>`, 'Home', './', {
  canonicalPath: '/',
  title: 'II Games — Indie 2D and 3D Games',
  description: 'Discover original 2D and 3D indie games from II Games, including platformers, horror games, and creative game jam projects.',
  image: cube.cover,
  imageAlt: 'CubeGame cover art by II Games',
  structuredData: studioStructuredData,
  headExtra: '<meta name="google-site-verification" content="KfsYoNDCpkQhF7QEryFJC1IH0r2B3b7TfLn7jHr0Cg0">'
}));
const publicGames = catalog.filter(g=>!g.hidden && !g.archive);
write('games.html', shell('Games', `<header class="page-intro"><h1>Find your<br>next game.</h1><p>Platformers, horror games, and game jam experiments. Pick a world and give it a try.</p></header><div class="game-grid catalog-grid">${publicGames.map((g,i)=>card(g,i===0)).join('')}</div><section class="section"><div class="section-heading"><h2>Earlier experiments</h2></div><div class="game-grid archive-grid">${catalog.filter(g=>g.archive&&!g.hidden).map(g=>card(g)).join('')}</div></section>`, 'Games', './', {
  canonicalPath: '/games',
  title: 'Indie Games — II Games',
  description: 'Browse 2D and 3D indie games from II Games, from platformers and horror games to shooters and game jam experiments.',
  image: cube.cover,
  imageAlt: 'CubeGame cover art by II Games'
}));
write('game.html', shell('Games', `<header class="page-intro"><h1>Our games.</h1><p>Pick a game to see screenshots, details, and download links.</p></header><div class="game-grid">${publicGames.map(g=>card(g)).join('')}</div>`, 'Games', './', {
  canonicalPath: '/games',
  title: 'Indie Games — II Games',
  description: 'Browse 2D and 3D indie games from II Games, from platformers and horror games to shooters and game jam experiments.',
  image: cube.cover,
  imageAlt: 'CubeGame cover art by II Games',
  noIndex: true
}));
for (const game of catalog) {
 const oldFile = `Games/${game.slug.toLowerCase()}.html`;
 let details = game.details || '';
 if (!details && fs.existsSync(path.join(root,oldFile))) {
   const old = read(oldFile);
   details = old.match(/<div class="game-description-content">([\s\S]*?)<\/div>/)?.[1] || '';
   details = details.replace(/<highlighted-bold-text>(.*?)<\/highlighted-bold-text>/g,'<h2>$1</h2>').replace(/<header-text>(.*?)<\/header-text>/g,'<strong>$1</strong>').replace(/<grey-text>([\s\S]*?)<\/grey-text>/g,'<span>$1</span>');
   // Persist original descriptions and credits so rebuilding never depends on old markup.
   game.details = details;
 }
 // Older descriptions used one paragraph around headings. Keep their words,
 // but use a flow container so heading markup remains valid HTML.
 if (details.includes('<h2>') && /^\s*<p>/.test(details) && /<\/p>\s*$/.test(details)) {
   details = details.replace(/^\s*<p>/,'<div class="legacy-copy">').replace(/<\/p>\s*$/,'</div>');
   game.details = details;
 }
 const actions = (game.links || []).map((link,i)=>`<a class="button${i?' button-secondary':''}" href="${escape(link.url)}">${escape(link.label)}</a>`).join('');
 let media = game.screenshots?.length ? `<section class="screenshots section" aria-labelledby="screenshots-title"><h2 id="screenshots-title">Screenshots</h2><div class="screenshot-grid">${game.screenshots.map((src,i)=>`<a href="../${src}" aria-label="Open ${escape(game.title)} screenshot ${i+1}">${image('../'+src,game.title+' screenshot '+(i+1))}</a>`).join('')}</div></section>` : '';
 if (game.trailer) media = `<section class="section"><h2>Trailer</h2><video controls preload="none" poster="../${escape(game.cover)}" aria-label="${escape(game.title)} trailer"><source src="../${escape(game.trailer)}" type="video/mp4"><a href="../${escape(game.trailer)}">Download the trailer</a></video></section>` + media;
 const canonicalPath = `/Games/${game.slug.toLowerCase()}`;
 const gameDescription = game.hidden || game.archive
   ? `${game.title} is an archived project from II Games. Browse current 2D and 3D games from the studio.`
   : `${game.summary} ${game.genre} game${game.platforms.length ? ` for ${game.platforms.join(', ')}` : ''}.`;
 const gameStructuredData = !game.hidden && !game.archive ? {
   '@context': 'https://schema.org',
   '@type': 'VideoGame',
   name: game.title,
   description: game.summary,
   image: game.cover ? absoluteUrl(game.cover) : undefined,
   url: absoluteUrl(canonicalPath),
   genre: game.genre,
   gamePlatform: game.platforms,
   publisher: { '@id': `${siteOrigin}/#organization` },
   inLanguage: 'en'
 } : undefined;
 write(oldFile, shell(game.title, `<a class="back-link" href="../games">Back to games</a><header class="game-intro"><h1>${escape(game.title)}</h1><p>${escape(game.summary)}</p><div class="game-facts"><span>${escape(game.genre)}</span><span>${escape(game.platforms.join(' / '))}</span>${game.status ? `<span>${escape(game.status)}</span>`:''}</div></header>${game.hidden ? '<p class="notice">This is an archived, hidden project page.</p>':''}<section class="game-stage">${game.cover ? image('../'+game.cover,game.title+' gameplay',true) : `<div class="type-cover" style="--game-color:${game.color}"><span>${escape(game.title)}</span></div>`}<div class="download-panel"><h2>Play ${escape(game.title)}</h2><p>${escape(game.downloadNote || 'Choose a platform below for the game and available downloads.')}</p><div class="actions">${actions || '<p>No public download is available on this page.</p>'}</div>${game.date?`<p class="game-meta">Released ${escape(game.date)}</p>`:''}</div></section>${details?`<section class="game-details section">${details}</section>`:''}${media}<section class="more-games"><h2>Something else to try?</h2><a class="button button-secondary" href="../games">Browse all games</a></section>`, 'Games', '../', {
   canonicalPath,
   title: `Play ${game.title} | II Games`,
   description: gameDescription,
   image: game.cover,
   imageAlt: `${game.title} game cover art`,
   noIndex: Boolean(game.hidden || game.archive),
   structuredData: gameStructuredData
 }));
}
write('Games/catalog.json', JSON.stringify(catalog,null,2)+'\n');
write('about.html',shell('About',`<header class="page-intro"><h1>A small team. A few strange ideas.</h1><p>II Games is a small game studio making 2D and 3D games for fun.</p><p>We like starting with a familiar idea and finding a different way to play with it. That might mean giving a platformer’s cube its own set of tools, or letting you play as the creature people usually try to escape.</p></header><section class="studio-note"><h2>What we make</h2><div><p>Our games cover different genres and styles. <em>CubeGame</em> is a retro-styled platformer where a cube jumps through levels, faces bosses and can place a respawn flag. <em>SCP 173 Simulator</em>, made for GMTK Game Jam 2023, puts you in control of SCP-173 inside a small facility.</p><p><em>No man’s land</em> takes a different approach. It’s a short first-person game about trench warfare in World War I, made in a PS1-inspired style. It tries to portray war as a frightening experience rather than a fantasy.</p><p>Some projects start with a small idea; others come from a game jam. Whatever the starting point, the aim is to make something people can play and enjoy.</p></div></section><section class="studio-note"><h2>How we make games</h2><div><p>We use Unity for our games and occasionally work with Unreal Engine. Blender helps us make 3D models, and we also use resources from the web where they fit a project. Individual game pages include credits for the people and resources that helped make them possible.</p></div></section><section class="studio-note"><h2>Get in touch</h2><div><p>Have a question, a suggestion or feedback on a game? You can find II Games on <a href="https://iigamesofficial.itch.io/">itch.io</a> and <a href="https://gamejolt.com/@IIGamesOfficial">Game Jolt</a>. You can also <a href="https://iigamesofficial.itch.io/no-mans-land">play <em>No man’s land</em> in your browser on itch.io</a>, or <a href="./games">download our other games from their pages</a>.</p></div></section>`,'About','./', {
  canonicalPath: '/about',
  title: 'About II Games — Indie Game Studio',
  description: 'Meet II Games, a small independent studio making 2D and 3D games, from retro platformers to first-person experiments.'
}));
for(const [file,title,word] of [['addons.html','Add-Ons','add-ons'],['assets.html','Assets','assets']]) {
 const seo = title === 'Add-Ons'
   ? { canonicalPath: '/addons', title: 'Game Add-Ons — II Games', description: 'Find add-ons and extras for II Games projects. Browse the games while new add-ons are in development.' }
   : { canonicalPath: '/assets', title: 'Game Assets — II Games', description: 'Explore game assets from II Games. Browse the studio’s games while new assets are in development.' };
 write(file,shell(title,`<header class="page-intro"><h1>${title}.</h1><p>There aren’t any ${word} here yet. In the meantime, you can try our games.</p><a class="button" href="./games">Browse games</a></header>`,title,'./',seo));
}
// Preserve existing news/article content; remove obsolete rebuild notices and placeholders.
const newsOld = read('News/1.html');
const article = fs.existsSync(path.join(root,'News/article.html')) ? read('News/article.html') : (newsOld.match(/<p class="news-content">([\s\S]*?)<\/p>/)?.[1] || newsOld.match(/<article class="prose">([\s\S]*?)<\/article>/)?.[1] || '');
write('News/article.html',article);
write('News/1.html',shell('Game development notes',`<a class="back-link" href="../news">Back to news</a><header class="page-intro"><h1>Game development notes</h1><p>27 December, 2022</p></header><article class="prose">${article}</article>`,'News','../', {
  canonicalPath: '/News/1',
  title: 'Game Development Notes — II Games',
  description: 'Read game development notes from II Games, including thoughts and updates from the studio.',
  type: 'article'
}));
write('news.html',shell('News',`<header class="page-intro"><h1>From the studio.</h1><p>Notes on making games.</p></header><a class="news-entry" href="./News/1"><span>27 December, 2022</span><h2>Game development notes</h2><span class="text-link">Read article</span></a>`,'News','./', {
  canonicalPath: '/news',
  title: 'Game Development News — II Games',
  description: 'Read development notes and news about games and projects from the II Games studio.'
}));
write('teaser.html',shell('Teaser',`<header class="page-intro"><h1>From a teaser<br>to a game.</h1><p>SCP 173 Simulator is available to play. Take a look at the game page for details and downloads.</p><a class="button" href="./Games/scp173simulator">View SCP 173 Simulator</a></header>`,undefined,'./', {
  canonicalPath: '/teaser',
  title: 'SCP 173 Simulator Teaser — II Games',
  description: 'See the SCP 173 Simulator teaser and visit its game page for details and downloads.',
  image: catalog.find(g => g.slug === 'SCP173Simulator').cover,
  imageAlt: 'SCP 173 Simulator cover art',
  noIndex: true
}));

const sitemapPaths = [
  '/', '/games', '/about', '/addons', '/assets', '/news', '/News/1',
  ...publicGames.map(game => `/Games/${game.slug.toLowerCase()}`)
];
const xmlEscape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map(route => `  <url><loc>${xmlEscape(absoluteUrl(route))}</loc></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`);
console.log(`Built home, catalog, ${catalog.length} game pages, and studio pages. No runtime build or API required.`);
