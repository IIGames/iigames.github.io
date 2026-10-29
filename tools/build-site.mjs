// Optional authoring tool. GitHub Pages serves the generated HTML directly.
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, value) => fs.writeFileSync(path.join(root, p), value);
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const catalog = JSON.parse(read('Games/catalog.json'));
const nav = [['Home','index.html'],['Games','Games.html'],['Add-Ons','AddOns.html'],['Assets','Assets.html'],['News','News.html'],['About','About.html']];
function shell(title, body, current, prefix = './') {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${escape(title === 'Home' ? 'Games from II Games. Explore our 2D and 3D games, game jam projects, and early experiments.' : title + ' · II Games')}"><title>${escape(title)} · II Games</title><link rel="icon" href="${prefix}Assets/optimized/favicon.png"><link rel="stylesheet" href="${prefix}main.css"><script src="${prefix}JavaScript/site.js" defer></script></head>
<body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="${prefix}index.html" aria-label="II Games home"><img src="${prefix}Assets/optimized/ii-games-logo.png" width="230" height="70" alt="II Games"></a><button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav" aria-label="Main navigation">${nav.map(([label,url]) => `<a href="${prefix}${url}"${current === label ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav></header>
<main id="main" tabindex="-1">${body}</main><footer class="site-footer"><div><p>© II Games · 2020–${new Date().getFullYear()}</p><p>II Games is owned by <a href="mailto:softwaress.company@gmail.com">SoftwareSS</a>.</p></div><div><a href="https://iigamesofficial.itch.io/">itch.io</a><a href="https://gamejolt.com/@IIGamesOfficial/games">Game Jolt</a><a href="${prefix}About.html">About the studio</a></div></footer></body></html>`;
}
function image(src, alt, eager = false) {
 const small = src.replace(/\.jpg$/, '-small.jpg');
 const smallPath = small.replace(/^\.\.\//, '').replace(/^\.\//, '');
 const responsive = small !== src && fs.existsSync(path.join(root,smallPath)) ? ` srcset="${escape(small)} 640w, ${escape(src)} 1440w" sizes="(max-width: 520px) 100vw, (max-width: 1050px) 50vw, 55vw"` : '';
 return `<img src="${escape(src)}"${responsive} alt="${escape(alt)}" width="1280" height="720" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
function card(game, eager = false) {
 return `<article class="game-card"><a href="./Games/${game.slug}.html">${game.cover ? image('./'+game.cover, game.title+' gameplay', eager) : `<div class="type-cover" style="--game-color:${game.color}"><span>${escape(game.title)}</span></div>`}<div class="card-meta"><p>${escape(game.genre)}</p><span>${escape(game.platforms.join(' / '))}</span></div><h2>${escape(game.title)}</h2><p class="card-description">${escape(game.summary)}</p><span class="text-link">View game <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></a></article>`;
}
const cube = catalog.find(g => g.slug === 'CubeGame');
write('index.html', shell('Home', `<section class="home-intro"><h1>Small team.<br>Different worlds.</h1><p>We make simple 2D and 3D games for fun, with a touch of creative spice.</p><a class="button" href="./Games.html">Explore the games</a></section><section class="featured-game" aria-labelledby="featured-title"><a class="feature-art" href="./Games/CubeGame.html">${image('./'+cube.cover,'CubeGame: a cube in a pixel-art world',true)}</a><div class="feature-copy"><p class="game-meta">${cube.genre} · ${cube.platforms.join(' / ')}</p><h2 id="featured-title">CubeGame</h2><p>${cube.summary}</p><a class="button button-light" href="./Games/CubeGame.html">Meet the cube</a></div></section><section class="section"><div class="section-heading"><h2>More worlds to try.</h2><a class="text-link" href="./Games.html">All games</a></div><div class="game-grid">${catalog.filter(g=>['SCP173Simulator','CrystalStealer','NeonShooterMayhem'].includes(g.slug)).map(g=>card(g)).join('')}</div></section><section class="studio-note"><h2>Made for the fun of it.</h2><div><p>II Games is a small game development team. It’s just me for now, with more people joining soon.</p><p>We make games that are familiar and easy to understand, then add something a little different.</p><a class="text-link" href="./About.html">About II Games</a></div></section>`, 'Home'));
const publicGames = catalog.filter(g=>!g.hidden && !g.archive);
write('Games.html', shell('Games', `<header class="page-intro"><h1>Find your<br>next game.</h1><p>Platformers, horror games, and game jam experiments. Pick a world and give it a try.</p></header><div class="game-grid catalog-grid">${publicGames.map((g,i)=>card(g,i===0)).join('')}</div><section class="section"><div class="section-heading"><h2>Earlier experiments</h2></div><div class="game-grid archive-grid">${catalog.filter(g=>g.archive&&!g.hidden).map(g=>card(g)).join('')}</div></section>`, 'Games'));
// A lowercase, unambiguous local entry point; existing Games route remains intact.
write('game.html', shell('Games', `<header class="page-intro"><h1>Our games.</h1><p>Pick a game to see screenshots, details, and download links.</p></header><div class="game-grid">${publicGames.map(g=>card(g)).join('')}</div>`, 'Games'));
for (const game of catalog) {
 const oldFile = `Games/${game.slug}.html`;
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
 write(oldFile, shell(game.title, `<a class="back-link" href="../Games.html">Back to games</a><header class="game-intro"><h1>${escape(game.title)}</h1><p>${escape(game.summary)}</p><div class="game-facts"><span>${escape(game.genre)}</span><span>${escape(game.platforms.join(' / '))}</span>${game.status ? `<span>${escape(game.status)}</span>`:''}</div></header>${game.hidden ? '<p class="notice">This is an archived, hidden project page.</p>':''}<section class="game-stage">${game.cover ? image('../'+game.cover,game.title+' gameplay',true) : `<div class="type-cover" style="--game-color:${game.color}"><span>${escape(game.title)}</span></div>`}<div class="download-panel"><h2>Play ${escape(game.title)}</h2><p>${escape(game.downloadNote || 'Choose a platform below for the game and available downloads.')}</p><div class="actions">${actions || '<p>No public download is available on this page.</p>'}</div>${game.date?`<p class="game-meta">Released ${escape(game.date)}</p>`:''}</div></section>${details?`<section class="game-details section">${details}</section>`:''}${media}<section class="more-games"><h2>Something else to try?</h2><a class="button button-secondary" href="../Games.html">Browse all games</a></section>`, 'Games', '../'));
}
write('Games/catalog.json', JSON.stringify(catalog,null,2)+'\n');
write('About.html',shell('About',`<header class="page-intro"><h1>A small team.<br>A few strange ideas.</h1><p>II Games makes 2D and 3D games for fun. It’s just me for now, with more people joining soon.</p></header><section class="studio-note"><h2>What we make</h2><div><p>We make simple games, but we add some creative spice and turn them into something people can have fun with.</p><p>Our games are made with Unity and occasionally Unreal Engine. We use Blender for 3D models and resources from the web to fill in the gaps.</p></div></section><section class="studio-note"><h2>Get in touch</h2><div><p>Questions, suggestions, or just want to chat? Find II Games on itch.io or Game Jolt.</p><div class="actions"><a class="button" href="https://iigamesofficial.itch.io/">II Games on itch.io</a><a class="button button-secondary" href="https://gamejolt.com/@IIGamesOfficial">II Games on Game Jolt</a></div></div></section>`,'About'));
for(const [file,title,word] of [['AddOns.html','Add-Ons','add-ons'],['Assets.html','Assets','assets']]) {
 write(file,shell(title,`<header class="page-intro"><h1>${title}.</h1><p>There aren’t any ${word} here yet. In the meantime, you can try our games.</p><a class="button" href="./Games.html">Browse games</a></header>`,title));
}
// Preserve existing news/article content; remove obsolete rebuild notices and placeholders.
const newsOld = read('News/1.html');
const article = fs.existsSync(path.join(root,'News/article.html')) ? read('News/article.html') : (newsOld.match(/<p class="news-content">([\s\S]*?)<\/p>/)?.[1] || newsOld.match(/<article class="prose">([\s\S]*?)<\/article>/)?.[1] || '');
write('News/article.html',article);
write('News/1.html',shell('Game development notes',`<a class="back-link" href="../News.html">Back to news</a><header class="page-intro"><h1>Game development notes</h1><p>27 December, 2022</p></header><article class="prose">${article}</article>`,'News','../'));
write('News.html',shell('News',`<header class="page-intro"><h1>From the studio.</h1><p>Notes on making games.</p></header><a class="news-entry" href="./News/1.html"><span>27 December, 2022</span><h2>Game development notes</h2><span class="text-link">Read article</span></a>`,'News'));
write('Teaser.html',shell('Teaser',`<header class="page-intro"><h1>From a teaser<br>to a game.</h1><p>SCP 173 Simulator is available to play. Take a look at the game page for details and downloads.</p><a class="button" href="./Games/SCP173Simulator.html">View SCP 173 Simulator</a></header>`,'Games'));
console.log(`Built home, catalog, ${catalog.length} game pages, and studio pages. No runtime build or API required.`);



