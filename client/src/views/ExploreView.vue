<script setup>
import {ref,computed,onMounted,watch} from 'vue';
import {useRoute} from 'vue-router';
import {get,message} from '../services/api.js';
import {dishImage} from '../utils/formatters.js';
import Icon from '../components/common/Icon.vue';
const route=useRoute(),data=ref([]),error=ref(''),loading=ref(true),search=ref('');
async function load(){loading.value=true;try{data.value=(await get(route.meta.kind==='cuisines'?'/restaurants/stats/by-cuisine':'/countries')).data;}catch(e){error.value=message(e);}finally{loading.value=false;}}
const items=computed(()=>{const t=search.value.trim().toLowerCase();const k=route.meta.kind;if(k==='cuisines')return data.value.filter(c=>!t||String(c._id).toLowerCase().includes(t));return data.value.flatMap(c=>(k==='dishes'?c.signatureDishes:c.festivals).map(item=>({c,item}))).filter(({c,item})=>!t||[c.name,item.name,item.description].join(' ').toLowerCase().includes(t));});
onMounted(load);watch(()=>route.path,()=>{search.value='';load();});
</script>
<template>
  <div class="container section">
    <div class="page-head"><p class="eyebrow">Taste the world</p><h1>{{route.meta.kind==='cuisines'?'Find a cuisine you love':route.meta.kind==='dishes'?'Dish glossary':'Food festival calendar'}}</h1><p>Explore the food culture behind every plate.</p></div>
    <div class="toolbar"><div class="search-wrap"><label class="sr-only" for="explore-search">Filter this page</label><input id="explore-search" v-model="search" type="search" :placeholder="route.meta.kind==='cuisines'?'Search cuisines':route.meta.kind==='dishes'?'Search dishes or countries':'Search festivals or countries'" autocomplete="off"><button v-if="search" type="button" class="clear-x" aria-label="Clear search" @click="search=''"><Icon name="x" :size="16"/></button></div><span class="meta-count" role="status" aria-live="polite">{{items.length}} shown</span></div>
    <p v-if="error" class="error-box" role="alert">{{error}}</p>
    <div v-else-if="loading" class="grid"><div v-for="n in 6" :key="n" class="skeleton"></div></div>
    <div v-else-if="!items.length" class="card empty-results"><span class="empty-icon"><Icon name="search" :size="28"/></span><h2>Nothing matches “{{search}}”</h2><p class="muted">Check the spelling or clear the search.</p><div class="row"><button class="cta" @click="search=''">Clear search</button></div></div>
    <div v-else-if="route.meta.kind==='cuisines'" class="cuisine-grid">
      <RouterLink v-for="(c,i) in items" :key="c._id" :to="{path:'/restaurants',query:{cuisine:c._id}}" class="cuisine-card" v-reveal="i%4">
        <img :src="dishImage(c._id)" :alt="c._id+' food inspiration'" loading="lazy"><div class="cc-text"><h2>{{c._id}}</h2><p><Icon name="utensils" :size="14"/> {{c.count}} {{c.count===1?'restaurant':'restaurants'}}</p><span>Browse <Icon name="arrow-right" :size="16"/></span></div>
      </RouterLink>
    </div>
    <div v-else class="grid stagger"><article v-for="({c,item},i) in items" :key="c.slug+item.name" class="card pad info-card" :style="{'--i':i%9}">
      <span class="info-icon"><Icon :name="route.meta.kind==='dishes'?'bowl':'calendar'" :size="22"/></span>
      <p class="eyebrow muted">{{c.name}}</p><h2>{{item.name}}</h2><p v-if="item.when" class="muted"><Icon name="clock" :size="14"/> {{item.when}}</p><p>{{item.description}}</p>
      <RouterLink v-if="route.meta.kind==='dishes'" class="link-arrow" :to="{path:'/restaurants',query:{search:item.name,field:'dish'}}">Find restaurants serving this dish <Icon name="arrow-right" :size="16"/></RouterLink>
      <RouterLink v-else class="link-arrow" :to="'/countries/'+c.slug">Read the country guide <Icon name="arrow-right" :size="16"/></RouterLink>
    </article></div>
  </div>
</template>
<style scoped>
.cuisine-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px}
.cuisine-card{position:relative;display:block;aspect-ratio:1/1;border-radius:var(--radius-lg);overflow:hidden;text-decoration:none;color:var(--candle);box-shadow:var(--shadow);isolation:isolate;transition:transform .4s var(--ease),box-shadow .4s}
.cuisine-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg)}
.cuisine-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;transition:transform .8s var(--ease)}.cuisine-card:hover img{transform:scale(1.12)}
.cuisine-card:before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(transparent 35%,rgba(20,19,10,.88))}
.cc-text{position:absolute;inset:auto 0 0 0;padding:18px}.cc-text h2{color:var(--candle);font-size:26px;margin:0 0 4px}.cc-text p{margin:0 0 8px;font-size:13px;display:flex;align-items:center;gap:6px;color:#e4dfcc}
.cc-text span{display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:14px;transition:gap .3s}.cuisine-card:hover .cc-text span{gap:12px}
.info-icon{display:grid;place-items:center;width:46px;height:46px;border-radius:14px;background:var(--moss-soft);margin-bottom:14px;color:var(--forestry)}
:root[data-theme=dark] .info-icon{color:var(--candle)}
.info-card h2{font-size:26px}
@media(max-width:1000px){.cuisine-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:480px){.cuisine-grid{grid-template-columns:1fr 1fr;gap:12px}}
</style>
