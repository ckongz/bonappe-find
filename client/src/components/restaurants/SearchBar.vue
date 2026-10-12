<script setup>
import {ref} from 'vue';
import Icon from '../common/Icon.vue';
const emit=defineEmits(['search']);const q=ref(''),field=ref('name');
</script>
<template><form class="row" role="search" @submit.prevent="emit('search',{search:q,field})"><div style="flex:1;position:relative;min-width:200px"><label class="sr-only" for="sb">Search</label><input id="sb" v-model="q" type="search" placeholder="Search by name or cuisine"></div><select v-model="field" aria-label="Search field" style="width:130px"><option value="name">Name</option><option value="cuisine">Cuisine</option></select><button class="cta"><Icon name="search" :size="18"/>Search</button></form></template>
