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
