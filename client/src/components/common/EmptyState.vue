<script setup>
import Icon from './Icon.vue';
defineProps({title:String,text:String,icon:{type:String,default:'search'}});
</script>
<template>
  <div class="empty-state" v-reveal.zoom>
    
    <h2><Icon :name="icon" :size="22"/> {{title}}</h2>
    <p class="muted">{{text}}</p>
    <slot/>
  </div>
</template>
<style scoped>
.empty-state{text-align:center;padding:48px 20px}.empty-state img{margin:0 auto 12px}.empty-state h2{display:flex;justify-content:center;align-items:center;gap:10px}
</style>
