<script setup>
import {computed} from 'vue';
import {useSaved} from '../../stores/index.js';
import {imageUrl} from '../../services/api.js';
import {restaurantImage,dishImage} from '../../utils/formatters.js';
import Icon from '../common/Icon.vue';
import StarRating from '../common/StarRating.vue';
const props=defineProps({restaurant:Object,index:{type:Number,default:0}});
const s=useSaved();
const r=computed(()=>props.restaurant);
const isSaved=computed(()=>s.saved.includes(r.value._id));
const inCompare=computed(()=>s.compare.includes(r.value._id));
const photo=computed(()=>restaurantImage(r.value,imageUrl));
const price=computed(()=>r.value.profile?.priceRange||'$'.repeat(r.value.priceLevel||2));
function fallback(e){e.target.onerror=null;e.target.src=dishImage(r.value.cuisine);}
</script>
<template>
  <article class="rcard" v-reveal="index">
    <div class="rcard-media">
      <RouterLink :to="'/restaurants/'+r._id" class="media-link" :aria-label="'View '+r.name"><img :src="photo" :alt="r.cuisine+' dining inspiration for '+r.name" loading="lazy" @error="fallback"></RouterLink>
      <span class="chip chip-top"><Icon name="globe" :size="13"/>{{r.country}}</span>
      <button class="heart" :class="{saved:isSaved}" @click="s.toggle(r._id)" :aria-label="(isSaved?'Remove ':'Save ')+r.name" :aria-pressed="isSaved"><Icon name="heart" :size="20" :fill="isSaved"/></button>
      <span class="price-tag">{{price}}</span>
    </div>
    <div class="rcard-body">
      <div class="rcard-head"><h3><RouterLink :to="'/restaurants/'+r._id">{{r.name}}</RouterLink></h3><span v-if="r.openNow!==null&&r.openNow!==undefined" class="open" :class="{closed:!r.openNow}"><i></i>{{r.openNow?'Open now':'Closed'}}</span></div>
      <p class="meta"><Icon name="utensils" :size="14"/>{{r.cuisine}}<span class="dot">•</span><Icon name="pin" :size="14"/>{{r.borough}}</p>
      <p v-if="r.profile?.tagline" class="tagline">{{r.profile.tagline}}</p>
      <div class="rcard-stats">
        <StarRating v-if="r.reviewCount" :value="r.avgRating||0" :count="r.reviewCount" :size="15"/>
        <span v-else class="chip soft"><Icon name="sparkles" :size="13"/>New to reviews</span>
        <span class="chip quality" :title="'Total of recorded grade scores'"><Icon name="award" :size="13"/>Quality {{r.totalScore||0}}</span>
      </div>
      <div class="rcard-actions">
        <RouterLink class="btn small" :to="'/restaurants/'+r._id">View profile <Icon name="arrow-right" :size="16"/></RouterLink>
        <button class="ghost small icon-btn" :class="{active:inCompare}" @click="s.comparison(r._id)" :aria-pressed="inCompare" :aria-label="'Compare '+r.name"><Icon name="compare" :size="16"/><span>{{inCompare?'Added':'Compare'}}</span></button>
      </div>
    </div>
  </article>
</template>
<style scoped>
.rcard{background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow);display:flex;flex-direction:column;transition:transform .4s var(--ease),box-shadow .4s var(--ease),border-color .3s}
.rcard:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg);border-color:var(--moss-gardens)}
.rcard-media{position:relative;aspect-ratio:16/10;overflow:hidden;background:var(--bistre)}
.media-link{display:block;height:100%}
.rcard-media img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease)}
.rcard:hover .rcard-media img{transform:scale(1.08)}
.rcard-media:after{content:"";position:absolute;inset:auto 0 0 0;height:45%;background:linear-gradient(transparent,rgba(20,19,10,.55));pointer-events:none}
.chip-top{position:absolute;left:12px;top:12px;z-index:2}
.chip{display:inline-flex;align-items:center;gap:5px;border-radius:var(--radius-pill);padding:4px 11px;font-size:12px;font-weight:700;background:rgba(241,236,219,.94);color:var(--black-raspberry);backdrop-filter:blur(6px)}
.chip.soft{background:var(--leaf-soft);color:var(--color-text)}.chip.quality{background:var(--moss-soft);color:var(--color-text)}
.price-tag{position:absolute;left:12px;bottom:12px;z-index:2;color:var(--candle);font-weight:700;letter-spacing:.06em;text-shadow:0 1px 6px rgba(0,0,0,.5)}
.heart{position:absolute;right:12px;top:12px;z-index:3;width:44px;height:44px;min-height:44px;padding:0;border-radius:50%;background:rgba(241,236,219,.95);color:var(--bow);border:0;box-shadow:0 4px 12px rgba(0,0,0,.25);transition:transform .25s var(--ease-spring),background .2s}
.heart:hover{background:#fff;transform:scale(1.12)}
.heart.saved{animation:pop .5s var(--ease-spring)}
.heart.saved svg{filter:drop-shadow(0 0 6px rgba(126,38,37,.4))}
.rcard-body{padding:24px;display:flex;flex-direction:column;gap:8px;flex:1}
.rcard-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
.rcard h3{margin:0;font:600 24px/1.15 var(--font-heading)}.rcard h3 a{text-decoration:none}.rcard h3 a:hover{color:var(--bow)}
.open{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--forestry);white-space:nowrap;margin-top:4px}
:root[data-theme=dark] .open{color:#b8cf8f}
.open i{width:8px;height:8px;border-radius:50%;background:var(--moss-gardens);animation:ping 1.8s infinite}
.open.closed{color:var(--bow)}.open.closed i{background:var(--bow);animation:none}
.meta{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin:0;font-size:14px;color:var(--color-muted)}.dot{opacity:.5}
.tagline{margin:0;font-size:14.5px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.rcard-stats{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:auto;padding-top:6px}
.rcard-actions{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
.icon-btn{gap:6px}.icon-btn.active{background:var(--moss-gardens);color:var(--black-raspberry);border-color:var(--moss-gardens)}
@keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.4)}100%{transform:scale(1)}}
@keyframes ping{0%{box-shadow:0 0 0 0 rgba(117,137,86,.6)}80%,100%{box-shadow:0 0 0 8px rgba(117,137,86,0)}}
</style>
