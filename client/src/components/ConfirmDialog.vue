<script setup>
// Confirmation dialog built on native <dialog>: Escape, close button and backdrop click all cancel;
// keyboard focus is contained by the browser, starts on the safe button, and returns to the opener.
import {ref,onMounted,onUnmounted,getCurrentInstance} from 'vue';
const uid=getCurrentInstance().uid;
const props=defineProps({title:String,text:String,confirmLabel:{type:String,default:'Confirm'},cancelLabel:{type:String,default:'Cancel'},danger:{type:Boolean,default:true},busy:Boolean});
const emit=defineEmits(['confirm','cancel']);
const dialog=ref(null),closing=ref(false);let previous;
function cancel(){if(closing.value||props.busy)return;closing.value=true;const done=()=>emit('cancel');if(matchMedia('(prefers-reduced-motion: reduce)').matches)done();else setTimeout(done,160);}
function backdrop(e){if(e.target!==dialog.value)return;const r=dialog.value.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)cancel();}
onMounted(()=>{previous=document.activeElement;dialog.value.showModal();document.documentElement.classList.add('modal-open');dialog.value.querySelector('[data-first]')?.focus();});
onUnmounted(()=>{document.documentElement.classList.remove('modal-open');previous?.focus?.();});
</script>
<template>
  <dialog ref="dialog" class="confirm" :class="{closing}" :aria-labelledby="'confirm-title-'+uid" :aria-describedby="'confirm-text-'+uid" @click="backdrop" @cancel.prevent="cancel">
    <button type="button" class="dialog-x ghost" aria-label="Close dialog" @click="cancel"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    <h2 :id="'confirm-title-'+uid">{{title}}</h2>
    <p :id="'confirm-text-'+uid">{{text}}</p>
    <slot/>
    <div class="row actions">
      <button type="button" data-first class="secondary" :disabled="busy" @click="cancel">{{cancelLabel}}</button>
      <button type="button" :class="[danger?'cta':'',{'is-loading':busy}]" :disabled="busy" @click="emit('confirm')"><span>{{confirmLabel}}</span></button>
    </div>
  </dialog>
</template>
<style scoped>
.confirm{position:fixed;inset:0;margin:auto;max-width:500px;width:calc(100% - 32px);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:32px 32px 28px;background:var(--color-surface);color:var(--color-text);box-shadow:var(--shadow-lg);animation:dlg-in .26s var(--ease)}
.confirm::backdrop{background:rgba(20,19,10,.62);backdrop-filter:blur(3px);animation:dlg-fade .25s var(--ease)}
.confirm.closing{animation:dlg-out .16s var(--ease) forwards}.confirm.closing::backdrop{animation:dlg-fade .16s reverse forwards}
.confirm h2{font-size:28px;margin:0 40px 12px 0}.confirm p{margin-bottom:24px}
.actions{justify-content:flex-end}
.dialog-x{position:absolute;right:14px;top:14px;width:44px;height:44px;padding:0;border-radius:50%}
@keyframes dlg-in{from{opacity:0;transform:translateY(14px) scale(.97)}}@keyframes dlg-out{to{opacity:0;transform:translateY(8px) scale(.98)}}@keyframes dlg-fade{from{opacity:0}}
@media(max-width:600px){.confirm{padding:26px 22px 22px}.actions>*{flex:1}}
</style>
