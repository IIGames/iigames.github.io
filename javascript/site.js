document.documentElement.classList.add('js');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');
const panel = document.querySelector('.nav-panel');
const backdrop = document.querySelector('.nav-backdrop');
const closeButton = document.querySelector('.nav-close');
const mobileMenu = matchMedia('(max-width: 760px)');
let menuOpen = false;
const backgroundState = new Map();
function closeMenu({restoreFocus=true}={}) {
  if(!panel)return;
  const wasOpen=menuOpen;
  menuOpen=false;
  document.documentElement.classList.remove('menu-open');
  panel.classList.remove('is-open');
  nav.classList.remove('is-open');
  panel.removeAttribute('role');panel.removeAttribute('aria-modal');panel.removeAttribute('aria-label');
  panel.inert=mobileMenu.matches;
  backdrop.hidden=true;
  toggle.setAttribute('aria-expanded','false');
  backgroundState.forEach((inert,element)=>{element.inert=inert;});backgroundState.clear();
  if(wasOpen && restoreFocus && mobileMenu.matches)toggle.focus();
}
function openMenu() {
  if(!mobileMenu.matches || !panel)return;
  menuOpen=true;
  panel.inert=false;
  panel.classList.add('is-open');nav.classList.add('is-open');
  panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Site menu');
  toggle.setAttribute('aria-expanded','true');
  backdrop.hidden=false;
  document.documentElement.classList.add('menu-open');
  document.querySelectorAll('main, .site-footer, .brand, .nav-toggle, .skip-link').forEach(element=>{
    backgroundState.set(element,element.inert);element.inert=true;
  });
  closeButton.focus();
}
toggle?.addEventListener('click',()=>menuOpen?closeMenu():openMenu());
closeButton?.addEventListener('click',()=>closeMenu());
backdrop?.addEventListener('click',()=>closeMenu());
panel?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu({restoreFocus:false});});
document.addEventListener('keydown',event=>{
  if(!menuOpen)return;
  if(event.key==='Escape'){event.preventDefault();closeMenu();}
  if(event.key==='Tab') {
    const items=[...panel.querySelectorAll('a[href],button:not([disabled])')];
    const first=items[0],last=items.at(-1);
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  }
});
function syncMenu() {
  const focusWasClose=document.activeElement===closeButton;
  closeMenu({restoreFocus:false});
  toggle?.setAttribute('aria-haspopup',mobileMenu.matches?'dialog':'false');
  if(focusWasClose && !mobileMenu.matches)nav.querySelector('a')?.focus();
}
mobileMenu.addEventListener('change',syncMenu);
syncMenu();
const local = location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || location.port !== '';
if (local) {
  document.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.hash) return;
    if (!url.pathname.endsWith('/') && !/\.[^/]+$/.test(url.pathname)) {
      url.pathname += '.html';
      link.href = url.href;
    }
  });
}
if (/\/game\.html$/i.test(location.pathname)) {
  const slug = new URLSearchParams(location.search).get('game');
  const known = ['CubeGame', 'SlowlyStrange', 'CubeGame-Alpha', 'NightAtSchool', 'NoMansLand', 'SCP173Simulator', 'CrystalStealer', 'NeonShooterMayhem', 'StationInvasion'];
  if (slug && known.includes(slug)) location.replace(new URL(`games/${slug.toLowerCase()}${local ? '.html' : ''}`, location.href));
}

// Browse gameplay with native scrolling; arrows and keys are an optional enhancement.
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const viewport = carousel.querySelector('.carousel-viewport');
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const previous = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  const count = carousel.querySelector('.carousel-count');
  let current = 0, settleTimer;
  const offset = slide => slide.offsetLeft;
  const update = () => {
    current = slides.reduce((closest,slide,index) => Math.abs(offset(slide)-viewport.scrollLeft) < Math.abs(offset(slides[closest])-viewport.scrollLeft) ? index : closest,0);
    previous.disabled = current === 0;
    next.disabled = current === slides.length-1;
    count.textContent = `${current+1} / ${slides.length}`;
  };
  const go = direction => {
    const target = Math.max(0,Math.min(slides.length-1,current+direction));
    current = target;
    previous.disabled = current === 0;
    next.disabled = current === slides.length-1;
    viewport.scrollTo({left:offset(slides[target]),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  };
  previous.addEventListener('click',()=>go(-1));
  next.addEventListener('click',()=>go(1));
  viewport.addEventListener('keydown',event => {
    if(event.target !== viewport || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    if(event.key === 'Home')go(-slides.length);
    else if(event.key === 'End')go(slides.length);
    else go(event.key === 'ArrowRight' ? 1 : -1);
  });
  viewport.addEventListener('scroll',()=>{clearTimeout(settleTimer);settleTimer=setTimeout(update,120);},{passive:true});
  new ResizeObserver(update).observe(viewport);
  carousel.querySelector('.carousel-controls').hidden = false;
  update();
});

const library = document.querySelector('.catalog-library');
if(library) {
  const filters = [...library.querySelectorAll('[data-platform]')];
  const games = [...library.querySelectorAll('.game-card')];
  filters.forEach(button => button.addEventListener('click',() => {
    const platform = button.dataset.platform;
    let visible = 0;
    games.forEach(game => {
      const matches = platform === 'all' || game.dataset.platforms.split(',').includes(platform);
      game.hidden = !matches;
      if(matches)visible++;
    });
    filters.forEach(filter=>filter.setAttribute('aria-pressed',String(filter === button)));
    library.querySelector('.catalog-count').textContent = `${visible} ${visible === 1 ? 'game' : 'games'}`;
    library.querySelector('.catalog-empty').hidden = visible > 0;
  }));
  library.querySelector('.platform-filters').hidden = false;
}
