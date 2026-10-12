import {computed} from 'vue';
// Builds a compact page list such as [1,'…',4,5,6,'…',20].
export function usePagination(meta){
  const pages=computed(()=>{
    const total=meta.value.pages||0,page=meta.value.page||1;
    if(total<=7)return Array.from({length:total},(_,i)=>i+1);
    const set=new Set([1,total,page-1,page,page+1]);
    const list=[...set].filter(n=>n>=1&&n<=total).sort((a,b)=>a-b);
    const out=[];list.forEach((n,i)=>{if(i&&n-list[i-1]>1)out.push('…');out.push(n);});
    return out;
  });
  return{pages};
}
