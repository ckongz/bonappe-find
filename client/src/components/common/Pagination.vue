<script setup>
import {toRef} from 'vue';
import Icon from './Icon.vue';
import {usePagination} from '../../composables/usePagination.js';
const props=defineProps({meta:{type:Object,default:()=>({})},busy:Boolean});
const emit=defineEmits(['page']);
const {pages}=usePagination(toRef(props,'meta'));
</script>
<template>
  <nav class="pager" aria-label="Pagination">
    <button class="ghost" :disabled="(meta.page||1)<=1||busy" @click="emit('page',meta.page-1)"><Icon name="chevron-left" :size="16"/> Previous page</button>
    <template v-for="(n,i) in pages" :key="i">
      <span v-if="n==='…'" class="gap" aria-hidden="true">…</span>
      <button v-else class="ghost num" :class="{active:n===meta.page}" :aria-label="'Go to page '+n" :aria-current="n===meta.page?'page':undefined" @click="emit('page',n)">{{n}}</button>
    </template>
    <button class="ghost" :disabled="(meta.page||1)>=(meta.pages||1)||busy" @click="emit('page',meta.page+1)">Next page <Icon name="chevron-right" :size="16"/></button>
  </nav>
</template>
<style scoped>
.pager{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;margin-top:32px}.num{min-width:44px;padding:8px}.gap{padding:0 4px;color:var(--color-muted)}
</style>
