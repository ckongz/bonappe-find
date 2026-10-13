<script setup>
import ResetCode from '../components/ResetCode.vue';
import VerifyCode from '../components/VerifyCode.vue';
import {ref,computed,watch,onMounted,nextTick} from 'vue';import {useRoute,useRouter} from 'vue-router';import {post,get,message} from '../services/api.js';import {useAuth,useSaved,useUi} from '../stores/index.js';
const route=useRoute(),router=useRouter(),auth=useAuth(),saved=useSaved(),ui=useUi();
const form=ref({name:'',email:'',password:'',confirmPassword:'',businessName:'',phone:'',position:''}),busy=ref(false),error=ref(''),status=ref(''),showPassword=ref(false),showConfirm=ref(false),loginRole=ref('customer');
const mode=computed(()=>route.meta.kind),isRegister=computed(()=>['register','owner-register'].includes(mode.value)),passwordStrength=computed(()=>[form.value.password.length>=8,/[a-z]/.test(form.value.password),/[A-Z]/.test(form.value.password),/\d/.test(form.value.password),/[^a-zA-Z0-9]/.test(form.value.password)].filter(Boolean).length);
const title=computed(()=>({login:'Welcome back',register:'Create an account','owner-register':'Register your restaurant',forgot:'Forgot password?',reset:'Choose a new password',verify:'Verify your email',logout:"You're logged out"})[mode.value]);
const sub=computed(()=>({login:'Log in to see your saved restaurants, reviews and lists, wherever you are.',register:'Save restaurants, write reviews and build your own shortlist in one place.','owner-register':'Your owner account starts as pending. Verify your email and wait for administrator approval before managing listings.',forgot:"Enter your registered email, and we'll send you a six-digit code to reset your password.",reset:'Pick a strong password you have not used before.',verify:'Enter the verification code sent to your email.',logout:'Your saved list stays in this browser. Log in again whenever you are ready.'})[mode.value]);
const art=computed(()=>({login:['Welcome back','Pick up your saved list right where you left it.'],register:['Join BonAppé Find','Save the places worth eating at, and find your next favourite.'],'owner-register':['For restaurant owners','Claim your listing and keep every detail accurate.'],forgot:['No stress','Reset your password and get back to the table.'],reset:['Nearly there','Choose a new password and sign back in.'],verify:['Almost there','One quick check and your account is ready.'],logout:['See you soon','Your table will be here when you come back.']})[mode.value]||['','']);
const roles=[{role:'customer',label:'Customer',hint:'Browse freely and log in to save a personal list.'},{role:'owner',label:'Owner',hint:'Manage only the listings connected to your owner account.'},{role:'admin',label:'Admin',hint:'Authorized administrators only. Public admin sign-up is not available.'}];
const roleHint=computed(()=>roles.find(r=>r.role===loginRole.value)?.hint);
const switchLine=computed(()=>({login:['Don\'t have an account?','Sign up','/register'],register:['Already have an account?','Log in','/login'],'owner-register':['Already have an account?','Log in','/login'],forgot:['Remembered it?','Log in','/login'],reset:['Changed your mind?','Log in','/login'],verify:['Done here?','Log in','/login'],logout:['New here?','Sign up','/register']})[mode.value]);
const demos=[{role:'customer',label:'Customer',email:'customer@example.test',password:'ReviewOnly123',destination:'/account'},{role:'owner',label:'Restaurant Owner',email:'owner@example.test',password:'ReviewOnly123',destination:'/owner'},{role:'admin',label:'Administrator',email:'reviewer@example.test',password:'ReviewOnly123',destination:'/admin'}];
function useDemo(d){loginRole.value=d.role;form.value.email=d.email;form.value.password=d.password;error.value='';status.value='Demo credentials filled in. Select Log in when ready.';}
async function loginDemo(d){useDemo(d);await submit(d.destination);}
const touched=ref({}),shake=ref(false),mailRx=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const errs=computed(()=>{const f=form.value,e={},m=mode.value;
 if(isRegister.value&&!f.name.trim())e.name='Please tell us your name.';
 if(m!=='reset'&&m!=='verify'){if(!f.email.trim())e.email='Enter your email address.';else if(!mailRx.test(f.email.trim()))e.email='Enter an email address like name@example.com.';}
 if(m==='owner-register'){if(!f.businessName.trim())e.businessName='Enter your business name.';if(!f.phone.trim())e.phone='Enter a business phone number.';if(!f.position.trim())e.position='Enter your position or role.';}
 if(m!=='forgot'&&m!=='verify'){if(!f.password)e.password=m==='login'?'Enter your password.':'Choose a password.';else if(m!=='login'&&(f.password.length<8||!/[a-zA-Z]/.test(f.password)||!/\d/.test(f.password)))e.password='Use at least 8 characters with a letter and a number.';}
 if(isRegister.value||m==='reset'){if(!f.confirmPassword)e.confirmPassword='Re-enter your password to confirm it.';else if(f.confirmPassword!==f.password)e.confirmPassword='Passwords do not match yet.';}
 return e;});
const showErr=k=>touched.value[k]&&errs.value[k]?errs.value[k]:'';
const touch=k=>{touched.value={...touched.value,[k]:true};};
const ids={name:'auth-name',email:'auth-email',businessName:'owner-businessName',phone:'owner-phone',position:'owner-position',password:'auth-password',confirmPassword:'confirm-password'};
async function submit(forcedDestination=''){error.value='';status.value='';if(!forcedDestination){const keys=Object.keys(errs.value);touched.value=Object.fromEntries(Object.keys(ids).map(k=>[k,true]));if(keys.length){shake.value=false;await nextTick();shake.value=true;setTimeout(()=>shake.value=false,500);document.getElementById(ids[keys[0]])?.focus();return;}}busy.value=true;try{const path=mode.value==='login'?'/auth/login':mode.value==='register'?'/auth/register':mode.value==='owner-register'?'/owners/register':mode.value==='forgot'?'/auth/forgot-password':'/auth/reset-password';const r=await post(path,{...form.value,token:route.params.token});if(r.data.token){auth.accept(r.data);ui.showVerification(r.data.delivery,r.data.user.email);await saved.sync();ui.toast(isRegister.value?r.data.message||'Verify your email. Tap here to verify your email address.':'Welcome back!');router.push(forcedDestination||(auth.staff?'/admin':auth.user.role==='owner'?'/owner':route.query.redirect||'/account'));}else status.value=r.data.message;}catch(e){error.value=message(e)||e.message;}finally{busy.value=false;}}
watch(()=>route.fullPath,()=>{error.value='';status.value='';touched.value={};});
</script>
<template>
<div class="auth-page"><div class="auth-card" :class="'mode-'+mode">
<aside class="auth-art" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span>
<div class="art-copy"><p>{{art[0]}}</p><h2>{{art[1]}}</h2></div></aside>

<section class="auth-panel"><div class="auth-inner">
<h1>{{title}}</h1><p class="lede">{{sub}}</p>

<div v-if="mode==='login'" class="role-tabs" role="group" aria-label="Choose login type"><button v-for="r in roles" :key="r.role" type="button" :class="{on:loginRole===r.role}" :aria-pressed="loginRole===r.role" @click="loginRole=r.role">{{r.label}}</button></div>
<p v-if="mode==='login'" class="role-hint">{{roleHint}}</p>

<Transition name="expand-fade"><p v-if="error" role="alert" class="error-box">{{error}}</p></Transition><Transition name="expand-fade"><p v-if="status" role="status" class="notice">{{status}}</p></Transition>

<ResetCode v-if="mode==='forgot'||mode==='reset'"/><VerifyCode v-if="mode==='verify'"/><div v-if="mode==='logout'" class="logout-actions"><RouterLink to="/login" class="btn primary-btn">Log in again</RouterLink><RouterLink to="/" class="btn ghost-btn">Back to home</RouterLink></div>

<form :aria-busy="busy" v-if="mode!=='verify'&&mode!=='logout'&&mode!=='forgot'&&mode!=='reset'" novalidate @submit.prevent="submit()" class="auth-form" :class="{shake}">
<div v-if="isRegister" class="field"><label for="auth-name">Your name</label><input id="auth-name" v-model="form.name" placeholder="Maria Santos" autocomplete="name" maxlength="120" :aria-invalid="!!showErr('name')" aria-describedby="auth-name-msg" @blur="touch('name')"><p id="auth-name-msg" v-if="showErr('name')" class="field-msg">{{showErr('name')}}</p></div>
<div v-if="mode!=='reset'" class="field"><label for="auth-email">{{mode==='login'?'Your email':'Email address'}}</label><input id="auth-email" v-model="form.email" type="email" placeholder="name@example.com" autocomplete="email" :aria-invalid="!!showErr('email')" aria-describedby="auth-email-msg" @blur="touch('email')"><p id="auth-email-msg" v-if="showErr('email')" class="field-msg">{{showErr('email')}}</p></div>
<template v-if="mode==='owner-register'"><div v-for="[key,label] in [['businessName','Business name'],['phone','Business phone'],['position','Position / role in business']]" :key="key" class="field"><label :for="'owner-'+key">{{label}}</label><input :id="'owner-'+key" v-model="form[key]" :aria-invalid="!!showErr(key)" :aria-describedby="'owner-'+key+'-msg'" @blur="touch(key)"><p :id="'owner-'+key+'-msg'" v-if="showErr(key)" class="field-msg">{{showErr(key)}}</p></div></template>
<div v-if="mode!=='forgot'" class="field"><div class="label-row"><label for="auth-password">{{mode==='reset'?'New password':'Password'}}</label><RouterLink v-if="mode==='login'" to="/forgot-password" class="mini-link">Forgot password?</RouterLink></div>
<div class="password-field"><input id="auth-password" v-model="form.password" :type="showPassword?'text':'password'" placeholder="••••••••••" maxlength="128" :autocomplete="mode==='login'?'current-password':'new-password'" :aria-invalid="!!showErr('password')" aria-describedby="auth-password-msg" @blur="touch('password')"><button type="button" class="eye" @click="showPassword=!showPassword" :aria-label="showPassword?'Hide password':'Show password'" :aria-pressed="showPassword"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path v-if="!showPassword" d="M4 4l16 16"/></svg></button></div>
<p id="auth-password-msg" v-if="showErr('password')" class="field-msg">{{showErr('password')}}</p>
<template v-if="isRegister||mode==='reset'"><p v-if="!showErr('password')" class="field-msg hint">Use at least 8 characters with a letter and a number.</p><meter min="0" max="5" :value="passwordStrength" aria-label="Password strength"></meter><p class="small strength">Strength: {{['Very weak','Weak','Fair','Good','Strong','Very strong'][passwordStrength]}}</p></template></div>
<div v-if="isRegister||mode==='reset'" class="field"><label for="confirm-password">Confirm password</label><div class="password-field"><input id="confirm-password" v-model="form.confirmPassword" :type="showConfirm?'text':'password'" placeholder="••••••••••" autocomplete="new-password" :aria-invalid="!!showErr('confirmPassword')" aria-describedby="confirm-password-msg" @blur="touch('confirmPassword')" @input="touch('confirmPassword')"><button type="button" class="eye" @click="showConfirm=!showConfirm" :aria-label="showConfirm?'Hide password':'Show password'" :aria-pressed="showConfirm"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path v-if="!showConfirm" d="M4 4l16 16"/></svg></button></div><p id="confirm-password-msg" v-if="showErr('confirmPassword')" class="field-msg">{{showErr('confirmPassword')}}</p><p v-else-if="form.confirmPassword&&form.confirmPassword===form.password" class="field-msg ok">Passwords match.</p></div>
<button class="primary-btn" :class="{'is-loading':busy}" :disabled="busy"><span>{{mode==='login'?'Log in':isRegister?'Get started':mode==='forgot'?'Send reset link':'Save password'}}</span></button></form>



<p class="switch">{{switchLine[0]}} <RouterLink :to="switchLine[2]">{{switchLine[1]}}</RouterLink><template v-if="mode==='register'"> · <RouterLink to="/register/owner">Own a restaurant?</RouterLink></template><template v-if="mode==='login'"> · <RouterLink to="/register/owner">Own a restaurant?</RouterLink></template></p>
</div></section></div>

<section v-if="mode==='login'" class="demo-accounts" aria-labelledby="demo-title"><div class="demo-head"><div><h2 id="demo-title">Sample accounts for checking</h2><p>Click <b>Use</b> to fill the form, or <b>Log in</b> to sign in right away. These accounts are created by <code>npm run demo</code>; the temporary demo data is erased when the demo server exits.</p></div><span class="badge">Demo only</span></div>
<div class="demo-grid"><article v-for="d in demos" :key="d.role" class="demo-card"><h3>{{d.label}}</h3><p><b>Email:</b> {{d.email}}<br><b>Password:</b> {{d.password}}</p><div class="row"><button type="button" class="ghost-btn" :disabled="busy" @click="useDemo(d)">Use</button><button type="button" class="primary-btn" :disabled="busy" @click="loginDemo(d)">Log in</button></div></article></div></section>
</div></template>
<style scoped>
.auth-page{--ink:#1d1b16;--acc:var(--forestry);--glow:rgba(47,61,32,.38);max-width:1060px;margin:0 auto;padding:44px 20px 88px}
.auth-card{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0;padding:14px;background:var(--color-surface);border:1px solid var(--color-border);border-radius:26px;box-shadow:0 24px 60px rgba(47,61,32,.16);min-height:600px}
.auth-art{position:relative;overflow:hidden;border-radius:20px;color:var(--candle);display:flex;flex-direction:column;justify-content:flex-end;padding:28px;background:linear-gradient(160deg,#e8efd6 0%,#b9c79a 30%,var(--moss-gardens) 52%,var(--forestry) 82%,var(--juniper) 100%);isolation:isolate}
.blob{position:absolute;border-radius:50%;filter:blur(46px);z-index:-1}
.b1{width:300px;height:300px;left:-70px;top:70px;background:var(--juniper);opacity:.95}
.b2{width:220px;height:220px;right:-50px;top:-30px;background:#f1ecdb;opacity:.85}
.b3{width:260px;height:260px;right:-60px;bottom:20px;background:var(--bow);opacity:.5}
.art-copy p{margin:0 0 8px;font-size:15px;opacity:.9}
.art-copy h2{margin:0;color:#fff;font-size:clamp(24px,2.7vw,32px);line-height:1.18;max-width:15em}
.auth-panel{display:flex;align-items:center;justify-content:center;padding:34px 38px}
.auth-inner{width:100%;max-width:370px}
.auth-inner h1{font-size:clamp(28px,3.2vw,36px);line-height:1.1;margin:0 0 10px}
.lede{margin:0 0 22px;color:var(--color-muted);font-size:14px;line-height:1.6}
.role-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:4px;margin-bottom:8px;background:var(--color-chip);border-radius:12px}
.role-tabs button{min-height:36px;padding:6px 8px;border:0;border-radius:9px;background:transparent;color:var(--color-text);font-size:13px;font-weight:700;box-shadow:none;transform:none}
.role-tabs button:hover{background:rgba(255,255,255,.55);transform:none;box-shadow:none;color:var(--color-text)}
.role-tabs button.on{background:var(--acc);color:var(--candle);box-shadow:0 4px 12px var(--glow)}
.role-hint{margin:0 0 18px;font-size:12px;color:var(--color-muted);line-height:1.5}
.auth-form .field{margin-bottom:14px;min-width:0}
.auth-form label{display:block;margin-bottom:6px;font-size:13px;font-weight:700;color:var(--color-heading)}
.auth-form input{min-height:44px;border-radius:10px;border:1.5px solid var(--color-border);background:var(--color-bg);font-size:14px;padding:10px 14px}
.label-row{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
.mini-link{font-size:12px;font-weight:700;color:var(--acc);text-underline-offset:4px}
.password-field{position:relative}
.password-field input{padding-right:46px}
.auth-panel .eye{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:34px;min-height:34px;height:34px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--color-muted);box-shadow:none}
.auth-panel .eye:hover{background:var(--color-chip);color:var(--color-text);transform:translateY(-50%);box-shadow:none}
.auth-form meter{width:100%;height:8px;margin-top:6px}
.strength{margin:4px 0 0}
.auth-panel .primary-btn{width:100%;min-height:46px;margin-top:6px;border:0;border-radius:10px;background:var(--acc);color:#fff;font-weight:700;box-shadow:0 10px 22px var(--glow)}
.auth-panel .primary-btn:hover{background:var(--juniper);box-shadow:0 12px 26px var(--glow)}
.auth-panel .ghost-btn,.demo-card .ghost-btn{min-height:46px;border-radius:10px;border:1.5px solid var(--color-border);background:transparent;color:var(--color-text);box-shadow:none}
.auth-panel .ghost-btn:hover,.demo-card .ghost-btn:hover{background:var(--color-chip);color:var(--color-text);box-shadow:none}
.logout-actions{display:grid;gap:10px;margin-top:6px}
.or{display:flex;align-items:center;gap:12px;margin:22px 0 14px;color:var(--color-muted);font-size:11px}
.or::before,.or::after{content:"";flex:1;height:1px;background:var(--color-border)}
.socials{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.auth-panel .social{min-height:40px;padding:0;border:1px solid var(--color-border);border-radius:10px;background:var(--color-chip);color:var(--color-text);font-weight:800;font-size:15px;box-shadow:none}
.auth-panel .social:hover{background:var(--color-border);transform:none;box-shadow:none;color:var(--color-text)}
.switch{margin:22px 0 0;text-align:center;font-size:13px;color:var(--color-muted)}
.switch a{font-weight:700;color:var(--acc);text-underline-offset:4px}
.error-box,.notice{margin:0 0 16px;font-size:13px}
.demo-accounts{margin:26px auto 0;padding:26px;background:var(--color-surface);border:1px solid var(--color-border);border-radius:20px}
.demo-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}
.demo-head h2{font-size:24px;margin:0 0 6px}
.demo-head p{margin:0;max-width:760px;color:var(--color-muted);font-size:14px;line-height:1.6}
.demo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:18px}
.demo-card{display:flex;flex-direction:column;min-width:0;padding:18px;border:1px solid var(--color-border);border-radius:14px;background:var(--color-bg)}
.demo-card h3{font-size:18px;margin:0 0 8px}
.demo-card p{font-size:13px;line-height:1.65;overflow-wrap:anywhere;flex:1;margin:0}
.demo-card .row{margin-top:12px;gap:8px}
.demo-card button{min-height:40px;padding:7px 16px;font-size:13px;border-radius:10px}
.demo-card .primary-btn{border:0;background:var(--acc);color:#fff;box-shadow:0 6px 14px var(--glow)}
.demo-card .primary-btn:hover{background:var(--juniper)}
:root[data-theme=dark] .auth-page{--acc:var(--moss-gardens);--glow:rgba(117,137,86,.35)}
:root[data-theme=dark] .role-tabs button:hover{background:rgba(255,255,255,.08)}
@media(max-width:820px){
 .auth-card{grid-template-columns:1fr;min-height:0;padding:10px}
 .auth-art{min-height:200px;padding:22px}
 .art-copy h2{font-size:22px}
 .auth-panel{padding:28px 14px 22px}
 .demo-grid{grid-template-columns:1fr}
 .demo-head{flex-direction:column}
}
@media(prefers-reduced-motion:reduce){.auth-form,.role-tabs button{transition:none}}
</style>
