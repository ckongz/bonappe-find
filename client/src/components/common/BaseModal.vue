<script setup>
// Accessible modal: native <dialog> (focus is trapped and Escape is handled by the browser),
// visible close button, backdrop click, focus restored to the opener, and an optional
// "discard changes?" step when `dirty` is true.
import {ref,onMounted,onUnmounted,nextTick,getCurrentInstance} from 'vue';
const uid=getCurrentInstance().uid;
const props=defineProps({title:{type:String,required:true},dirty:Boolean,size:{type:String,default:'md'}});
const emit=defineEmits(['close']);
const dialog=ref(null),closing=ref(false),warn=ref(false);let opener;
function reallyClose(){if(closing.value)return;closing.value=true;const done=()=>emit('close');if(matchMedia('(prefers-reduced-motion: reduce)').matches)done();else setTimeout(done,180);}
function requestClose(){if(props.dirty&&!warn.value){warn.value=true;nextTick(()=>dialog.value?.querySelector('[data-keep]')?.focus());return;}reallyClose();}
function onBackdrop(e){if(e.target===dialog.value){const r=dialog.value.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)requestClose();}}
onMounted(()=>{opener=document.activeElement;dialog.value.showModal();document.documentElement.classList.add('modal-open');});
onUnmounted(()=>{document.documentElement.classList.remove('modal-open');opener?.focus?.();});
</script>
<template>
  <dialog ref="dialog" class="modal" :class="['size-'+size,{closing}]" :aria-labelledby="'modal-title-'+uid" @cancel.prevent="requestClose" @click="onBackdrop">
    <header class="modal-head"><h2 :id="'modal-title-'+uid">{{title}}</h2><button type="button" class="modal-close ghost" aria-label="Close dialog" @click="requestClose"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>
    <div class="modal-body"><slot/></div>
    <footer v-if="$slots.footer" class="modal-foot"><slot name="footer"/></footer>
    <Transition name="expand-fade"><div v-if="warn" class="discard" role="alertdialog" aria-labelledby="discard-t"><p id="discard-t"><b>Discard your changes?</b> What you typed here has not been saved.</p><div class="row"><button type="button" data-keep class="secondary small" @click="warn=false">Keep editing</button><button type="button" class="cta small" @click="reallyClose">Discard</button></div></div></Transition>
  </dialog>
</template>
<style scoped>
.modal{width:calc(100% - 32px);max-width:520px;border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:0;background:var(--color-surface);color:var(--color-text);box-shadow:var(--shadow-lg);animation:modal-in .28s var(--ease)}
.modal.size-lg{max-width:760px}
.modal::backdrop{background:rgba(20,19,10,.62);backdrop-filter:blur(3px);animation:fade-in .25s var(--ease)}
.modal.closing{animation:modal-out .18s var(--ease) forwards}.modal.closing::backdrop{animation:fade-out .18s forwards}
.modal-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 24px 8px}
.modal-head h2{margin:0;font-size:28px}
.modal-close{width:44px;height:44px;padding:0;flex:none;border-radius:50%}
.modal-body{padding:8px 24px 24px}.modal-foot{display:flex;gap:12px;flex-wrap:wrap;justify-content:flex-end;padding:0 24px 24px}
.discard{position:sticky;bottom:0;margin:0;padding:16px 24px;background:var(--bow-soft);border-top:1.5px solid var(--bow)}.discard p{margin:0 0 12px}
@keyframes modal-in{from{opacity:0;transform:translateY(14px) scale(.97)}}@keyframes modal-out{to{opacity:0;transform:translateY(8px) scale(.98)}}
@keyframes fade-in{from{opacity:0}}@keyframes fade-out{to{opacity:0}}
@media(max-width:600px){.modal-head h2{font-size:24px}.modal-body,.modal-foot,.discard,.modal-head{padding-inline:18px}}
</style>
