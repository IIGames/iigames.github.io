import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'Games/catalog.json'),'utf8').replace(/^\uFEFF/,''));
const pages=['index.html','Games.html','game.html','About.html','News.html','News/1.html','AddOns.html','Assets.html','Teaser.html',...catalog.map(g=>'Games/'+g.slug+'.html')];
const before=new Map(pages.map(p=>[p,fs.readFileSync(path.join(root,p),'utf8')]));
execFileSync(process.execPath,['tools/build-site.mjs'],{cwd:root});
for(const p of pages) {
 const html=fs.readFileSync(path.join(root,p),'utf8');
 assert.equal(html,before.get(p),'Build is not repeatable: '+p);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,'One primary heading required: '+p);
 for(const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if(/^(https?:|mailto:|#)/.test(url))continue;
  const target=path.resolve(root,path.dirname(p),decodeURIComponent(url.split(/[?#]/)[0]));
  assert.ok(fs.existsSync(target),'Missing local target: '+p+' -> '+url);
  let cursor=root;
  for(const part of path.relative(root,target).split(path.sep)) {
    assert.ok(fs.readdirSync(cursor).includes(part),'Case mismatch: '+p+' -> '+url);
    cursor=path.join(cursor,part);
  }
 }
}
const article=fs.readFileSync(path.join(root,'News/article.html'),'utf8');
assert.ok(article.length>500,'Article content lost during build');
assert.ok(catalog.find(g=>g.slug==='CubeGame').details.includes('Radin Nasiri'),'Original game credits lost');
assert.ok(catalog.find(g=>g.slug==='CubeGame-Alpha').trailer,'Alpha trailer missing');
console.log(`PASS: ${pages.length} pages, local link and case checks, repeatable build, original article/credits/trailer.`);
