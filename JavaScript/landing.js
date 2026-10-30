/* Scroll choreography is progressive enhancement; links and copy are always present. */
(() => {
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const base = new URL('.', document.currentScript.src);
  let enabled = !systemMotion.matches;
  let libraries, media;
  const load = file => new Promise((resolve,reject) => {
    const script = document.createElement('script');
    script.src = new URL(`vendor/${file}`,base).href;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Could not load ${file}`));
    document.head.append(script);
  });
  async function sync() {
    media?.revert();
    media = null;
    if (!enabled) return;
    try {
      libraries ||= load('gsap.min.js').then(() => load('ScrollTrigger.min.js'));
      await libraries;
      // The preference may have changed while the scripts were loading.
      if (!enabled || media) return;
      const {gsap,ScrollTrigger} = window;
      gsap.registerPlugin(ScrollTrigger);
      media = gsap.matchMedia();
      media.add({compact:'(max-width: 760px)',regular:'(min-width: 761px)'},context => {
        const compact = context.conditions.compact;
        const distance = compact ? 35 : 80;
        // The opening physically parts as the player approaches the first world.
        gsap.to('.intro-title h1', {y: -distance, ease:'none', scrollTrigger:{
          trigger:'.landing-intro',start:'top top',end:'bottom top',scrub:.5,
        }});
        gsap.to('.intro-title h1 > span', {x:compact ? 16 : 70,ease:'none',scrollTrigger:{
          trigger:'.landing-intro',start:'top top',end:'bottom top',scrub:.5,
        }});
        gsap.to('.intro-cube', {y:160,rotation:100,ease:'none',scrollTrigger:{
          trigger:'.landing-intro',start:'top top',end:'bottom top',scrub:.6,
        }});
        // No viewport-height gate or pinned spacer: every screen gets the expansion.
        gsap.fromTo('.world-stage', {scale:compact ? .94 : .88}, {scale:1,ease:'none',scrollTrigger:{
          trigger:'.world-section',start:'top bottom',end:'top 15%',scrub:.6,
        }});
        gsap.fromTo('.feature-art img', {scale:1.2,yPercent:6}, {scale:1.04,yPercent:-6,ease:'none',scrollTrigger:{
          trigger:'.world-section',start:'top bottom',end:'bottom top',scrub:.6,
        }});
        gsap.fromTo('.feature-copy', {y:compact ? -20 : -55}, {y:0,ease:'none',scrollTrigger:{
          trigger:'.world-section',start:'top 75%',end:'center 45%',scrub:.5,
        }});
        gsap.fromTo('.world-frame', {scale:.92,opacity:.25}, {scale:1,opacity:1,ease:'none',scrollTrigger:{
          trigger:'.world-section',start:'top 85%',end:'center center',scrub:.5,
        }});
        gsap.from('.gameplay-carousel .section-heading', {y:compact ? 15 : 24,ease:'none',scrollTrigger:{
          trigger:'.gameplay-carousel',start:'top bottom',end:'top 55%',scrub:.5,
        }});
        gsap.from('.carousel-viewport', {y:compact ? 30 : 65,ease:'none',scrollTrigger:{
          trigger:'.gameplay-carousel',start:'top bottom',end:'top 35%',scrub:.5,
        }});
        gsap.utils.toArray('.world-selection .game-card').forEach((card,index) => {
          gsap.from(card,{y:compact ? 40 : [80,140,105][index],ease:'none',scrollTrigger:{
            trigger:card,start:'top 98%',end:'top 55%',scrub:.65,
          }});
        });
        gsap.from('.studio-note', {y:compact ? 35 : 60,ease:'none',scrollTrigger:{
          trigger:'.studio-note',start:'top 95%',end:'center 60%',scrub:.5,
        }});
        gsap.from('.studio-mark span', {scaleY:.2,transformOrigin:'bottom',stagger:.1,ease:'none',scrollTrigger:{
          trigger:'.studio-note',start:'top 90%',end:'center 55%',scrub:.5,
        }});
        gsap.from('.landing-outro', {scale:.94,y:45,ease:'none',scrollTrigger:{
          trigger:'.landing-outro',start:'top bottom',end:'center 65%',scrub:.5,
        }});
      });
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    } catch (error) {
      media?.revert(); media = null; libraries = null; enabled = false;
      console.warn('II Games: scroll animations are unavailable; the static page remains usable.',error);
    }
  }
  systemMotion.addEventListener('change',() => {
    enabled = !systemMotion.matches;
    sync();
  });
  sync();
})();
