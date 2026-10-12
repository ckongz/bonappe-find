import {useUi} from '../stores/index.js';
// Thin wrapper so components can write const toast = useToast(); toast.success('Saved')
export function useToast(){
  const ui=useUi();
  return{success:text=>ui.toast(text,'success'),error:text=>ui.toast(text,'error'),show:ui.toast};
}
