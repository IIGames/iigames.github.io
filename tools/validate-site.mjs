import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const siteOrigin='https://iigames.github.io';
const catalog=JSON.parse(fs.readFileSync(path.join(root,'games/catalog.json'),'utf8').replace(/^\uFEFF/,''));
const pages=['index.html','games.html','game.html','about.html','news.html','news/1.html','addons.html','assets.html','teaser.html',...catalog.map(g=>'games/'+g.slug.toLowerCase()+'.html')];
const outputs=[...pages,'robots.txt','sitemap.xml'];
const before=new Map(outputs.map(p=>[p,fs.readFileSync(path.join(root,p),'utf8')]));
execFileSync(process.execPath,['tools/build-site.mjs'],{cwd:root});
const publicGames=catalog.filter(g=>!g.hidden&&!g.archive);
const expectedRoutes=['/','/games','/about','/addons','/assets','/news','/news/1',...publicGames.map(g=>`/games/${g.slug.toLowerCase()}`)];
const routeForPage=p=>{
 if(p==='index.html')return '/';
 if(p==='game.html')return '/games';
 if(p==='teaser.html')return '/teaser';
 return `/${p.replace(/\.html$/,'')}`;
};
const indexablePages=new Set(['index.html','games.html','about.html','news.html','news/1.html','addons.html','assets.html',...publicGames.map(g=>`games/${g.slug.toLowerCase()}.html`)]);
const shouldNoIndex=p=>p==='game.html'||p==='teaser.html'||catalog.some(g=>(g.hidden||g.archive)&&`games/${g.slug.toLowerCase()}.html`===p);
const metaContent=(html,regex)=>html.match(regex)?.[1];
for(const p of pages) {
 assert.equal(path.basename(p),path.basename(p).toLowerCase(),'Page filename must be lowercase: '+p);
 const html=fs.readFileSync(path.join(root,p),'utf8');
 assert.equal(html,before.get(p),'Build is not repeatable: '+p);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,'One primary heading required: '+p);
 const pageTitle=html.match(/<title>([^<]+)<\/title>/)?.[1];
 assert.ok(pageTitle&&pageTitle.length>=10,'Descriptive page title required: '+p);
 const description=metaContent(html,/<meta name="description" content="([^"]*)">/);
 assert.ok(description&&description.length>=50,'Descriptive meta description required: '+p);
 const canonical=metaContent(html,/<link rel="canonical" href="([^"]+)">/);
 assert.equal(canonical,siteOrigin+routeForPage(p),'Incorrect canonical URL: '+p);
 assert.equal(metaContent(html,/<meta property="og:url" content="([^"]+)">/),canonical,'Open Graph URL must match canonical URL: '+p);
 for(const [label,regex] of [
  ['Open Graph title',/<meta property="og:title" content="([^"]+)">/],
  ['Open Graph description',/<meta property="og:description" content="([^"]+)">/],
  ['Open Graph image',/<meta property="og:image" content="([^"]+)">/],
  ['Twitter title',/<meta name="twitter:title" content="([^"]+)">/],
  ['Twitter description',/<meta name="twitter:description" content="([^"]+)">/],
  ['Twitter image',/<meta name="twitter:image" content="([^"]+)">/]
 ])assert.ok(metaContent(html,regex),`${label} required: ${p}`);
 assert.equal(metaContent(html,/<meta property="og:title" content="([^"]+)">/),pageTitle,'Open Graph title must match page title: '+p);
 assert.equal(metaContent(html,/<meta name="twitter:title" content="([^"]+)">/),pageTitle,'Twitter title must match page title: '+p);
 assert.match(metaContent(html,/<meta property="og:image" content="([^"]+)">/),/^https:\/\/iigames\.github\.io\//,'Open Graph image must be absolute: '+p);
 assert.equal(metaContent(html,/<meta property="og:description" content="([^"]+)">/),description,'Open Graph description must match meta description: '+p);
 assert.equal(metaContent(html,/<meta name="twitter:description" content="([^"]+)">/),description,'Twitter description must match meta description: '+p);
 const robots=metaContent(html,/<meta name="robots" content="([^"]+)">/);
 assert.equal(robots,shouldNoIndex(p)?'noindex,follow':undefined,'Incorrect robots indexing policy: '+p);
 const jsonLd=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
 if(p==='index.html') {
  assert.ok(jsonLd,'Organization and website structured data required on homepage');
  const data=JSON.parse(jsonLd[1]);
  assert.ok(data['@graph'].some(item=>item['@type']==='Organization'),'Organization structured data missing');
  assert.ok(data['@graph'].some(item=>item['@type']==='WebSite'),'Website structured data missing');
 }
 if(p.startsWith('games/')&&!shouldNoIndex(p)) {
  assert.ok(jsonLd,'VideoGame structured data required: '+p);
  assert.equal(JSON.parse(jsonLd[1])['@type'],'VideoGame','Invalid game structured data: '+p);
 }
 for(const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if(/^(https?:|mailto:|#)/.test(url))continue;
  let target=path.resolve(root,path.dirname(p),decodeURIComponent(url.split(/[?#]/)[0]));
  if(!path.extname(target)&&fs.existsSync(target+'.html')) target+='.html';
  assert.ok(fs.existsSync(target),'Missing local target: '+p+' -> '+url);
  let cursor=root;
  for(const part of path.relative(root,target).split(path.sep).filter(Boolean)) {
    assert.ok(fs.readdirSync(cursor).includes(part),'Case mismatch: '+p+' -> '+url);
    cursor=path.join(cursor,part);
  }
 }
}
const indexedDescriptions=[...indexablePages].map(p=>metaContent(fs.readFileSync(path.join(root,p),'utf8'),/<meta name="description" content="([^"]*)">/));
assert.equal(new Set(indexedDescriptions).size,indexedDescriptions.length,'Indexable pages must have unique descriptions');
const indexableTitles=[...indexablePages].map(p=>metaContent(fs.readFileSync(path.join(root,p),'utf8'),/<title>([^<]+)<\/title>/));
assert.equal(new Set(indexableTitles).size,indexableTitles.length,'Indexable pages must have unique titles');
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const sitemapUrls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([,url])=>url);
assert.deepEqual(sitemapUrls,expectedRoutes.map(route=>siteOrigin+route),'Sitemap must list exactly the canonical, discoverable routes');
const robotsTxt=fs.readFileSync(path.join(root,'robots.txt'),'utf8');
assert.match(robotsTxt,/^User-agent: \*\nAllow: \/\nSitemap: https:\/\/iigames\.github\.io\/sitemap\.xml\n$/,'robots.txt must allow crawling and reference the sitemap');
for(const p of outputs)assert.equal(fs.readFileSync(path.join(root,p),'utf8'),before.get(p),'Build is not repeatable: '+p);
const article=fs.readFileSync(path.join(root,'news/article.html'),'utf8');
assert.ok(article.length>500,'Article content lost during build');
assert.ok(catalog.find(g=>g.slug==='CubeGame').details.includes('Radin Nasiri'),'Original game credits lost');
assert.ok(catalog.find(g=>g.slug==='CubeGame-Alpha').trailer,'Alpha trailer missing');
assert.match(fs.readFileSync(path.join(root,'index.html'),'utf8'),/google-site-verification" content="KfsYoNDCpkQhF7QEryFJC1IH0r2B3b7TfLn7jHr0Cg0"/,'Google site verification token lost during build');
assert.match(fs.readFileSync(path.join(root,'about.html'),'utf8'),/How we make games/,'Existing about-page content lost during build');
console.log(`PASS: ${pages.length} pages, SEO metadata, canonical sitemap, robots policy, local link and case checks, repeatable build, and preserved content.`);
