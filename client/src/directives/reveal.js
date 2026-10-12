// v-reveal: fades and lifts an element into view once, with an optional stagger index.
// Usage: <div v-reveal> or <div v-reveal="2"> (index multiplies a 70ms delay) or v-reveal.left
let observer;
function getObserver(){
  if(observer||typeof IntersectionObserver==='undefined')return observer;
  observer=new IntersectionObserver(entries=>{
    for(const e of entries){
      if(e.isIntersecting){e.target.classList.remove('pending');e.target.classList.add('in');observer.unobserve(e.target);}
    }
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  return observer;
}
export default{
  mounted(el,binding){
    el.classList.add('reveal');
    if(binding.modifiers.left)el.classList.add('from-left');
    if(binding.modifiers.right)el.classList.add('from-right');
    if(binding.modifiers.zoom)el.classList.add('from-zoom');
    const index=Number(binding.value)||0;
    if(index)el.style.transitionDelay=Math.min(index,10)*70+'ms';
    const o=getObserver();
    if(o){el.classList.add('pending');o.observe(el);setTimeout(()=>{el.classList.remove('pending');el.classList.add('in');},2200);}else el.classList.add('in');
  },
  unmounted(el){observer?.unobserve(el);}
};
