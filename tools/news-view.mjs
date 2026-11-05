import fs from 'node:fs';
import {categories,escapeHtml as e} from './news.mjs';
const arrow='<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const dateLabel=date=>new Date(date+'T12:00:00Z').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'});
export const articleDate=post=>`<time datetime="${post.date}">${dateLabel(post.date)}</time>`;
export function newsCover(post,prefix,{eager=false,article=false}={}) {
  const cover=post.cover;
  if(cover.gradient)return `<div class="news-cover gradient-cover gradient-${cover.gradient}${article?' article-cover':''}" aria-hidden="true"></div>`;
  const small=cover.image.replace(/\.jpg$/,'-small.jpg');
  const responsive=small!==cover.image && fs.existsSync(new URL('../'+small,import.meta.url))
    ? ' srcset="'+prefix+e(small)+' 640w, '+prefix+e(cover.image)+' 1440w" sizes="'+(article?'(max-width: 1050px) 92vw, 960px':'(max-width: 760px) 92vw, (max-width: 1050px) 46vw, 31vw')+'"' : '';
  return `<div class="news-cover${article?' article-cover':''}"><img src="${prefix}${e(cover.image)}" alt="${e(cover.alt)}"${responsive} width="1280" height="720" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async"></div>`;
}
export function newsCard(post,prefix,heading='h2',eager=false) {
  return `<article class="news-card" data-category="${post.category}" data-date="${post.date}"><a href="${prefix}news/${post.slug}">${newsCover(post,prefix,{eager})}<${heading}>${e(post.title)}</${heading}><div class="news-card-meta"><span>${e(post.categoryLabel)}</span>${articleDate(post)}</div></a></article>`;
}
export function newsIndex(posts) {
  return `<header class="news-intro"><h1>News</h1><p>Game releases, development notes and updates from II Games.</p></header><section class="news-library" aria-label="News archive"><div class="news-toolbar" hidden><div class="news-categories" role="group" aria-label="Filter news by category"><button type="button" data-news-category="all" aria-pressed="true">All</button>${categories.map(c=>`<button type="button" data-news-category="${c.id}" aria-pressed="false">${c.label}</button>`).join('')}</div><label class="news-sort">Sort <select id="news-sort"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label></div><p class="news-result-count" role="status" aria-live="polite" hidden>${posts.length} articles</p><div class="news-grid">${posts.map((p,i)=>newsCard(p,'./','h2',i<3)).join('')}</div><p class="news-empty" hidden>No articles in this category yet. <button type="button" class="text-button" data-news-reset>Show all news</button></p></section>`;
}
export function newsArticle(post,posts) {
  const related=posts.filter(p=>p.slug!==post.slug).sort((a,b)=>Number(b.category===post.category)-Number(a.category===post.category)||b.date.localeCompare(a.date)||a.slug.localeCompare(b.slug)).slice(0,3);
  return `<article class="news-article"><a class="back-link" href="../news">${arrow} All news</a><header class="article-heading"><div class="article-meta">${articleDate(post)}<a href="../news?category=${post.category}">${e(post.categoryLabel)}</a></div><h1>${e(post.title)}</h1><p class="article-summary">${e(post.summary)}</p></header><div class="article-tools"><span>${post.readingMinutes} min read</span><div class="share-tools" hidden><button type="button" class="copy-link"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m10 13 4-4m-6 6-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 2 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0"/></svg>Copy link</button><span class="share-status" role="status" aria-live="polite"></span></div><label class="share-fallback" hidden>Article link <input type="text" readonly aria-label="Article link"></label></div>${newsCover(post,'../',{eager:true,article:true})}<div class="article-body">${post.html}</div><footer class="article-author"><div><span>Written by</span><p>${e(post.author)}</p></div><a href="../news?category=${post.category}">${e(post.categoryLabel)} ${arrow}</a></footer></article>${related.length?`<section class="related-news" aria-labelledby="related-title"><div class="section-heading"><h2 id="related-title">Keep reading</h2><a class="text-link" href="../news">All news ${arrow}</a></div><div class="news-grid">${related.map(p=>newsCard(p,'../','h3')).join('')}</div></section>`:''}`;
}
