<script setup>
defineProps({items:{type:Array,default:()=>[]}}); // [{label, to}] last item has no link
</script>
<template><nav class="bread" aria-label="Breadcrumb"><template v-for="(i,n) in items" :key="n"><RouterLink v-if="i.to" :to="i.to">{{i.label}}</RouterLink><span v-else aria-current="page">{{i.label}}</span><span v-if="n<items.length-1"> / </span></template></nav></template>
