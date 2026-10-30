document.documentElement.classList.add('js');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');
function closeMenu() {
  nav?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  if (toggle) toggle.textContent = 'Menu';
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close menu' : 'Menu';
  nav?.classList.toggle('is-open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
const local = location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || location.port !== '';
if (local) {
  document.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.hash || url.search) return;
    if (!url.pathname.endsWith('/') && !/\.[^/]+$/.test(url.pathname)) {
      url.pathname += '.html';
      link.href = url.href;
    }
  });
}
if (/\/game\.html$/i.test(location.pathname)) {
  const slug = new URLSearchParams(location.search).get('game');
  const known = ['CubeGame', 'SlowlyStrange', 'CubeGame-Alpha', 'NightAtSchool', 'NoMansLand', 'SCP173Simulator', 'CrystalStealer', 'NeonShooterMayhem', 'StationInvasion'];
  if (slug && known.includes(slug)) location.replace(new URL(`Games/${slug.toLowerCase()}${local ? '.html' : ''}`, location.href));
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
