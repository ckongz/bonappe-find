// Warns before leaving when there are unsaved changes: in-app route changes get a dialog,
// closing/reloading the tab gets the browser's own prompt.
import {ref,onMounted,onUnmounted} from 'vue';
import {onBeforeRouteLeave} from 'vue-router';
export function useUnsavedGuard(isDirty){
  const pending=ref(null);
  const beforeUnload=e=>{if(isDirty()){e.preventDefault();e.returnValue='';}};
  onMounted(()=>window.addEventListener('beforeunload',beforeUnload));
  onUnmounted(()=>window.removeEventListener('beforeunload',beforeUnload));
  onBeforeRouteLeave(()=>{if(!isDirty())return true;return new Promise(resolve=>{pending.value=resolve;});});
  return{pending,stay(){pending.value?.(false);pending.value=null;},leave(){pending.value?.(true);pending.value=null;}};
}
