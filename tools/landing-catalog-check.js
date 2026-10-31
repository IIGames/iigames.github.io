async page => {
  const failures=[],errors=[];
  const context=await page.context().browser().newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
  const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));
  const ready=()=>p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
  await p.goto('http://127.0.0.1:4173/');await p.waitForFunction(()=>window.ScrollTrigger?.getAll().length>8);await ready();
  const before=await p.evaluate(()=>({title:document.querySelector('.intro-title h1').style.transform,scene:document.querySelector('.feature-art img').style.transform}));
  await p.mouse.wheel(0,400);await p.waitForTimeout(900);
  const after=await p.evaluate(()=>({title:document.querySelector('.intro-title h1').style.transform,scene:document.querySelector('.feature-art img').style.transform}));
  if(before.title===after.title||before.scene===after.scene)failures.push({scrollUnchanged:{before,after}});
  await p.locator('.carousel-next').scrollIntoViewIfNeeded();await p.locator('.carousel-next').click();await p.waitForFunction(()=>document.querySelector('.carousel-count').textContent==='2 / 5');
  const next=await p.locator('.carousel-count').textContent();if(next!=='2 / 5')failures.push({next});
  await p.locator('.carousel-viewport').focus();await p.keyboard.press('End');await p.waitForFunction(()=>document.querySelector('.carousel-count').textContent==='5 / 5');
  const last=await p.locator('.carousel-count').textContent();if(last!=='5 / 5'||!await p.locator('.carousel-next').isDisabled())failures.push({last});
  await p.keyboard.press('Home');await p.waitForFunction(()=>document.querySelector('.carousel-count').textContent==='1 / 5');
  if(await p.locator('.carousel-count').textContent()!=='1 / 5')failures.push('Carousel Home failed');
  if(await p.locator('.motion-toggle').count())failures.push('Removed motion button is present');
  await p.emulateMedia({reducedMotion:'reduce'});
  await p.waitForFunction(()=>ScrollTrigger.getAll().length===0);
  const reducedMotion=await p.evaluate(()=>ScrollTrigger.getAll().length===0);
  await p.emulateMedia({reducedMotion:'no-preference'});
  await p.waitForFunction(()=>ScrollTrigger.getAll().length>8);
  const routes=['/','/games','/about','/news','/assets','/addons','/games/cubegame','/games/nomansland','/news/1'];
  for(const route of routes) {
    await p.goto('http://127.0.0.1:4173'+route);await ready();
    for(const width of [320,375,768,1024,1440,1920]) {
      await p.setViewportSize({width,height:900});await p.waitForTimeout(100);
      const s=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}));
      if(s.overflow||s.broken.length)failures.push({route,width,...s});
    }
    if(['/','/games','/about','/news','/assets','/games/cubegame'].includes(route)) {
      for(const [width,size] of [[1440,'desktop'],[375,'mobile']]) {
        await p.setViewportSize({width,height:1000});await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(700);
        await p.screenshot({path:'output/playwright/revision-'+(route==='/'?'home':route.replaceAll('/','-').slice(1))+'-'+size+'.png',fullPage:true});
      }
    }
    await p.emulateMedia({reducedMotion:'reduce'});
    for(const width of [320,768,1440]) {
      await p.setViewportSize({width,height:900});await p.evaluate(()=>document.documentElement.style.fontSize='200%');
      if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))failures.push({route,width,text:'200%',overflow:true});
      await p.evaluate(()=>document.documentElement.style.fontSize='');
    }
    await p.emulateMedia({reducedMotion:'no-preference'});
  }
  await p.goto('http://127.0.0.1:4173/games');
  const palette=await p.locator('.catalog-grid .game-card > a').evaluateAll(items=>[...new Set(items.map(i=>getComputedStyle(i).backgroundColor))]);
  if(palette.length!==1)failures.push({palette});
  const platforms={};
  for(const name of ['Browser','Windows','macOS','All games']) {
    await p.getByRole('button',{name,exact:true}).click();
    platforms[name]=await p.locator('.catalog-count').textContent();
    const expected=await p.locator('.catalog-grid .game-card:not([hidden])').count();
    if(!platforms[name].startsWith(String(expected)))failures.push({name,expected,count:platforms[name]});
  }
  await p.setViewportSize({width:375,height:812});await p.locator('.nav-toggle').click();
  if(await p.locator('.nav-toggle').getAttribute('aria-expanded')!=='true')failures.push('Menu open failed');
  await p.keyboard.press('Escape');if(await p.locator('.nav-toggle').getAttribute('aria-expanded')!=='false')failures.push('Menu Escape failed');
  const fallback=await context.browser().newContext({javaScriptEnabled:false,viewport:{width:375,height:812}});const f=await fallback.newPage();
  await f.goto('http://127.0.0.1:4173/');
  if(!await f.locator('.carousel-viewport').isVisible()||!await f.locator('#site-nav').isVisible())failures.push('No-JS homepage failed');
  await f.goto('http://127.0.0.1:4173/games');if(await f.locator('.catalog-grid .game-card:visible').count()!==6)failures.push('No-JS catalog failed');
  await fallback.close();await context.close();
  return {failures,errors,scroll:{before,after},carousel:{next,last},reducedMotion,palette,platforms};
}
