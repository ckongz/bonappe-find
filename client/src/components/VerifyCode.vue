<script setup>
import {ref,computed,onUnmounted} from 'vue';
import {post,message} from '../services/api.js';
import {useAuth,useUi} from '../stores/index.js';
const auth=useAuth(),code=ref(''),email=ref(auth.user?.email||''),password=ref(''),correcting=ref(false),busy=ref(false),error=ref(''),status=ref(''),now=ref(Date.now());
const timer=setInterval(()=>now.value=Date.now(),1000);onUnmounted(()=>clearInterval(timer));
const cooldown=computed(()=>Math.max(0,Math.ceil((new Date(auth.user?.verifySentAt||0).getTime()+60000-now.value)/1000)));
async function run(path,data){busy.value=true;error.value='';status.value=path==='/auth/verify-email'?'Checking your verification code…':'';try{const r=(await post(path,data)).data;if(r.user)auth.user=r.user;else await auth.load();useUi().showVerification(r,auth.user?.email);status.value=r.message;code.value='';password.value='';correcting.value=false;}catch(e){error.value=message(e);status.value='';}finally{busy.value=false;}}
</script>
<template>
<div v-if="!auth.user" class="notice"><RouterLink to="/login">Log in</RouterLink> or <RouterLink to="/register">create an account</RouterLink> to verify your email.</div>
<div v-else class="stack">
<p v-if="error" role="alert" class="error-box">{{error}}</p><p v-if="status" role="status" class="notice">{{status}}</p>
<p v-if="auth.user.emailVerified" class="notice">Your email is verified.</p>
<template v-else>
<p>Enter the verification code sent to your email.</p><p class="small">Registered email: {{auth.user.email}}</p>
<form class="stack" @submit.prevent="run('/auth/verify-email',{code})"><label for="verification-code">Verification code</label><input id="verification-code" v-model="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" minlength="6" maxlength="6" required placeholder="Six-digit code"><button :disabled="busy">{{busy?'Checking your verification code…':'Verify email'}}</button></form>
<button type="button" class="secondary" :disabled="busy||cooldown>0" @click="run('/auth/resend-verification',{})">{{cooldown?'Resend code in '+cooldown+'s':'Resend code'}}</button>
<button type="button" class="secondary" :disabled="busy" @click="correcting=!correcting">Correct email address</button>
<form v-if="correcting" class="stack" @submit.prevent="run('/auth/correct-email',{email,password})"><label for="correct-email">Correct email address</label><input id="correct-email" v-model="email" type="email" required><label for="correct-password">Current password</label><input id="correct-password" v-model="password" type="password" autocomplete="current-password" required><button :disabled="busy||cooldown>0">Save email and request code</button></form>
<p class="small muted">Codes expire in 10 minutes and work once. After five incorrect attempts, request a new code. If email delivery is not configured in development, no email is sent; a simulated code appears in a popup and in the server terminal.</p>
</template></div>
</template>
