<script setup>
import Icon from './Icon.vue';
defineProps({value:{type:Number,default:0},count:Number,size:{type:Number,default:16}});
</script>
<template>
  <span class="stars" :aria-label="value?value.toFixed(1)+' out of 5 stars'+(count?', '+count+' reviews':''):'No reviews yet'">
    <span class="stars-row" aria-hidden="true">
      <Icon v-for="n in 5" :key="n" name="star" :size="size" :fill="n<=Math.round(value)" :class="{on:n<=Math.round(value)}"/>
    </span>
    <b v-if="value">{{value.toFixed(1)}}</b><span v-if="count" class="muted small">({{count}})</span>
  </span>
</template>
<style scoped>
.stars{display:inline-flex;align-items:center;gap:6px;font-size:14px}.stars-row{display:inline-flex;gap:1px;color:var(--color-border)}.stars-row .on{color:var(--star)}
</style>
