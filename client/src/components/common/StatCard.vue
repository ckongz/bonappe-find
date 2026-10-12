<script setup>
import {toRef} from 'vue';
import Icon from './Icon.vue';
import {useCountUp} from '../../composables/useCountUp.js';
const props=defineProps({value:{type:Number,default:0},label:String,icon:{type:String,default:'utensils'}});
const shown=useCountUp(toRef(props,'value'));
</script>
<template>
  <div class="stat-card"><span class="stat-icon"><Icon :name="icon" :size="22"/></span><div><b class="stat-num">{{shown}}</b><p>{{label}}</p></div></div>
</template>
<style scoped>
.stat-card{display:flex;align-items:center;gap:16px;padding:20px 22px;background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);box-shadow:var(--shadow);transition:transform .35s var(--ease),box-shadow .35s var(--ease)}.stat-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg)}.stat-icon{display:grid;place-items:center;width:48px;height:48px;border-radius:14px;background:var(--moss-soft);color:var(--forestry)}.stat-num{display:block;font:600 34px/1 var(--font-heading);color:var(--color-heading)}.stat-card p{margin:4px 0 0;font-size:13px;color:var(--color-muted)}:root[data-theme=dark] .stat-icon{color:var(--candle)}
</style>
