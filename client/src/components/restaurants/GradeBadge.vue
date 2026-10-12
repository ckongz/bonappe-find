<script setup>
import Icon from '../common/Icon.vue';
defineProps({grade:String,score:[Number,String]});
</script>
<template>
  <span class="grade" :class="grade" :title="'Grade '+grade+(score!==undefined?', score '+score:'')"><Icon :name="grade==='A'?'check':'info'" :size="12"/>{{grade}}<template v-if="score!==undefined"> · {{score}}</template></span>
</template>
<style scoped>
.grade{display:inline-flex;align-items:center;gap:4px;border-radius:var(--radius-pill);padding:3px 10px;font-size:13px;font-weight:700;background:var(--leaf);color:var(--black-raspberry);margin:0 4px 4px 0}.grade.A{background:var(--moss-gardens)}.grade.C{background:var(--baby-bear);color:var(--candle)}
</style>
