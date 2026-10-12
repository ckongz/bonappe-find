<script setup>
import {ref,onMounted,onUnmounted,watch} from 'vue';
import {useRoute} from 'vue-router';
import {useAuth,useSaved,useUi} from './stores/index.js';
import {get} from './services/api.js';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import ToastHost from './components/layout/ToastHost.vue';
import Icon from './components/common/Icon.vue';
import VerificationPopup from './components/VerificationPopup.vue';
const route=useRoute(),auth=useAuth(),saved=useSaved();
const scrolled=ref(false),progress=ref(0),offline=ref(!navigator.onLine),consent=ref(!localStorage.getItem('bonappefind_consent')),settings=ref({});
try{const prior=JSON.parse(localStorage.getItem('bonappefind_consent'));if(prior?.date&&Date.now()-prior.date>365*86400000)consent.value=true;}catch{}
function top(){window.scrollTo({top:0,behavior:'smooth'});}
function onScroll(){scrolled.value=window.scrollY>600;const h=document.documentElement.scrollHeight-innerHeight;progress.value=h>0?Math.min(100,window.scrollY/h*100):0;}
function network(){offline.value=!navigator.onLine;}
function accept(){localStorage.setItem('bonappefind_consent',JSON.stringify({date:Date.now()}));consent.value=false;}
onMounted(async()=>{
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('online',network);window.addEventListener('offline',network);
  await auth.load();await saved.sync();
  try{settings.value=(await get('/settings')).data;}catch{}
});
onUnmounted(()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('online',network);window.removeEventListener('offline',network);});
watch(()=>route.fullPath,()=>{document.title=(route.meta.title||'Discover')+' | BonAppé Find';});
</script>
<template>
  <a class="skip" href="#main">Skip to main content</a>
  <div class="progress" :style="{width:progress+'%'}" aria-hidden="true"></div>
  <AppHeader/>
  <div v-if="auth.user&&!auth.user.emailVerified" class="notice" role="status"><RouterLink to="/verify-email">Verify your email. Tap here to verify your email address.</RouterLink></div>
  <div v-if="offline" class="notice" role="status">You are offline. Check your connection and try again.</div>
  <div v-if="settings.banner&&(!settings.bannerExpiresAt||new Date(settings.bannerExpiresAt)>new Date())" class="notice">{{settings.banner}}</div>
  <main id="main" tabindex="-1">
    <div v-if="settings.maintenance&&!auth.staff" class="container section"><h1>We are cooking up some improvements.</h1><p>Please check back soon.</p></div>
    <RouterView v-else v-slot="{Component,route:r}"><Transition name="page" mode="out-in"><component :is="Component" :key="r.path" class="route-page"/></Transition></RouterView>
  </main>
  <AppFooter/>
  <ToastHost/>
  <VerificationPopup/>
  <Transition name="slide-up"><div v-if="consent" class="consent card pad row"><Icon name="info" :size="20"/><p class="small">BonAppé Find keeps your saved restaurants in your browser. We do not use advertising cookies.</p><RouterLink to="/cookies" class="small">Cookie Policy</RouterLink><button @click="accept" class="small">Got it</button></div></Transition>
  <Transition name="fade"><button v-if="scrolled" class="top" @click="top" aria-label="Back to top"><Icon name="arrow-up" :size="20"/></button></Transition>
</template>
<style scoped>
.progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--moss-gardens),var(--bow));z-index:60;transition:width .1s linear}
.consent{position:fixed;left:20px;bottom:20px;max-width:560px;z-index:50;gap:12px}.consent p{margin:0;flex:1;min-width:180px}
.top{position:fixed;right:20px;bottom:90px;z-index:40;width:48px;height:48px;padding:0;border-radius:50%;box-shadow:var(--shadow-lg);animation:float 3s ease-in-out infinite}
.slide-up-enter-active,.slide-up-leave-active,.fade-enter-active,.fade-leave-active{transition:all .4s var(--ease)}
.slide-up-enter-from,.slide-up-leave-to{opacity:0;transform:translateY(30px)}.fade-enter-from,.fade-leave-to{opacity:0;transform:scale(.7)}
@media(max-width:600px){.consent{left:12px;right:12px;bottom:12px}.top{bottom:20px}}
</style>
