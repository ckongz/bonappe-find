<script setup>
import {ref,computed,onUnmounted} from 'vue';
import {post,message} from '../services/api.js';
import {useUi,useAuth,useSaved} from '../stores/index.js';
const ui=useUi(),email=ref(''),code=ref(''),password=ref(''),confirmPassword=ref(''),step=ref(false),busy=ref(false),error=ref(''),status=ref(''),done=ref(false),until=ref(0),now=ref(Date.now());
const timer=setInterval(()=>now.value=Date.now(),1000);onUnmounted(()=>clearInterval(timer));
const cooldown=computed(()=>Math.max(0,Math.ceil((until.value-now.value)/1000)));
async function request(){busy.value=true;error.value='';try{const r=(await post('/auth/forgot-password',{email:email.value})).data;step.value=true;code.value='';status.value=r.message;until.value=Date.now()+60000;ui.showVerification(r,email.value,'reset');}catch(e){error.value=message(e);}finally{busy.value=false;}}
async function reset(){error.value='';if(password.value!==confirmPassword.value){error.value='Passwords do not match.';return;}busy.value=true;try{const r=(await post('/auth/reset-password',{email:email.value,code:code.value,password:password.value,confirmPassword:confirmPassword.value})).data;localStorage.removeItem('bonappefind_token');useAuth().user=null;useSaved().replaceRemote([]);status.value=r.message;done.value=true;code.value=password.value=confirmPassword.value='';}catch(e){error.value=message(e);}finally{busy.value=false;}}
function changeEmail(){step.value=false;code.value=password.value=confirmPassword.value='';error.value=status.value='';}
</script>
<template>
<div class="stack">
<p v-if="error" class="error-box" role="alert">{{error}}</p><p v-if="status" class="notice" role="status">{{status}}</p>
<RouterLink v-if="done" to="/login" class="btn">Log in with your new password</RouterLink>
<template v-else>
<form v-if="!step" class="stack" @submit.prevent="request">
<label for="reset-email">Registered email</label><input id="reset-email" v-model="email" type="email" autocomplete="email" required>
<button :disabled="busy||cooldown>0">{{busy?'Requesting code…':cooldown?'Request code in '+cooldown+'s':'Send reset code'}}</button>
</form>
<template v-else>
<p class="small">Resetting password for {{email}}</p>
<form class="stack" @submit.prevent="reset">
<label for="reset-code">Six-digit reset code</label><input id="reset-code" v-model="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" minlength="6" maxlength="6" required>
<label for="reset-new-password">New password</label><input id="reset-new-password" v-model="password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required>
<p class="small muted">Use at least 8 characters with a letter and a number.</p>
<label for="reset-confirm-password">Confirm new password</label><input id="reset-confirm-password" v-model="confirmPassword" type="password" autocomplete="new-password" minlength="8" maxlength="128" required>
<button :disabled="busy">{{busy?'Resetting password…':'Reset password'}}</button>
</form>
<button type="button" class="secondary" :disabled="busy||cooldown>0" @click="request">{{cooldown?'Resend code in '+cooldown+'s':'Resend reset code'}}</button>
<button type="button" class="secondary" :disabled="busy" @click="changeEmail">Change email address</button>
<p class="small muted">Codes expire in 10 minutes, work once, and allow five incorrect attempts. Request a new code if it expires or is locked.</p>
</template>
</template>
</div>
</template>
