// Site-wide micro-interactions: auto scroll-reveal with stagger, button ripple,
// card spotlight, and scroll-spy for "On this page" lists.
// Everything is progressive: with reduced motion or no IntersectionObserver it does nothing.
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=()=>matchMedia('(hover: hover) and (pointer: fine)').matches;

const REVEAL='.route-page .page-head,.route-page .card,.route-page .info-section,.route-page .acc,.route-page .rcard,.route-page .pod,.route-page .editorial-photo,.route-page .process-cover,.route-page .guide-cover';

function setupReveal(){
  if(reduce()||typeof IntersectionObserver==='undefined')return;
  const io=new IntersectionObserver(entries=>{
    for(const e of entries){
      if(!e.isIntersecting)continue;
      const el=e.target;io.unobserve(el);
      el.classList.add('fx-in');
      setTimeout(()=>{el.classList.remove('fx-reveal','fx-in');el.style.removeProperty('--fx-delay');},1100);
    }
  },{threshold:.08,rootMargin:'0px 0px -5% 0px'});
  const seen=new WeakSet();
  function scan(root=document){
    const list=root.querySelectorAll?root.querySelectorAll(REVEAL):[];
    const batch=[];
    list.forEach(el=>{
      if(seen.has(el)||el.classList.contains('reveal')||el.closest('dialog,.consent,.toast-host'))return;
      seen.add(el);
      const r=el.getBoundingClientRect();
      if(r.top<innerHeight*0.9&&r.bottom>0)return;        // already on screen: leave alone, no flash
      batch.push(el);
    });
    batch.forEach((el,i)=>{
      el.style.setProperty('--fx-delay',Math.min(i%6,5)*70+'ms');
      el.classList.add('fx-reveal');
      io.observe(el);
      setTimeout(()=>{el.classList.add('fx-in');},2600);   // safety net
    });
  }
  let t;
  const mo=new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>scan(),90);});
  const main=document.querySelector('main');
  if(main)mo.observe(main,{childList:true,subtree:true});
  scan();
}

function setupRipple(){
  if(reduce())return;
  document.addEventListener('pointerdown',e=>{
    const b=e.target.closest?.('.btn,button:not(.icon-link):not(.acc-head):not(.avatar-btn):not(.top)');
    if(!b||b.disabled)return;
    const r=b.getBoundingClientRect(),d=Math.max(r.width,r.height)*1.6;
    const s=document.createElement('span');
    s.className='fx-ripple';
    s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;
    if(getComputedStyle(b).position==='static')b.style.position='relative';
    b.style.overflow='hidden';
    b.appendChild(s);
    setTimeout(()=>s.remove(),650);
  },{passive:true});
}

function setupSpotlight(){
  if(reduce()||!fine())return;
  document.addEventListener('pointermove',e=>{
    const c=e.target.closest?.('a.card,.rcard,.hoverable,.guide-card,.country-card');
    if(!c)return;
    const r=c.getBoundingClientRect();
    c.style.setProperty('--mx',(e.clientX-r.left)+'px');
    c.style.setProperty('--my',(e.clientY-r.top)+'px');
    c.classList.add('fx-spot');
  },{passive:true});
}

function setupScrollSpy(){
  if(typeof IntersectionObserver==='undefined')return;
  let io,links=[];
  function bind(){
    io?.disconnect();
    const nav=document.querySelector('.info-sidebar nav');
    const secs=[...document.querySelectorAll('.info-section,#additional-details')];
    if(!nav||!secs.length)return;
    links=[...nav.querySelectorAll('a')];
    const visible=new Map();
    io=new IntersectionObserver(es=>{
      es.forEach(e=>visible.set(e.target.id,e.isIntersecting?e.boundingClientRect.top:null));
      let best=null;
      visible.forEach((top,id)=>{if(top!==null&&(best===null||top<best.top))best={id,top};});
      if(!best)return;
      links.forEach(a=>{const on=a.getAttribute('href')==='#'+best.id;a.classList.toggle('current',on);if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
    },{rootMargin:'-20% 0px -60% 0px',threshold:[0,1]});
    secs.forEach(s=>io.observe(s));
  }
  let t;
  new MutationObserver(()=>{clearTimeout(t);t=setTimeout(bind,150);}).observe(document.querySelector('main')||document.body,{childList:true,subtree:true});
  bind();
}

export function initInteractions(){
  setupRipple();setupSpotlight();
  requestAnimationFrame(()=>{setupReveal();setupScrollSpy();});
}
