<script setup>
import {ref,computed,onMounted} from 'vue';import {get,message} from '../services/api.js';import Icon from '../components/common/Icon.vue';
const data=ref([]),search=ref(''),category=ref(''),error=ref(''),loading=ref(true),open=ref(new Set());
const categories=computed(()=>['',...new Set(data.value.map(f=>f.category))]);
const term=computed(()=>search.value.trim().toLowerCase());
const filtered=computed(()=>data.value.filter(x=>(!category.value||x.category===category.value)&&(!term.value||(x.question+' '+x.answer).toLowerCase().includes(term.value))));
function parts(text){const t=term.value;if(!t)return [{t:text}];const out=[];let rest=text,low=text.toLowerCase(),i;while((i=low.indexOf(t))>=0){if(i)out.push({t:rest.slice(0,i)});out.push({t:rest.slice(i,i+t.length),hit:true});rest=rest.slice(i+t.length);low=low.slice(i+t.length);}if(rest)out.push({t:rest});return out;}
function toggle(id){const s=new Set(open.value);s.has(id)?s.delete(id):s.add(id);open.value=s;}
function reset(){search.value='';category.value='';}
onMounted(async()=>{try{data.value=(await get('/faqs')).data;}catch(e){error.value=message(e);}finally{loading.value=false;}});
</script>
<template>
<div class="container section reading">
  <div class="page-head"><h1>Frequently asked questions</h1><p>Quick answers to the things people ask us most.</p></div>
  <img class="faq-photo" src="/images/photos/coffee.jpg" alt="A cozy café dining area" loading="lazy">
  <div class="toolbar"><div class="field" style="flex:1;margin:0"><label for="faq-search">Search the FAQs</label><div class="search-wrap"><input id="faq-search" v-model="search" type="search" placeholder="Try “review” or “owner”" autocomplete="off"><button v-if="search" type="button" class="clear-x" aria-label="Clear search" @click="search=''"><Icon name="x" :size="16"/></button></div></div></div>
  <div class="row cat-row" role="group" aria-label="Filter by category"><button v-for="x in categories" :key="x" class="secondary toggle pill small" :class="{active:category===x}" :aria-pressed="category===x" @click="category=x">{{x||'All'}}</button></div>
  <p class="small muted faq-count" role="status" aria-live="polite" v-if="!loading&&!error">{{filtered.length}} {{filtered.length===1?'answer':'answers'}}<template v-if="search||category"> · <button type="button" class="link-reset" @click="reset">Reset</button></template></p>
  <p v-if="error" class="error-box" role="alert">{{error}}</p>
  <div v-if="loading" class="skeleton" aria-label="Loading FAQs"></div>
  <TransitionGroup v-else name="acc-list" tag="div" class="acc-list">
    <div v-for="f in filtered" :key="f._id" class="acc" :class="{open:open.has(f._id)}">
      <h2 class="acc-h"><button type="button" class="acc-head" :id="'faq-h-'+f._id" :aria-expanded="open.has(f._id)" :aria-controls="'faq-p-'+f._id" @click="toggle(f._id)"><span><template v-for="(p,i) in parts(f.question)" :key="i"><mark v-if="p.hit">{{p.t}}</mark><template v-else>{{p.t}}</template></template></span><Icon name="chevron-down" :size="20"/></button></h2>
      <div class="acc-panel" :id="'faq-p-'+f._id" role="region" :aria-labelledby="'faq-h-'+f._id"><div><p><template v-for="(p,i) in parts(f.answer)" :key="i"><mark v-if="p.hit">{{p.t}}</mark><template v-else>{{p.t}}</template></template></p></div></div>
    </div>
  </TransitionGroup>
  <div v-if="!loading&&!error&&!filtered.length" class="card empty-results"><span class="empty-icon"><Icon name="search" :size="28"/></span><h2>No answers match</h2><p class="muted">Try another word, or send us a message and we will help.</p><div class="row"><button class="cta" @click="reset">Reset search</button><RouterLink to="/contact" class="btn secondary">Contact us</RouterLink></div></div>
  <RouterLink v-else to="/contact" class="btn secondary" style="margin-top:24px">Still stuck? Contact us</RouterLink>
</div>
</template>
<style scoped>.cat-row{margin:18px 0 12px}.faq-count{margin:0 0 18px}.acc-h{margin:0;font:inherit}.acc-list{position:relative}.acc-list-enter-active,.acc-list-leave-active{transition:opacity .25s var(--ease),transform .25s var(--ease)}.acc-list-enter-from,.acc-list-leave-to{opacity:0;transform:translateY(8px)}.acc-list-leave-active{position:absolute;width:100%}.acc-list-move{transition:transform .3s var(--ease)}</style>
