<script setup>
import {useUi} from '../../stores/index.js';
import Icon from '../common/Icon.vue';
const ui=useUi();
</script>
<template>
  <div class="toast-host" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="t in ui.toasts" :key="t.id" class="toast" :class="t.type"><Icon :name="t.type==='error'?'info':'check'" :size="18"/><span>{{t.text}}</span><button v-if="t.action" class="ghost small undo" @click="t.action()">Undo</button></div>
    </TransitionGroup>
  </div>
</template>
<style scoped>
.toast-host{position:fixed;right:20px;bottom:20px;z-index:80;display:grid;gap:10px;max-width:420px}
.toast{display:flex;align-items:center;gap:12px;background:var(--forestry);color:var(--candle);padding:14px 20px;border-radius:var(--radius);box-shadow:var(--shadow-lg);border-left:5px solid var(--moss-gardens)}
.toast.error{background:var(--bow);border-left-color:#e0a29f}
.undo{color:var(--candle);border-color:rgba(241,236,219,.5)}
.toast-enter-active,.toast-leave-active{transition:all .4s var(--ease)}.toast-enter-from{opacity:0;transform:translateX(60px)}.toast-leave-to{opacity:0;transform:translateX(60px)}
@media(max-width:600px){.toast-host{left:12px;right:12px}}
</style>
