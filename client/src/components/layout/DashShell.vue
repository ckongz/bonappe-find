<script setup>
import {computed,ref,watch,nextTick,onMounted,onUnmounted} from 'vue';
import {useRouter} from 'vue-router';
import Icon from '../common/Icon.vue';
import {useAuth} from '../../stores/index.js';
const props=defineProps({
  title:String,subtitle:String,
  nav:{type:Array,default:()=>[]},      // [{label,icon,badge}]
  active:String,
  stats:{type:Array,default:()=>[]},    // [{label,value}]
  profileStats:{type:Array,default:()=>[]}, // [{label,value}]
  roleLabel:String,
  addLink:Boolean,
  breakdown:{type:Array,default:()=>[]},  // [{label,value}] for donut
  breakdownTitle:{type:String,default:''}
});
const emit=defineEmits(['select','logout']);
const auth=useAuth(),router=useRouter();
const initials=computed(()=>(auth.user?.name||'?').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase());
const total=computed(()=>props.breakdown.reduce((s,b)=>s+(Number(b.value)||0),0));
const R=44,C=2*Math.PI*R;
const arcs=computed(()=>{let off=0;const cols=['#8bc34a','#2f3d20','#f0b429','#7e2625'];return props.breakdown.map((b,i)=>{const frac=total.value?(Number(b.value)||0)/total.value:0;const a={...b,color:cols[i%cols.length],dash:`${Math.max(0,frac*C-3)} ${C}`,offset:-off*C};off+=frac;return a;});});
function logout(){emit('logout');}
const navEl=ref(null);
function reveal(){nextTick(()=>{const n=navEl.value,b=n?.querySelector('.on');if(n&&b&&n.scrollWidth>n.clientWidth+4)n.scrollTo({left:b.offsetLeft-(n.clientWidth-b.clientWidth)/2,behavior:'smooth'});});}
const canLeft=ref(false),canRight=ref(false);
function measure(){const n=navEl.value;if(!n)return;const max=n.scrollWidth-n.clientWidth;canLeft.value=max>4&&n.scrollLeft>4;canRight.value=max>4&&n.scrollLeft<max-4;}
function nudge(dir){navEl.value?.scrollBy({left:dir*Math.max(160,navEl.value.clientWidth*.7),behavior:'smooth'});}
let drag=null;
function dragStart(e){if(e.pointerType!=='mouse'||e.button!==0)return;const n=navEl.value;if(!n||n.scrollWidth<=n.clientWidth+4)return;drag={x:e.clientX,left:n.scrollLeft,moved:false};}
function dragMove(e){if(!drag)return;const dx=e.clientX-drag.x;if(!drag.moved&&Math.abs(dx)>5){drag.moved=true;navEl.value.setPointerCapture?.(e.pointerId);navEl.value.classList.add('dragging');}if(drag.moved)navEl.value.scrollLeft=drag.left-dx;}
function dragEnd(e){if(!drag)return;if(drag.moved){navEl.value.releasePointerCapture?.(e.pointerId);navEl.value.classList.remove('dragging');}drag=null;}
watch(()=>props.nav,()=>nextTick(measure),{deep:true});
watch(()=>props.active,()=>{reveal();setTimeout(measure,350);});
onMounted(()=>{reveal();measure();window.addEventListener('resize',measure);});
onUnmounted(()=>window.removeEventListener('resize',measure));
</script>
<template>
<div class="dash-wrap"><div class="dash-shell">
  <aside class="dash-side" aria-label="Dashboard navigation">
    <RouterLink to="/" class="dash-brand" aria-label="BonAppé Find home"><span class="brand-box" aria-hidden="true"></span><span>BonAppé Find</span></RouterLink>
    <p class="side-label">{{roleLabel}}</p>
    <div class="nav-scroller" :class="{'fade-l':canLeft,'fade-r':canRight}">
      <button type="button" class="nav-arrow left" v-show="canLeft" tabindex="-1" aria-label="Scroll sections left" @click="nudge(-1)"><Icon name="chevron-left" :size="18"/></button>
      <nav ref="navEl" class="side-nav" role="tablist" aria-label="Dashboard sections" @scroll.passive="measure" @pointerdown="dragStart" @pointermove="dragMove" @pointerup="dragEnd" @pointercancel="dragEnd"><button v-for="n in nav" :key="n.label" role="tab" type="button" :class="{on:active===n.label}" :aria-selected="active===n.label" :tabindex="active===n.label?0:-1" @click="emit('select',n.label)"><Icon :name="n.icon||'grid'" :size="18"/><span>{{n.label}}</span><i v-if="n.badge" class="side-badge">{{n.badge}}</i></button></nav>
      <button type="button" class="nav-arrow right" v-show="canRight" tabindex="-1" aria-label="Scroll sections right" @click="nudge(1)"><Icon name="chevron-right" :size="18"/></button>
    </div>
    <button type="button" class="side-logout" @click="logout"><Icon name="logout" :size="18"/><span>Log out</span></button>
  </aside>

  <main class="dash-main">
    <header class="dash-head"><div><h1>{{title}}</h1><p>{{subtitle}}</p></div><div class="dash-actions"><RouterLink v-if="addLink&&auth.canManage" to="/restaurants/new" class="btn d-primary"><Icon name="plus" :size="16"/>Add a Restaurant</RouterLink><slot name="actions"/></div></header>
    <section v-if="stats.length" class="stat-strip" aria-label="Summary"><article v-for="s in stats" :key="s.label" class="strip-tile"><p>{{s.label}}</p><b>{{s.value}}</b></article></section>
    <div class="dash-body"><slot/></div>
  </main>

  <aside class="dash-profile" aria-label="Your profile">
    <div class="pf-top"><div class="pf-cover" aria-hidden="true"></div>
    <div class="pf-avatar" aria-hidden="true">{{initials}}</div>
    <h2>{{auth.user?.name}}</h2>
    <p class="pf-role">{{auth.user?.role}}<template v-if="auth.user?.account_id"> · {{auth.user.account_id}}</template></p>
    <p class="pf-mail">{{auth.user?.email}}</p>
    <dl v-if="profileStats.length" class="pf-stats"><div v-for="p in profileStats" :key="p.label"><dd>{{p.value}}</dd><dt>{{p.label}}</dt></div></dl></div>
    <div class="pf-bottom">
    <div v-if="breakdown.length&&total" class="pf-donut"><h3>{{breakdownTitle}}</h3>
      <div class="donut" role="img" :aria-label="breakdownTitle+': '+breakdown.map(b=>b.label+' '+b.value).join(', ')"><svg viewBox="0 0 120 120" width="132" height="132"><circle cx="60" cy="60" :r="R" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="14"/><circle v-for="a in arcs" :key="a.label" cx="60" cy="60" :r="R" fill="none" :stroke="a.color" stroke-width="14" stroke-linecap="round" :stroke-dasharray="a.dash" :stroke-dashoffset="a.offset" transform="rotate(-90 60 60)"/></svg><div><b>{{total}}</b><span>Total</span></div></div>
      <ul><li v-for="a in arcs" :key="a.label"><i :style="{background:a.color}"></i>{{a.label}} <b>{{a.value}}</b></li></ul></div>
    <div class="pf-links"><slot name="profile-links"><RouterLink to="/account" class="btn d-primary">Your account</RouterLink></slot></div></div>
  </aside>
</div></div>
</template>
<style scoped>
.dash-wrap{--lime:#8bc34a;--lime-d:#6fa82f;--deep:#2f3d20;--panel:#3a4a2c;max-width:1600px;margin:0 auto;padding:36px 20px 80px}
.dash-shell{display:grid;grid-template-columns:220px minmax(0,1fr) 250px;gap:0;padding:12px;background:var(--color-chip);border:1px solid var(--color-border);border-radius:32px;box-shadow:0 24px 60px rgba(20,19,10,.14)}
/* sidebar */
.dash-side{display:flex;flex-direction:column;padding:22px 14px;background:var(--color-surface);border-radius:24px}
.brand-box{flex:none;width:30px;height:30px;border-radius:9px;background:var(--forestry)}
.dash-brand{display:flex;align-items:center;gap:10px;padding:0 8px 18px;margin-bottom:12px;border-bottom:1px solid var(--color-border);text-decoration:none;color:var(--color-heading);font:700 18px var(--font-heading)}
.side-label{margin:6px 10px 8px;font-size:13px;font-weight:700;color:var(--color-heading);text-transform:capitalize}
.nav-scroller{flex:1;display:flex;flex-direction:column;min-height:0;min-width:0}
.nav-arrow{display:none}
.side-nav{display:flex;flex-direction:column;gap:2px;flex:1}
.dash-side button{justify-content:flex-start;gap:12px;width:100%;min-height:42px;padding:9px 12px;border:0;border-radius:10px;background:transparent;color:var(--color-muted);font-size:14px;font-weight:700;text-align:left;box-shadow:none;transform:none;position:relative}
.dash-side button:hover{background:var(--moss-soft);color:var(--color-text);transform:none;box-shadow:none}
.dash-side .side-nav button.on{background:var(--moss-soft);color:var(--deep)}
.dash-side .side-nav button.on::after{content:"";position:absolute;right:-14px;top:0;bottom:0;width:5px;border-radius:4px 0 0 4px;background:var(--lime)}
.dash-side .side-nav button.on svg{color:var(--lime-d)}
.side-badge{margin-left:auto;font-style:normal;min-width:22px;height:22px;padding:0 6px;border-radius:11px;display:grid;place-items:center;background:var(--bow);color:#fff;font-size:12px}
.side-logout{margin-top:14px}
/* main */
.dash-main{min-width:0;padding:26px 26px 20px}
.dash-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:20px;flex-wrap:wrap}
.dash-head h1{margin:0 0 4px;font-size:clamp(26px,3vw,34px)}
.dash-head p{margin:0;color:var(--color-muted);font-size:14px}
.dash-actions{display:flex;gap:10px;flex-wrap:wrap}
.dash-wrap :deep(.d-primary){background:var(--lime);color:#17210b;border:0;border-radius:12px;font-weight:800;box-shadow:0 8px 18px rgba(139,195,74,.35)}
.dash-wrap :deep(.d-primary:hover){background:var(--lime-d);color:#fff}
.stat-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;padding:16px;margin-bottom:22px;border-radius:24px;background:linear-gradient(135deg,#9bd24f,#6fa82f);box-shadow:0 14px 30px rgba(111,168,47,.32)}
.strip-tile{padding:14px 16px;border-radius:16px;background:rgba(40,70,10,.45);color:#f4ffe0}
.strip-tile p{margin:0 0 6px;font-size:12px;opacity:.9}
.strip-tile b{font:700 28px/1 var(--font-body);color:#fff}
.dash-body{min-width:0;container-type:inline-size;container-name:dashboard-content}
/* profile */
.dash-profile{display:flex;flex-direction:column;align-items:center;text-align:center;padding:14px 16px 20px;background:var(--panel);color:#e8f2d6;border-radius:24px}
.pf-cover{position:relative;overflow:hidden;width:100%;height:96px;border-radius:16px;background:linear-gradient(135deg,#9bd24f,#6fa82f)}
.pf-avatar{width:68px;height:68px;margin-top:-34px;border-radius:50%;display:grid;place-items:center;background:var(--candle);color:var(--deep);border:4px solid var(--panel);font:700 24px var(--font-heading);position:relative}
.dash-profile h2{margin:10px 0 2px;color:#fff;font-size:22px}
.pf-role{margin:0;font-size:13px;color:var(--lime);font-weight:700;text-transform:capitalize;overflow-wrap:anywhere}
.pf-mail{margin:2px 0 14px;font-size:12px;opacity:.8;overflow-wrap:anywhere}
.pf-stats{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;width:100%;margin:0 0 16px;padding:12px 0;border-block:1px solid rgba(255,255,255,.12)}
.pf-stats>div+div{border-left:1px solid rgba(255,255,255,.12)}
.pf-stats dd{margin:0;font:700 20px var(--font-body);color:#fff}.pf-stats dt{font-size:12px;opacity:.75}
.pf-donut{width:100%;padding:14px;margin-bottom:16px;border-radius:18px;background:rgba(0,0,0,.2)}
.pf-donut h3{margin:0 0 10px;font-size:14px;color:#fff;font-family:var(--font-body)}
.donut{position:relative;display:grid;place-items:center}
.donut>div{position:absolute;display:flex;flex-direction:column}.donut b{font-size:22px;color:#fff}.donut span{font-size:11px;opacity:.75}
.pf-donut ul{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:4px;font-size:12px;text-align:left}
.pf-donut li{display:flex;align-items:center;gap:8px}.pf-donut li b{margin-left:auto;color:#fff}.pf-donut li i{width:9px;height:9px;border-radius:50%}
.pf-links{margin-top:auto;display:grid;gap:10px;width:100%}
.pf-links :deep(.btn),.pf-links :deep(button){width:100%;border-radius:12px}
.pf-links :deep(.btn:not(.d-primary)){background:transparent;border:1.5px solid rgba(255,255,255,.3);color:#fff}
/* content restyle (works for every tab) */
.dash-body :deep(.tabs){display:none}
.dash-body :deep(.card){border-radius:20px;border:1px solid var(--color-border);background:var(--color-surface);box-shadow:0 6px 18px rgba(20,19,10,.05)}
.dash-body :deep(.card.pad){padding:22px}
.dash-body :deep(h2){font-size:22px}
.dash-body :deep(table){border-collapse:separate;border-spacing:0}
.dash-body :deep(th){font-size:12px;font-weight:700;color:var(--color-muted);text-align:left;padding:14px 16px;border-bottom:1px solid var(--color-border);background:transparent}
.dash-body :deep(td){padding:14px 16px;border-bottom:1px solid var(--color-border);font-size:14px}
.dash-body :deep(tr:last-child td){border-bottom:0}
.dash-body :deep(.badge){background:var(--moss-soft);color:var(--deep);font-size:12px}
.dash-body :deep(.bar){background:linear-gradient(90deg,var(--lime-d),var(--lime))}
.dash-body :deep(button:not(.secondary):not(.cta):not(.clear-x)){background:var(--lime);color:#17210b;border-radius:10px;font-weight:700}
.dash-body :deep(button:not(.secondary):not(.cta):not(.clear-x):hover){background:var(--lime-d);color:#fff}
.dash-body :deep(button.secondary){border-radius:10px;border-color:var(--color-border);color:var(--color-text)}
.dash-body :deep(button.secondary:hover){background:var(--moss-soft);color:var(--color-text)}
.dash-body :deep(button.cta),.dash-body :deep(.btn.cta){border-radius:10px}
.dash-body :deep(.btn:not(.secondary):not(.cta)){background:var(--lime);color:#17210b;border-radius:10px}
.dash-body :deep(.btn.secondary){border-radius:10px;border-color:var(--color-border);color:var(--color-text)}
.dash-body :deep(input),.dash-body :deep(select),.dash-body :deep(textarea){border-radius:10px;background:var(--color-bg)}
:root[data-theme=dark] .dash-wrap{--deep:#e8f2d6}
:root[data-theme=dark] .dash-side .side-nav button.on{color:#e8f2d6}
/* wrappers are transparent on desktop */
.pf-top,.pf-bottom{display:contents}
.dash-body :deep(img){max-width:100%;height:auto}
.dash-body :deep(pre){max-width:100%;overflow:auto}
.dash-body :deep(.row){flex-wrap:wrap}
/* ---------- tablet: top nav bar, profile becomes a two-column card ---------- */
@media(max-width:1100px){

 .nav-scroller{position:relative;flex-direction:row;align-items:center}
 .side-nav{flex:1;min-width:0;cursor:grab}
 .side-nav.dragging{cursor:grabbing;user-select:none}
 .nav-scroller.fade-r .side-nav{-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 40px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 40px),transparent)}
 .nav-scroller.fade-l .side-nav{-webkit-mask-image:linear-gradient(270deg,#000 calc(100% - 40px),transparent);mask-image:linear-gradient(270deg,#000 calc(100% - 40px),transparent)}
 .nav-scroller.fade-l.fade-r .side-nav{-webkit-mask-image:linear-gradient(90deg,transparent,#000 40px,#000 calc(100% - 40px),transparent);mask-image:linear-gradient(90deg,transparent,#000 40px,#000 calc(100% - 40px),transparent)}
 .dash-side .nav-arrow{position:absolute;top:50%;z-index:2;display:grid;place-items:center;width:32px;min-height:32px;height:32px;padding:0;border-radius:50%;background:var(--color-surface);border:1.5px solid var(--color-border);color:var(--deep);box-shadow:0 4px 12px rgba(20,19,10,.18);transform:translateY(-50%)}
 .dash-side .nav-arrow:hover{background:var(--lime);color:#17210b;transform:translateY(-50%)}
 .nav-arrow.left{left:2px}.nav-arrow.right{right:2px}
 .dash-wrap{padding:24px 16px 64px}
 .dash-shell{grid-template-columns:minmax(0,1fr);border-radius:26px}
 .dash-side{flex-direction:row;align-items:center;gap:8px;padding:10px;border-radius:20px;margin-bottom:12px}
 .dash-brand,.side-label{display:none}
 .side-nav{flex-direction:row;gap:6px;overflow-x:auto;padding:2px 14px 2px 2px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
 .side-nav::-webkit-scrollbar{display:none}
 .dash-side button{flex:none;width:auto;min-height:44px;padding:9px 14px;border-radius:999px}
 .dash-side .side-nav button.on{background:var(--lime);color:#17210b}
 .dash-side .side-nav button.on svg{color:#17210b}
 .dash-side .side-nav button.on::after{display:none}
 .side-logout{margin:0;border:1.5px solid var(--color-border)!important}
 .dash-main{padding:18px 10px 14px}
 .dash-profile{margin-top:12px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px 20px;align-items:start;text-align:left;padding:16px}
 .pf-top{display:flex;flex-direction:column;align-items:center;text-align:center}
 .pf-bottom{display:flex;flex-direction:column;gap:14px}
 .pf-donut{margin-bottom:0}
 .pf-links{margin-top:0}
}
/* ---------- phone ---------- */
@media(max-width:760px){
 .dash-wrap{padding:14px 10px 56px}
 .dash-shell{padding:6px;border-radius:22px}
 .dash-side{padding:8px;border-radius:16px;position:sticky;top:6px;z-index:5;box-shadow:0 6px 16px rgba(20,19,10,.12)}
 .side-logout span{display:none}
 .side-logout{padding:9px 12px}
 .dash-main{padding:16px 6px 10px}
 .dash-head{margin-bottom:14px}
 .dash-head h1{font-size:24px}
 .dash-actions{width:100%}
 .dash-actions>*{flex:1}
 .stat-strip{grid-template-columns:1fr 1fr;gap:8px;padding:10px;border-radius:18px}
 .strip-tile{padding:12px;border-radius:14px}
 .strip-tile b{font-size:24px}
 .strip-tile:last-child:nth-child(odd){grid-column:1/-1}
 .dash-body :deep(.card.pad){padding:16px}
 .dash-body :deep(h2){font-size:20px}
 .dash-body :deep(.toolbar){margin-bottom:16px}
 .dash-body :deep(.row>button),.dash-body :deep(.row>.btn){flex:1 1 auto}
 .dash-body :deep(select){width:100%!important}
 .dash-profile{grid-template-columns:1fr;padding:12px}
 .pf-cover{height:70px}
 .pf-donut{padding:12px}
 /* tables become stacked cards */
 .dash-body :deep(.card.table-wrap){background:transparent;border:0;box-shadow:none;overflow:visible}
 .dash-body :deep(table.dash-table){display:block;min-width:0!important}
 .dash-body :deep(table.dash-table thead){display:none}
 .dash-body :deep(table.dash-table tbody){display:grid;gap:12px}
 .dash-body :deep(table.dash-table tr){display:block;padding:14px 16px;border:1px solid var(--color-border);border-radius:18px;background:var(--color-surface)}
 .dash-body :deep(table.dash-table td){display:flex;justify-content:space-between;align-items:center;gap:14px;min-width:0!important;padding:7px 0;border:0;text-align:right;overflow-wrap:anywhere}
 .dash-body :deep(table.dash-table td::before){content:attr(data-label);flex:none;font-size:12px;font-weight:700;color:var(--color-muted);text-align:left}
 .dash-body :deep(table.dash-table td:first-child){font-size:16px;font-weight:700;padding-bottom:10px;margin-bottom:4px;border-bottom:1px solid var(--color-border)}
 .dash-body :deep(table.dash-table td[data-label=Actions]){display:block;text-align:left;padding-top:12px}
 .dash-body :deep(table.dash-table td[data-label=Actions])::before{display:block;margin-bottom:8px}
}
@media(max-width:380px){.dash-side button{padding:9px 11px;font-size:13px}.strip-tile b{font-size:21px}}
@media(pointer:coarse){.dash-body :deep(button),.dash-body :deep(.btn){min-height:44px}.dash-body :deep(input),.dash-body :deep(select){min-height:46px}}
@media(prefers-reduced-motion:reduce){.side-nav{scroll-behavior:auto}}
</style>
