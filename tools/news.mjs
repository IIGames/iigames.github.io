import fs from 'node:fs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';

export const categories = [
  {id:'game-releases', label:'Game releases', gradient:'sky'},
  {id:'development', label:'Development', gradient:'iris'},
  {id:'studio', label:'Studio', gradient:'ember'},
];
export const gradientPresets = new Set(['sky','iris','ember']);
const text = value => typeof value === 'string' && value.trim().length > 0;
const error = (slug, message) => { throw new Error(`News [${slug}]: ${message}`); };
export const escapeHtml = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function localFile(root, relative, slug, label, base = root) {
  if (!text(relative) || /[\\?#\x00-\x1f]/.test(relative) || path.isAbsolute(relative) || /^[a-z]+:/i.test(relative)) error(slug,`${label} must be a relative local path`);
  const file = path.resolve(base, relative);
  const boundary = path.resolve(base) + path.sep;
  if (!file.startsWith(boundary)) error(slug,`${label} must stay inside ${path.relative(root,base) || 'the site'}`);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) error(slug,`${label} not found: ${relative}`);
  const real = fs.realpathSync(file);
  if (!real.startsWith(fs.realpathSync(base)+path.sep)) error(slug,`${label} escapes its directory`);
  let cursor=base;
  for (const part of path.relative(base,file).split(path.sep)) {
    if (!fs.readdirSync(cursor).includes(part)) error(slug,`${label} has incorrect filename case: ${relative}`);
    cursor=path.join(cursor,part);
  }
  return file;
}

export function renderMarkdown(source, {root, slug='preview'} = {}) {
  const md = new MarkdownIt({html:false, linkify:false, typographer:false});
  const defaultValidate=md.validateLink.bind(md);
  md.validateLink=url=>defaultValidate(url) && !/^(?!https?:|mailto:)[a-z][a-z\d+.-]*:/i.test(url) && !url.startsWith('//');
  const tokens=md.parse(source,{});
  const walk = items => {
    for (const token of items) {
      if (token.type === 'heading_open' || token.type === 'heading_close') {
        token.tag='h'+Math.max(2,Number(token.tag.slice(1)));
      }
      if (token.type === 'link_open' || token.type === 'image') {
        const attr=token.type==='image'?'src':'href';
        let url=token.attrGet(attr);
        if (!md.validateLink(url)) error(slug,`unsafe ${attr}: ${url}`);
        if (!/^(https?:|mailto:|#)/i.test(url)) {
          if (url.includes('\\')) error(slug,`invalid local ${attr}: ${url}`);
          if (url.startsWith('/')) url='../'+url.slice(1);
          if (root) {
            const clean=decodeURIComponent(url.split(/[?#]/)[0]);
            const target=path.resolve(root,'news',clean);
            if (!target.startsWith(path.resolve(root)+path.sep)) error(slug,`local ${attr} escapes the site`);
            if (token.type==='image') localFile(root,path.relative(root,target).split(path.sep).join('/'),slug,'Markdown image');
          }
          token.attrSet(attr,url);
        }
        if(token.type==='image') {token.attrSet('loading','lazy'); token.attrSet('decoding','async');}
      }
      if(token.children)walk(token.children);
    }
  };
  walk(tokens);
  const image=md.renderer.rules.image;
  md.renderer.rules.image=(tokens,index,options,env,self)=>{
    const title=tokens[index].attrGet('title');
    return image(tokens,index,options,env,self)+(title?`<span class="markdown-caption">${escapeHtml(title)}</span>`:'');
  };
  const html=md.renderer.render(tokens,md.options,{});
  const words=tokens.filter(t=>t.type==='inline').map(t=>t.content).join(' ').match(/\S+/g)?.length || 0;
  return {html, readingMinutes:Math.max(1,Math.ceil(words/200))};
}

export function loadNews(root, data) {
  if(data===undefined) {
    try {data=JSON.parse(fs.readFileSync(path.join(root,'news/catalog.json'),'utf8').replace(/^\uFEFF/,''));}
    catch(cause) {throw new Error(`News catalog: ${cause.message}`);}
  }
  if(!Array.isArray(data))error('catalog','expected an array of articles');
  const seen=new Set();
  return data.map((post,index)=>{
    const slug=post?.slug || `entry ${index+1}`;
    if(!post || typeof post!=='object' || Array.isArray(post))error(slug,'expected an article object');
    if(!text(post.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || ['article','index'].includes(post.slug))error(slug,'slug must be unique lowercase words separated by hyphens (reserved: article, index)');
    if(seen.has(post.slug))error(slug,'duplicate slug'); seen.add(post.slug);
    for(const field of ['title','summary','category','date'])if(!text(post[field]))error(slug,`${field} is required`);
    if(post.summary.trim().length<50)error(slug,'summary must contain at least 50 characters for article metadata');
    if(post.author!==undefined && !text(post.author))error(slug,'author must be nonempty text');
    const category=categories.find(c=>c.id===post.category);
    if(!category)error(slug,`unknown category: ${post.category}`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(post.date) || Number.isNaN(Date.parse(post.date)) || new Date(post.date).toISOString().slice(0,10)!==post.date)error(slug,'date must be a real calendar date in YYYY-MM-DD format');
    if(Object.hasOwn(post,'body')===Object.hasOwn(post,'bodyFile'))error(slug,'provide exactly one of body or bodyFile');
    let body;
    if(Object.hasOwn(post,'bodyFile')) {
      if(!text(post.bodyFile) || !post.bodyFile.endsWith('.md'))error(slug,'bodyFile must name a .md file');
      body=fs.readFileSync(localFile(root,post.bodyFile,slug,'bodyFile',path.join(root,'news')),'utf8');
    } else body=post.body;
    if(!text(body))error(slug,'Markdown body must be nonempty text');
    let cover=post.cover ?? {gradient:category.gradient};
    if(!cover || typeof cover!=='object' || Array.isArray(cover))error(slug,'cover must be an image or gradient object');
    if(Object.hasOwn(cover,'image')===Object.hasOwn(cover,'gradient'))error(slug,'cover needs exactly one of image or gradient');
    if(cover.image!==undefined) {
      localFile(root,cover.image,slug,'cover image');
      if(!/\.(png|jpe?g|webp|avif)$/i.test(cover.image))error(slug,'cover must be a PNG, JPEG, WebP or AVIF image');
      if(!text(cover.alt))error(slug,'cover image needs alternative text');
    } else if(!gradientPresets.has(cover.gradient))error(slug,'unknown gradient preset');
    const rendered=renderMarkdown(body,{root,slug});
    return {...post,author:post.author || 'II Games',categoryLabel:category.label,cover,...rendered};
  }).sort((a,b)=>b.date.localeCompare(a.date)||a.slug.localeCompare(b.slug));
}
