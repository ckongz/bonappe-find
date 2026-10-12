import {ref,watch,onUnmounted} from 'vue';
// Animates a number from 0 to the target when it changes (respects reduced motion).
export function useCountUp(source,duration=1100){
  const shown=ref(0);let frame;
  const reduce=typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function run(to){
    cancelAnimationFrame(frame);
    if(reduce||!to){shown.value=to||0;return;}
    const start=performance.now();
    const tick=now=>{const t=Math.min(1,(now-start)/duration);shown.value=Math.round(to*(1-Math.pow(1-t,3)));if(t<1)frame=requestAnimationFrame(tick);};
    frame=requestAnimationFrame(tick);
  }
  watch(source,v=>run(Number(v)||0),{immediate:true});
  onUnmounted(()=>cancelAnimationFrame(frame));
  return shown;
}
