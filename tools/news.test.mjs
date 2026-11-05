import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {loadNews,renderMarkdown} from './news.mjs';
const root=path.resolve(import.meta.dirname,'..');
const post={slug:'example',title:'An example article',summary:'A factual description long enough to use as the article summary.',category:'development',date:'2026-11-05',body:'First paragraph.\n\nSecond paragraph.'};
test('catalog loads both sources, defaults and original archived dates',()=>{
 const news=loadNews(root);assert.equal(news.length,6);
 assert.ok(news.find(p=>p.slug==='1').html.includes('target audience'));
 assert.ok(news.some(p=>p.bodyFile));assert.ok(news.some(p=>p.body));
 assert.equal(news.find(p=>p.slug==='cubegame').date,'2022-09-23');
 const [entry]=loadNews(root,[post]);assert.equal(entry.author,'II Games');assert.equal(entry.cover.gradient,'iris');
});
test('Markdown preserves blank lines, nested lists and code indentation',()=>{
 const {html}=renderMarkdown('First.\n\nSecond.\n\n- Parent\n  - Child\n\n```js\n  const x = 1;\n    call(x);\n```\n\n    indented code\n');
 assert.match(html,/<p>First\.<\/p>\s*<p>Second\.<\/p>/);
 assert.match(html,/<ul>[\s\S]*<ul>/);
 assert.ok(html.includes('  const x = 1;\n    call(x);'));
 assert.match(html,/<pre><code>indented code/);
});
test('inline JSON Markdown roundtrips and long content gets reading time',()=>{
 const source=JSON.parse(JSON.stringify({...post,body:'Paragraph one.\n\n```\n  x\n```'}));
 const [entry]=loadNews(root,[source]);assert.ok(entry.html.includes('  x\n'));
 assert.equal(renderMarkdown('word '.repeat(401)).readingMinutes,3);
});
test('Markdown renders tables, quotations, captions and one page heading',()=>{
 const {html}=renderMarkdown('# Heading\n\n> Quote\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n![Alt](/assets/optimized/CubeGame-cover.jpg "Caption")',{root});
 assert.match(html,/<h2>Heading<\/h2>/);assert.match(html,/<table>/);assert.match(html,/<blockquote>/);assert.match(html,/class="markdown-caption">Caption/);
 assert.match(html,/src="\.\.\/assets/);
});
test('raw HTML and dangerous URL schemes cannot execute',()=>{
 const {html}=renderMarkdown('<script>alert(1)</script>\n\n[bad](javascript:alert(1))\n\n![bad](data:text/html,evil)\n\n[bad](vbscript:evil)\n\n[good](https://example.com)');
 assert.doesNotMatch(html,/<script|href="(?:javascript|vbscript):|src="data:/i);
 assert.match(html,/&lt;script&gt;/);assert.match(html,/href="https:\/\/example.com"/);
});
test('bad fields and ambiguous body sources identify the article',()=>{
 for(const invalid of [
  {...post,slug:undefined},{...post,slug:'Uppercase'}, {...post,slug:'../escape'}, {...post,slug:'article'},
  {...post,date:'2023-02-29'}, {...post,date:'2026-13-01'}, {...post,date:'yesterday'},
  {...post,title:''}, {...post,summary:'Too short'}, {...post,author:12}, {...post,category:'missing'},
  {...post,bodyFile:'posts/foo.md'}, {...post,body:''}, {...post,body:undefined},
  {...post,cover:{gradient:'missing'}}, {...post,cover:{image:'x.jpg'}},
  {...post,cover:{image:'x.jpg',gradient:'sky'}},
 ])assert.throws(()=>loadNews(root,[invalid]),/News \[/);
 assert.throws(()=>loadNews(root,[post,post]),/duplicate slug/);
 assert.throws(()=>loadNews(root,{}),/expected an array/);
});
test('missing and escaping local files fail before generation',()=>{
 for(const bodyFile of ['posts/missing.md','../README.md','C:/secret.md']) {
  const entry={...post,bodyFile};delete entry.body;
  assert.throws(()=>loadNews(root,[entry]),/bodyFile/);
 }
 assert.throws(()=>loadNews(root,[{...post,cover:{image:'../outside.png',alt:'Image'}}]),/cover image/);
 assert.throws(()=>renderMarkdown('![Missing](/assets/missing.png)',{root}),/Markdown image not found/);
 assert.throws(()=>renderMarkdown('[Outside](../../../outside)',{root}),/escapes the site/);
});
test('file-backed Markdown is read as written',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'ii-news-'));
 try {
  fs.mkdirSync(path.join(temp,'news'));
  fs.writeFileSync(path.join(temp,'news/body.md'),'First.\n\n```\n  code\n```');
  const entry={...post,bodyFile:'body.md'};delete entry.body;
  assert.match(loadNews(temp,[entry])[0].html,/<pre><code>  code\n/);
 } finally {fs.rmSync(temp,{recursive:true,force:true});}
});
