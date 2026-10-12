<script setup>
import {ref,computed,onMounted} from 'vue';
import {get,message} from '../services/api.js';
import CountryCard from '../components/countries/CountryCard.vue';
import Icon from '../components/common/Icon.vue';
const data=ref([]),continent=ref(''),search=ref(''),error=ref(''),loading=ref(true);
const continents=computed(()=>['',...new Set(data.value.map(c=>c.continent))]);
const filtered=computed(()=>{const t=search.value.trim().toLowerCase();return data.value.filter(c=>(!continent.value||c.continent===continent.value)&&(!t||[c.name,c.capital,c.tagline,c.continent].join(' ').toLowerCase().includes(t)));});
function reset(){search.value='';continent.value='';}
onMounted(async()=>{try{data.value=(await get('/countries')).data;}catch(e){error.value=message(e);}finally{loading.value=false;}});
</script>
<template>
  <div class="container section">
    <div class="page-head"><p class="eyebrow">A seat at every table</p><h1>Eat your way around the world</h1><p>Eight country guides with dishes, dining etiquette, tipping and food festivals.</p></div>
    <div class="toolbar"><div class="search-wrap"><label class="sr-only" for="country-search">Search countries</label><input id="country-search" v-model="search" type="search" placeholder="Search countries, capitals or dishes" autocomplete="off"><button v-if="search" type="button" class="clear-x" aria-label="Clear search" @click="search=''"><Icon name="x" :size="16"/></button></div><span class="meta-count" role="status" aria-live="polite">{{filtered.length}} of {{data.length}} countries</span></div>
    <div class="row cont-row" role="group" aria-label="Filter by continent"><Icon name="globe" :size="20"/><button v-for="c in continents" :key="c" class="ghost pill small toggle" :class="{active:continent===c}" :aria-pressed="continent===c" @click="continent=c">{{c||'All'}}</button><button v-if="search||continent" class="link-reset" @click="reset">Reset</button></div>
    <p v-if="error" class="error-box" role="alert">{{error}}</p>
    <div v-else-if="loading" class="countries-grid"><div v-for="n in 4" :key="n" class="skeleton" style="min-height:320px"></div></div>
    <TransitionGroup v-else name="list" tag="div" class="countries-grid">
      <CountryCard v-for="(c,i) in filtered" :key="c.slug" :country="c" :index="i%4" :style="{'--i':i}"/>
    </TransitionGroup>
    <div v-if="!filtered.length&&!error&&!loading" class="card empty-results"><span class="empty-icon"><Icon name="globe" :size="28"/></span><h2>No countries match</h2><p class="muted">Try a different word or choose another continent.</p><div class="row"><button class="cta" @click="reset">Reset filters</button></div></div>
  </div>
</template>
<style scoped>
.countries-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px}
.cont-row{margin-bottom:28px}.list-enter-active,.list-leave-active{transition:all .4s var(--ease)}.list-leave-active{position:absolute}.list-move{transition:transform .4s var(--ease)}.list-enter-from,.list-leave-to{opacity:0;transform:scale(.9)}
@media(max-width:1000px){.countries-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.countries-grid{grid-template-columns:1fr}}
</style>
