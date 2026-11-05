async page => {
 const failures=[],errors=[];
 const context=await page.context().browser().newContext({viewport:{width:1440,height:1000}});
 const p=await context.newPage();p.on('pageerror',error=>errors.push(error.message));
 const base='http://127.0.0.1:4173';
 const check=(condition,message)=>{if(!condition)failures.push(message);};
 const ready=()=>p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
 await p.goto(base+'/news');await ready();
 check(await p.locator('.news-card').count()===6,'Six articles');
 await p.getByRole('button',{name:'Development',exact:true}).click();
 check(await p.locator('.news-card:visible').count()===1,'Development filter');
 check((await p.locator('.news-card:visible a').getAttribute('href')).endsWith('/news/1.html'),'Legacy article link');
 await p.getByRole('button',{name:'Game releases',exact:true}).click();
 check(await p.locator('.news-card:visible').count()===4,'Release filter');
 await p.getByRole('button',{name:'All',exact:true}).click();
 await p.locator('#news-sort').selectOption('oldest');
 check(await p.locator('.news-card').first().getAttribute('data-date')==='2020-05-27','Oldest sorting');
 await p.locator('#news-sort').selectOption('newest');
 check(await p.locator('.news-card').first().getAttribute('data-date')==='2026-11-05','Newest sorting');
 await p.goto(base+'/news?category=studio&sort=oldest');
 check(await p.locator('.news-card:visible').count()===1,'Category URL state');
 await p.goto(base+'/news?category=invalid');
 check(await p.locator('.news-card:visible').count()===6,'Unknown category fallback');
 // Exercise the empty result and reset using the real filter behavior.
 await p.locator('[data-category="studio"]').evaluate(el=>el.dataset.category='unlisted');
 await p.getByRole('button',{name:'Studio',exact:true}).click();
 check(await p.locator('.news-empty').isVisible(),'Empty result');
 await p.locator('[data-news-reset]').click();
 check(await p.locator('.news-card:visible').count()===6,'Empty reset');
 await p.goto(base+'/news/cubegame');await ready();
 check(await p.locator('h1').count()===1,'One article heading');
 check(await p.locator('.article-body table').count()===1,'Markdown table');
 check(await p.locator('.markdown-caption').count()===1,'Image caption');
 check(await p.locator('.related-news .news-card').count()===3,'Related articles');
 await p.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copiedLink=text;}}});});
 await p.locator('.copy-link').click();
 check(await p.locator('.share-status').textContent()==='Link copied','Copy feedback');
 check(await p.evaluate(()=>window.copiedLink)==='https://iigames.github.io/news/cubegame','Copied canonical URL');
 await p.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('denied');}}});});
 await p.locator('.copy-link').click();
 check(await p.locator('.share-fallback').isVisible(),'Clipboard fallback');
 await p.setViewportSize({width:375,height:812});
 await p.locator('.nav-toggle').click();
 check(await p.locator('.nav-panel').getAttribute('role')==='dialog','Drawer dialog');
 check(await p.locator('main').evaluate(el=>el.inert),'Background inert');
 check(await p.evaluate(()=>getComputedStyle(document.documentElement).overflow)==='hidden','Scroll lock');
 check(await p.locator('.nav-close').evaluate(el=>el===document.activeElement),'Initial focus');
 await p.keyboard.press('Shift+Tab');
 check(await p.locator('.nav-panel-footer a').last().evaluate(el=>el===document.activeElement),'Backward focus wrap');
 await p.keyboard.press('Tab');
 check(await p.locator('.nav-close').evaluate(el=>el===document.activeElement),'Forward focus wrap');
 await p.keyboard.press('Escape');
 check(await p.locator('.nav-toggle').evaluate(el=>el===document.activeElement),'Focus restored');
 check(!await p.locator('main').evaluate(el=>el.inert),'Background restored');
 await p.locator('.nav-toggle').click();await p.mouse.click(8,200);
 check(await p.locator('.nav-toggle').getAttribute('aria-expanded')==='false','Backdrop dismissal');
 await p.locator('.nav-toggle').click();await p.setViewportSize({width:1440,height:1000});
 await p.waitForFunction(()=>!document.querySelector('.nav-panel').inert);
 check(!await p.locator('.nav-panel').evaluate(el=>el.inert),'Desktop panel restored');
 check(!await p.locator('main').evaluate(el=>el.inert),'Resize clears background lock');
 check(await p.locator('.nav-backdrop').isHidden(),'Resize clears backdrop');
 await p.setViewportSize({width:375,height:812});
 await p.waitForFunction(()=>document.querySelector('.nav-panel').inert);
 check(await p.locator('.nav-panel').evaluate(el=>el.inert),'Closed mobile panel inert');
 await p.emulateMedia({reducedMotion:'reduce'});await p.locator('.nav-toggle').click();
 check(await p.locator('.nav-panel').evaluate(el=>getComputedStyle(el).transitionDuration)==='0s','Reduced motion');
 await p.keyboard.press('Escape');
 const routes=['/','/games','/about','/assets','/addons','/news','/news/1','/news/cubegame','/news/no-mans-land','/news/slowly-strange','/news/cubegame-alpha','/news/a-new-home-for-news','/games/cubegame'];
 for(const route of routes){
  await p.goto(base+route);await ready();
  check(await p.locator('.nav-panel').count()===1,'Shared header '+route);
  for(const width of [320,375,768,1440]){
   await p.setViewportSize({width,height:900});
   const state=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).length}));
   if(state.overflow||state.broken)failures.push({route,width,...state});
  }
  for(const width of [320,768,1440]){
   await p.setViewportSize({width,height:900});await p.evaluate(()=>document.documentElement.style.fontSize='200%');
   if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))failures.push({route,width,text:'200%',overflow:true});
   await p.evaluate(()=>document.documentElement.style.fontSize='');
  }
 }
 const fallback=await context.browser().newContext({javaScriptEnabled:false,viewport:{width:375,height:812}});
 const f=await fallback.newPage();await f.goto(base+'/news');
 check(await f.locator('.news-card:visible').count()===6,'No-JS complete archive');
 check(await f.locator('#site-nav').isVisible(),'No-JS navigation');
 check(await f.locator('.news-toolbar').isHidden(),'No-JS controls hidden');
 await f.goto(base+'/news/1');check(await f.locator('.article-body').isVisible(),'No-JS article');await fallback.close();
 for(const [route,name] of [['/news','news-index'],['/news/cubegame','news-article']]){
  for(const [width,size] of [[1440,'desktop'],[375,'mobile']]){
   await p.setViewportSize({width,height:1000});await p.goto(base+route);await ready();
   await p.screenshot({path:`output/playwright/${name}-${size}.png`,fullPage:true});
  }
 }
 await p.setViewportSize({width:375,height:812});await p.goto(base+'/news');await ready();await p.locator('.nav-toggle').click();
 await p.screenshot({path:'output/playwright/news-menu-mobile.png'});
 await p.keyboard.press('Escape');
 await p.setViewportSize({width:320,height:900});await p.evaluate(()=>document.documentElement.style.fontSize='200%');
 await p.screenshot({path:'output/playwright/news-320-large-text.png',fullPage:true});
 await p.locator('.nav-toggle').click();
 await p.screenshot({path:'output/playwright/news-menu-320-large-text.png'});
 await context.close();return {failures,errors,routes:routes.length,widths:[320,375,768,1440]};
}
