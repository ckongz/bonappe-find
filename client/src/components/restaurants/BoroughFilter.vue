<script setup>
import Icon from '../common/Icon.vue';
defineProps({boroughs:{type:Array,default:()=>[]},active:String});
const emit=defineEmits(['select']);
</script>
<template><div class="row" role="group" aria-label="Filter by borough or region"><button v-for="b in boroughs" :key="b" class="ghost pill toggle small" :class="{active:active===b}" :aria-pressed="active===b" @click="emit('select',b)"><Icon name="pin" :size="14"/>{{b}}</button></div></template>
