const newsLibrary = document.querySelector('.news-library');
if (newsLibrary) {
  const grid = newsLibrary.querySelector('.news-grid');
  const cards = [...grid.querySelectorAll('.news-card')];
  const filters = [...newsLibrary.querySelectorAll('[data-news-category]')];
  const sort = newsLibrary.querySelector('#news-sort');
  const count = newsLibrary.querySelector('.news-result-count');
  let category = 'all';
  const apply = () => {
    cards.sort((a,b) => (sort.value === 'oldest' ? 1 : -1) * a.dataset.date.localeCompare(b.dataset.date));
    let visible=0;
    cards.forEach(card => {
      card.hidden=category !== 'all' && card.dataset.category !== category;
      if(!card.hidden)visible++;
      grid.append(card);
    });
    filters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.newsCategory===category)));
    count.textContent=`${visible} ${visible===1?'article':'articles'}`;
    newsLibrary.querySelector('.news-empty').hidden=visible!==0;
  };
  const readState = () => {
    const params=new URL(location.href).searchParams;
    category=filters.some(b=>b.dataset.newsCategory===params.get('category'))?params.get('category'):'all';
    sort.value=params.get('sort')==='oldest'?'oldest':'newest';
    apply();
  };
  const saveState = () => {
    const url=new URL(location.href);
    if(category==='all')url.searchParams.delete('category');else url.searchParams.set('category',category);
    if(sort.value==='newest')url.searchParams.delete('sort');else url.searchParams.set('sort',sort.value);
    history.replaceState(null,'',url);
    apply();
  };
  filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.newsCategory;saveState();}));
  sort.addEventListener('change',saveState);
  newsLibrary.querySelector('[data-news-reset]').addEventListener('click',()=>{category='all';saveState();filters[0].focus();});
  window.addEventListener('popstate',readState);
  readState();
  newsLibrary.querySelector('.news-toolbar').hidden=false;
  count.hidden=false;
}
const copyLink=document.querySelector('.copy-link');
if(copyLink) {
  document.querySelector('.share-tools').hidden=false;
  copyLink.addEventListener('click',async()=>{
    const url=document.querySelector('link[rel="canonical"]').href;
    const status=document.querySelector('.share-status');
    try {
      await navigator.clipboard.writeText(url);
      status.textContent='Link copied';
      document.querySelector('.share-fallback').hidden=true;
    } catch {
      const fallback=document.querySelector('.share-fallback');
      fallback.hidden=false;
      const input=fallback.querySelector('input');input.value=url;input.focus();input.select();
      status.textContent='Select and copy the link below';
    }
  });
}
