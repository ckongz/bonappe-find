<script setup>
import {ref,computed,onMounted,onUnmounted,watch} from 'vue';
import {useRouter,useRoute} from 'vue-router';
import {useAuth,useSaved} from '../../stores/index.js';
import Icon from '../common/Icon.vue';
const router=useRouter(),route=useRoute(),auth=useAuth(),saved=useSaved();
const menu=ref(false),scrolled=ref(false),quick=ref(''),dark=ref(document.documentElement.dataset.theme==='dark'),moreOpen=ref(false),userMenu=ref(false),headerEl=ref(null);
const nav=[['Home','/'],['About','/about'],['Features','/features'],['Restaurants','/restaurants'],['Countries','/countries'],['Best Quality','/best-quality'],['Guides','/guides'],['FAQs','/faqs'],['Contact','/contact']];
const more=[['Insights','/insights','trending'],['Cuisines','/cuisines','utensils'],['Surprise Me','/surprise','shuffle'],['Compare','/compare','compare'],['Saved','/saved','heart'],['Team','/team','user'],['How It Works','/how-it-works','info'],['Trending','/trending','flame'],['Newly Added','/new','sparkles'],['Top Rated','/top-rated','star'],['Dishes','/dishes','bowl'],['Festivals','/festivals','calendar']];
const accountLink=computed(()=>auth.staff?'/admin':auth.user?.role==='owner'?'/owner':'/account');
const dashLabel=computed(()=>auth.staff?'Admin dashboard':auth.user?.role==='owner'?'Owner dashboard':'My dashboard');
const initials=computed(()=>(auth.user?.name||'?').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase());
const firstName=computed(()=>(auth.user?.name||'').split(/\s+/)[0]);
const moreActive=computed(()=>more.some(m=>isActive(m[1])));
function isActive(url){return url==='/'?route.path==='/':route.path===url||route.path.startsWith(url+'/');}
function onScroll(){scrolled.value=window.scrollY>12;}
function closeAll(){menu.value=false;moreOpen.value=false;userMenu.value=false;}
function shortcut(e){if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();setTimeout(()=>document.querySelector('#quick-search')?.focus(),0);}if(e.key==='Escape')closeAll();}
function outside(e){if(headerEl.value&&!headerEl.value.contains(e.target))closeAll();else if(!e.target.closest?.('.user-menu'))userMenu.value=false;}
function theme(){const v=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=v;dark.value=v==='dark';try{localStorage.setItem('bonappefind_theme',v);}catch{}}
async function logout(){closeAll();await auth.logout();router.push('/logged-out');}
function submit(){const q=quick.value.trim();router.push({path:'/restaurants',query:q?{search:q}:{}});menu.value=false;}
onMounted(()=>{window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('keydown',shortcut);document.addEventListener('click',outside);onScroll();});
onUnmounted(()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('keydown',shortcut);document.removeEventListener('click',outside);});
watch(()=>route.fullPath,closeAll);
</script>
<template>
  <header ref="headerEl" :class="{scrolled}">
    <div class="container header-top">
      <RouterLink to="/" class="wordmark" aria-label="BonAppé Find, go to the home page"><span>BonAppé Find</span></RouterLink>
      <form class="search-pill" role="search" @submit.prevent="submit">
        <label class="sr-only" for="quick-search">Search a restaurant or cuisine</label>
        <Icon name="search" :size="18"/>
        <input id="quick-search" v-model="quick" type="search" placeholder="Search restaurants or cuisines" autocomplete="off">
        <kbd class="hint" aria-hidden="true">/</kbd>
        <button aria-label="Search restaurants" class="go">Search</button>
      </form>
      <div class="header-actions">
        <RouterLink to="/saved" class="icon-link saved-link" :aria-label="'Saved restaurants, '+saved.saved.length+' saved'"><Icon name="heart" :size="20" :fill="saved.saved.length>0"/><span v-if="saved.saved.length" class="count" :key="saved.saved.length">{{saved.saved.length}}</span></RouterLink>
        <button class="icon-link theme" @click="theme" :aria-label="dark?'Switch to light mode':'Switch to dark mode'" :aria-pressed="dark"><Icon :name="dark?'sun':'moon'" :size="20"/></button>
        <div v-if="auth.user" class="user-menu">
          <button class="avatar-btn" type="button" :aria-expanded="userMenu" aria-haspopup="menu" aria-controls="user-panel" :aria-label="'Account menu for '+auth.user.name" @click="userMenu=!userMenu;moreOpen=false"><span class="avatar" aria-hidden="true">{{initials}}</span><span class="who">{{firstName}}</span><Icon name="chevron-down" :size="14" class="chev" :class="{open:userMenu}"/></button>
          <Transition name="drop"><div v-show="userMenu" id="user-panel" class="user-panel" role="menu" aria-label="Account menu">
            <div class="up-head"><span class="avatar big" aria-hidden="true">{{initials}}</span><div><b>{{auth.user.name}}</b><span>{{auth.user.role}}</span></div></div>
            <RouterLink :to="accountLink" role="menuitem"><Icon name="grid" :size="16"/>{{dashLabel}}</RouterLink>
            <RouterLink to="/saved" role="menuitem"><Icon name="heart" :size="16"/>Saved restaurants</RouterLink>
            <RouterLink to="/account/settings" role="menuitem"><Icon name="sliders" :size="16"/>Account settings</RouterLink>
            <button type="button" class="up-logout" role="menuitem" @click="logout"><Icon name="logout" :size="16"/>Log out</button>
          </div></Transition>
        </div>
        <RouterLink v-else to="/login" class="login-btn">Log in</RouterLink>
        <RouterLink v-if="!auth.user||auth.user.role==='customer'" to="/suggest-restaurant" class="btn secondary small add-link">Suggest a Restaurant</RouterLink><RouterLink v-if="auth.canManage" to="/restaurants/new" class="btn cta small add-link"><Icon name="plus" :size="16"/>Add a Restaurant</RouterLink>
        <button class="icon-link menu-toggle" @click="menu=!menu" :aria-expanded="menu" aria-controls="navigation" :aria-label="menu?'Close menu':'Open menu'"><Icon :name="menu?'x':'menu'" :size="24"/></button>
      </div>
    </div>
    <nav @focusout="e=>{if(!e.currentTarget.contains(e.relatedTarget))moreOpen=false}" id="navigation" class="container navigation" :class="{expanded:menu}" aria-label="Main navigation">
      <form class="mobile-search" role="search" @submit.prevent="submit"><Icon name="search" :size="18"/><input v-model="quick" type="search" placeholder="Search restaurants or cuisines" aria-label="Search restaurants or cuisines" autocomplete="off"><button class="go">Search</button></form>
      <div class="nav-links">
        <RouterLink v-for="[name,url] in nav" :key="url" :to="url" :class="{active:isActive(url)}">{{name}}</RouterLink>
        <div class="more" @mouseleave="moreOpen=false">
          <button class="more-btn" :class="{active:moreActive}" :aria-expanded="moreOpen" aria-haspopup="true" aria-controls="more-panel" @click="moreOpen=!moreOpen;userMenu=false" @mouseenter="moreOpen=true">More <Icon name="chevron-down" :size="14" class="chev" :class="{open:moreOpen}"/></button>
          <Transition name="drop"><div v-show="moreOpen||menu" id="more-panel" class="more-menu"><RouterLink v-for="[name,url,icon] in more" :key="url" :to="url"><Icon :name="icon" :size="16"/>{{name}}</RouterLink><RouterLink to="/terms"><Icon name="book" :size="16"/>Terms of Use</RouterLink><RouterLink to="/privacy"><Icon name="shield" :size="16"/>Privacy Policy</RouterLink></div></Transition>
        </div>
      </div>
      <div class="mobile-actions"><RouterLink v-if="!auth.user||auth.user.role==='customer'" to="/suggest-restaurant" class="btn secondary small">Suggest a Restaurant</RouterLink>
        <RouterLink :to="auth.user?accountLink:'/login'" class="btn secondary small">{{auth.user?dashLabel:'Log in'}}</RouterLink><button v-if="auth.user" class="btn secondary small" type="button" @click="logout">Log out</button><RouterLink v-if="auth.canManage" to="/restaurants/new" class="btn cta small"><Icon name="plus" :size="16"/>Add a Restaurant</RouterLink>
      </div>
    </nav>
  </header>
</template>
<style scoped>
header{background:linear-gradient(180deg,#34451f,var(--forestry));color:var(--candle);position:sticky;top:0;z-index:30;transition:box-shadow .3s,background .3s}
header.scrolled{box-shadow:0 8px 24px rgba(20,19,10,.35);background:rgba(47,61,32,.96);backdrop-filter:blur(10px)}
.header-top{display:flex;justify-content:space-between;align-items:center;padding:18px 0 14px;gap:28px;transition:padding .3s}
header.scrolled .header-top{padding:8px 0 6px}
.wordmark{font-family:var(--font-brand);font-weight:400;font-size:38px;line-height:1;text-decoration:none;display:flex;align-items:center;gap:10px;white-space:nowrap;color:var(--candle)}
.search-pill{flex:1;max-width:480px;display:flex;align-items:center;gap:8px;background:rgba(241,236,219,.12);border:1.5px solid rgba(241,236,219,.22);border-radius:var(--radius-pill);padding:0 6px 0 16px;transition:background .25s,border-color .25s,box-shadow .25s}
.search-pill:hover{background:rgba(241,236,219,.17)}
.search-pill:focus-within{background:var(--candle);color:var(--black-raspberry);border-color:var(--moss-gardens);box-shadow:0 0 0 4px rgba(117,137,86,.35)}
.search-pill input{border:0;background:transparent;color:inherit;min-height:42px;padding:6px 4px;box-shadow:none!important}
.search-pill input::placeholder{color:rgba(241,236,219,.7)}.search-pill:focus-within input::placeholder{color:var(--baby-bear)}
.hint{flex:none;min-width:22px;height:22px;display:grid;place-items:center;border:1px solid rgba(241,236,219,.35);border-radius:6px;font:700 12px var(--font-body);color:rgba(241,236,219,.75)}
.search-pill:focus-within .hint{display:none}
.go{background:var(--bow);padding:6px 16px;min-height:34px;font-size:13px;border-radius:var(--radius-pill)}
.header-actions{display:flex;align-items:center;gap:8px}
.icon-link{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:6px;color:var(--candle);text-decoration:none;border-radius:var(--radius-pill);background:transparent;border:0;min-width:44px;min-height:44px;padding:0 10px;font-size:14px;font-weight:700;box-shadow:none}
.icon-link:hover{background:rgba(241,236,219,.14);transform:none;box-shadow:none}
.count{position:absolute;top:4px;right:2px;min-width:18px;height:18px;border-radius:9px;background:var(--bow);color:var(--candle);font-size:11px;display:grid;place-items:center;padding:0 5px;animation:pop .45s var(--ease-spring)}
.login-btn{display:inline-flex;align-items:center;min-height:42px;padding:0 18px;border:1.5px solid rgba(241,236,219,.45);border-radius:var(--radius-pill);color:var(--candle);text-decoration:none;font-size:14px;font-weight:700;transition:background .2s,color .2s}
.login-btn:hover{background:var(--candle);color:var(--forestry)}
.add-link{white-space:nowrap}
/* user menu */
.user-menu{position:relative}
.avatar-btn{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:4px 10px 4px 5px;border:1.5px solid rgba(241,236,219,.3);border-radius:var(--radius-pill);background:rgba(241,236,219,.08);color:var(--candle);font-size:14px;font-weight:700;box-shadow:none}
.avatar-btn:hover{background:rgba(241,236,219,.16);transform:none;box-shadow:none}
.avatar{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:var(--candle);color:var(--forestry);font:700 13px var(--font-body);flex:none}
.avatar.big{width:42px;height:42px;font-size:15px}
.who{max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.chev{transition:transform .2s var(--ease)}.chev.open{transform:rotate(180deg)}
.user-panel{position:absolute;right:0;top:calc(100% + 10px);min-width:250px;display:grid;gap:2px;padding:10px;background:var(--forestry);border:1px solid rgba(241,236,219,.2);border-radius:16px;box-shadow:var(--shadow-lg);z-index:45}
.up-head{display:flex;align-items:center;gap:12px;padding:6px 8px 12px;margin-bottom:6px;border-bottom:1px solid rgba(241,236,219,.15)}
.up-head b{display:block;font-size:15px;overflow-wrap:anywhere}.up-head span:not(.avatar){font-size:12px;opacity:.75;text-transform:capitalize}
.user-panel a,.user-panel .up-logout{display:flex;align-items:center;justify-content:flex-start;gap:10px;width:100%;min-height:42px;padding:9px 12px;border:0;border-radius:10px;background:transparent;color:var(--candle);text-decoration:none;font-size:14px;font-weight:600;text-align:left;box-shadow:none}
.user-panel a:hover,.user-panel .up-logout:hover{background:rgba(241,236,219,.14);transform:none;box-shadow:none}
.up-logout{margin-top:4px;border-top:1px solid rgba(241,236,219,.15)!important;border-radius:0 0 10px 10px!important;color:#f3c6c2!important}
.menu-toggle{display:none}
/* nav row */
.navigation{display:flex;align-items:center;gap:10px;padding:6px 0 10px;border-top:1px solid rgba(241,236,219,.14);font-size:14px}
.nav-links{display:flex;flex:1;align-items:center;justify-content:space-between;gap:4px}
.nav-links>a,.more-btn{position:relative;display:inline-flex;align-items:center;gap:6px;min-height:38px;padding:8px 14px;border:0;border-radius:var(--radius-pill);background:transparent;color:var(--candle);text-decoration:none;font-size:14px;font-weight:600;box-shadow:none;transition:background .2s,color .2s}
.nav-links>a:hover,.more-btn:hover{background:rgba(241,236,219,.13);transform:none;box-shadow:none}
.nav-links>a.active,.more-btn.active{background:var(--candle);color:var(--forestry);font-weight:800}
.more{position:relative}
.more-menu{position:absolute;top:calc(100% + 8px);right:0;left:auto;background:var(--forestry);min-width:260px;display:grid;grid-template-columns:1fr 1fr;gap:2px;padding:10px;border-radius:16px;box-shadow:var(--shadow-lg);border:1px solid rgba(241,236,219,.2);z-index:40;width:max-content;max-width:90vw}
.more-menu::before{content:"";position:absolute;left:0;right:0;top:-10px;height:10px}
.more-menu a{display:flex;align-items:center;gap:8px;text-decoration:none;padding:10px 12px;border-radius:10px;font-size:14px;color:var(--candle)}
.more-menu a:hover{background:rgba(241,236,219,.14)}
.more-menu a.router-link-exact-active{background:rgba(241,236,219,.2);font-weight:700}
.drop-enter-active,.drop-leave-active{transition:opacity .2s,transform .25s var(--ease)}.drop-enter-from,.drop-leave-to{opacity:0;transform:translateY(-8px)}
.mobile-search,.mobile-actions{display:none}
@keyframes pop{0%{transform:scale(.4)}60%{transform:scale(1.35)}100%{transform:scale(1)}}
@media(max-width:1200px){.search-pill{max-width:300px}.who{display:none}.avatar-btn{padding-right:8px}}
@media(max-width:1060px){
  .menu-toggle{display:inline-flex}.search-pill{display:none}.add-link{display:none}.header-top{padding:12px 0}
  .navigation{display:none;flex-direction:column;align-items:stretch;gap:18px;max-height:calc(100vh - 76px);max-height:calc(100dvh - 76px);overflow:auto;padding:20px 0 32px;gap:18px;overscroll-behavior:contain}
  .navigation.expanded{display:flex;animation:fade-up .3s var(--ease)}
  .mobile-search{display:flex;align-items:center;gap:8px;padding:0 6px 0 16px;border:1.5px solid rgba(241,236,219,.28);border-radius:var(--radius-pill);background:rgba(241,236,219,.1)}
  .mobile-search input{flex:1;min-width:0;border:0;background:transparent;color:var(--candle);min-height:52px;box-shadow:none!important;padding:0 4px}
  .mobile-search input::placeholder{color:rgba(241,236,219,.7)}
  .nav-links{flex-direction:column;align-items:stretch;justify-content:flex-start;gap:6px}
  .nav-links>a{min-height:54px;padding:14px 20px;border-radius:14px;font-size:16px;letter-spacing:.01em}
  .more{width:100%}.more-btn{display:none}
  .more-menu{position:static;display:grid;box-shadow:none;border:0;padding:6px 0 0;width:auto;max-width:none;background:transparent;border-top:1px solid rgba(241,236,219,.14);margin-top:14px;padding-top:20px;gap:6px;position:relative}
  .more-menu::before{display:block;content:'Explore more';position:static;height:auto;left:auto;right:auto;top:auto;grid-column:1/-1;padding:0 20px 8px;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;opacity:.65}
  .more-menu a{min-height:54px;padding:14px 20px;gap:12px;font-size:15px;border-radius:14px}
  .mobile-actions{display:flex;flex-wrap:wrap;gap:12px;padding-top:20px;margin-top:6px;border-top:1px solid rgba(241,236,219,.14)}
  .mobile-actions>*{flex:1 1 150px;min-height:50px;justify-content:center}
  .mobile-actions .btn.secondary{border-color:rgba(241,236,219,.5);color:var(--candle)}
  .mobile-actions .btn.secondary:hover{background:var(--candle);color:var(--forestry)}
  .wordmark{font-size:32px}
}
@media(max-width:760px){.saved-link{display:none}}
@media(max-width:480px){.more-menu{grid-template-columns:1fr}}
@media(max-width:600px){.login-btn{display:none}.wordmark{font-size:29px}.header-actions{gap:6px}.header-top{padding:14px 0}.icon-link{min-width:46px;min-height:46px}.user-panel{position:fixed;left:12px;right:12px;top:68px;min-width:0}}
@media(prefers-reduced-motion:reduce){.chev,.drop-enter-active,.drop-leave-active{transition:none}}
</style>
