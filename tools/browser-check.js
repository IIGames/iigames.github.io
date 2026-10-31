async (page) => {
  const widths = [320,375,768,1024,1280,1440,1920];
  const routes = ['/', '/games.html', '/game.html', '/about.html', '/assets.html', '/addons.html', '/news.html', '/news/1.html', '/teaser.html', ...['cubegame','cubegame-alpha','slowlystrange','nightatschool','nomansland','scp173simulator','crystalstealer','neonshootermayhem','stationinvasion'].map(x=>'/games/'+x+'.html')];
  const failures=[];
  const errors=[];
  page.on('pageerror', e=>errors.push(e.message));
  for(const route of routes) {
    await page.goto('http://127.0.0.1:4173'+route);
    for(const width of widths) {
      await page.setViewportSize({width,height:900});
      const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,headings:document.querySelectorAll('h1').length,broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src)}));
      if(state.overflow||state.headings!==1||state.broken.length) failures.push({route,width,...state});
    }
  }
  await page.setViewportSize({width:375,height:812});
  await page.goto('http://127.0.0.1:4173/');
  const menu=page.locator('.nav-toggle');
  await menu.click();
  if(await menu.getAttribute('aria-expanded')!=='true')failures.push('Menu did not open');
  await page.keyboard.press('Escape');
  if(await menu.getAttribute('aria-expanded')!=='false')failures.push('Escape did not close menu');
  await menu.click();
  await page.getByRole('navigation').getByRole('link',{name:'Games',exact:true}).click();
  if(!page.url().endsWith('/games.html'))failures.push('Local games navigation mismatch');
  await page.goto('http://127.0.0.1:4173/game.html?game=CubeGame');
  await page.waitForURL('**/games/cubegame.html');
  await page.reload();
  if(await page.getByRole('heading',{name:'CubeGame',exact:true,level:1}).count()!==1)failures.push('Direct game reload failed');
  await page.goBack();
  await page.goto('http://127.0.0.1:4173/');
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [320,768,1440]) {
    await page.setViewportSize({width,height:900});
    await page.evaluate(()=>document.documentElement.style.fontSize='200%');
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))failures.push({width,zoom:'200%',overflow:true});
    await page.evaluate(()=>document.documentElement.style.fontSize='');
  }
  for(const [route,name] of [['/','home'],['/games.html','games'],['/games/nomansland.html','game']]) {
    await page.goto('http://127.0.0.1:4173'+route);
    for(const [width,size] of [[1440,'desktop'],[375,'mobile']]) {
      await page.setViewportSize({width,height:900});
      await page.screenshot({path:'output/playwright/'+name+'-'+size+'.png',fullPage:true});
    }
  }
  return {routes:routes.length,widths,checks:routes.length*widths.length,failures,errors};
}
