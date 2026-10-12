import {ref,watch} from 'vue';
export function useDebounce(source,delay=250){
  const debounced=ref(source.value);let timer;
  watch(source,v=>{clearTimeout(timer);timer=setTimeout(()=>{debounced.value=v;},delay);});
  return debounced;
}
