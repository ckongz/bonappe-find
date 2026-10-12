<script setup>
import {countryImage} from '../../utils/formatters.js';
import Icon from '../common/Icon.vue';
defineProps({country:Object,index:{type:Number,default:0}});
</script>
<template>
  <RouterLink :to="'/countries/'+country.slug" class="ccard" v-reveal="index">
    <div class="media"><img :src="countryImage(country.slug)" :alt="'Dining inspiration for '+country.name" loading="lazy"></div>
    <span class="iso">{{country.isoCode}}</span>
    <div class="ccard-text">
      <p class="eyebrow">{{country.continent}}</p>
      <h3>{{country.name}}</h3>
      <p class="tag">{{country.tagline}}</p>
      <span class="go">Read the guide <Icon name="arrow-right" :size="16"/></span>
    </div>
  </RouterLink>
</template>
<style scoped>
.ccard{position:relative;display:flex;flex-direction:column;border-radius:var(--radius-lg);overflow:hidden;text-decoration:none;color:var(--candle);background:var(--bistre);box-shadow:var(--shadow);transition:transform .4s var(--ease),box-shadow .4s var(--ease)}
.ccard:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg)}
.ccard img{width:100%;height:170px;object-fit:cover;transition:transform .9s var(--ease)}
.media{overflow:hidden}
.ccard:hover img{transform:scale(1.1)}
.iso{position:absolute;top:14px;left:14px;font-weight:800;font-size:12px;letter-spacing:.12em;background:rgba(241,236,219,.94);color:var(--black-raspberry);border-radius:var(--radius-pill);padding:5px 12px}
.ccard-text{padding:18px 20px 22px;flex:1;display:flex;flex-direction:column}
.eyebrow{margin:0 0 6px;color:#cfd4b0}.ccard h3{margin:0 0 6px;color:var(--candle);font:600 28px/1.1 var(--font-heading)}
.tag{margin:0 0 12px;font-size:14px;color:#e4dfcc;flex:1}
.go{display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:14px;transition:gap .3s var(--ease)}.ccard:hover .go{gap:12px}
</style>
