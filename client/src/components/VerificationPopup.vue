<script setup>
import {ref,watch,nextTick} from 'vue';
import {useUi} from '../stores/index.js';
const ui=useUi(),dialog=ref(null);
watch(()=>ui.verification,async value=>{await nextTick();if(value&&!dialog.value.open)dialog.value.showModal();else if(!value&&dialog.value.open)dialog.value.close();});
function close(){ui.verification=null;}
</script>
<template>
<dialog ref="dialog" class="verification-popup" aria-labelledby="code-popup-title" aria-describedby="code-popup-help" @close="close" @cancel="close" @click="event=>{if(event.target===dialog)close()}">
<div v-if="ui.verification" class="stack">
<h2 id="code-popup-title">{{ui.verification.purpose==='reset'?'Your password reset code':'Your verification code'}}</h2>
<p>{{ui.verification.email}}</p>
<p class="verification-number">{{ui.verification.code}}</p>
<p id="code-popup-help">Email delivery is simulated. {{ui.verification.purpose==='reset'?'Enter this code in the password reset form.':'Enter this code on the Verify Email page.'}} It expires in 10 minutes and can only be used once.</p>
<RouterLink :to="ui.verification.purpose==='reset'?'/forgot-password':'/verify-email'" class="btn" @click="close">{{ui.verification.purpose==='reset'?'Continue password reset':'Go to Verify Email'}}</RouterLink>
<button type="button" class="secondary" autofocus @click="close">Close</button>
</div>
</dialog>
</template>
<style scoped>
.verification-popup{width:min(440px,calc(100% - 32px));max-height:85vh;overflow:auto;padding:28px;border:1px solid var(--color-border);border-radius:20px;background:var(--color-surface);color:var(--color-text);box-shadow:var(--shadow-lg)}
.verification-popup::backdrop{background:rgba(0,0,0,.5)}
.verification-popup h2,.verification-popup p{margin:0;overflow-wrap:anywhere}
.verification-number{font-size:36px;font-weight:800;letter-spacing:8px;text-align:center;padding:18px;border-radius:12px;background:var(--color-chip);user-select:all}
</style>
