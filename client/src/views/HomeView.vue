<script setup>
import {ref,computed,onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {get,message} from '../services/api.js';
import {BOROUGHS} from '../utils/constants.js';
import {dishImage} from '../utils/formatters.js';
import RestaurantCard from '../components/restaurants/RestaurantCard.vue';
import CountryCard from '../components/countries/CountryCard.vue';
import StatCard from '../components/common/StatCard.vue';
import Icon from '../components/common/Icon.vue';
const router=useRouter();
const search=ref(''),field=ref('name'),countries=ref([]),restaurants=ref([]),filters=ref({}),total=ref(0),error=ref(''),loading=ref(true);
const popular=['Sushi','Pizza','Bakery','Ramen','Tacos','Thai','Indian','French'];
const cuisineTiles=computed(()=>{
  const list=filters.value.cuisines?.length?filters.value.cuisines:['Filipino','Sushi','Ramen','Italian','Pizza','Mexican','Tacos','French','Bakery','Indian','Thai'];
  return list.slice(0,14);
});
const stats=computed(()=>[
  [total.value,'Restaurants listed','utensils'],
  [countries.value.length,'Country guides','globe'],
  [filters.value.cuisines?.length||0,'Cuisines to explore','bowl'],
  [filters.value.boroughs?.length||0,'Regions to filter by','pin']
]);
const steps=[
  ['01','Search','search','Type a name or cuisine. Narrow your search by region, price and dietary needs.'],
  ['02','Compare','compare','Check the recorded grades, review ratings and the dishes worth ordering.'],
  ['03','Enjoy','chef','Read the story and table manners, then confirm the details before you go.']
];
onMounted(async()=>{
  try{
    const [a,b,c,d]=await Promise.all([get('/countries'),get('/restaurants/featured'),get('/restaurants/meta/filters'),get('/restaurants',{limit:1})]);
    countries.value=a.data;restaurants.value=b.data.slice(0,6);filters.value=c.data;total.value=d.meta.total;
  }catch(e){error.value=message(e);}finally{loading.value=false;}
});
function submit(){router.push({path:'/restaurants',query:{search:search.value,field:field.value}});}
</script>
<template>
  <div class="home-page">
  <section class="hero">
    <div class="container hero-grid">
      <div class="hero-copy">
        <p class="eyebrow hero-in" style="--d:0ms"><Icon name="sparkles" :size="14"/> Restaurant and country food guide</p>
        <h1 class="hero-in" style="--d:100ms">Great dining starts<br>with a <em>great find.</em></h1>
        <p class="intro hero-in" style="--d:200ms">Find a restaurant in seconds, see how it scores, and learn the story behind every plate.</p>
        <form @submit.prevent="submit" class="hero-search hero-in" style="--d:300ms" role="search">
          <label for="home-search" class="sr-only">What are you craving?</label>
          <div class="hs-field"><Icon name="search" :size="20"/><input id="home-search" v-model="search" placeholder="What are you craving? Try Bakery, Sushi or Star" type="search" autocomplete="off"></div>
          <div class="hs-select"><label class="sr-only" for="home-field">Search field</label><select id="home-field" v-model="field"><option value="name">Name</option><option value="cuisine">Cuisine</option></select></div>
          <button class="cta hs-btn"><Icon name="search" :size="18"/>Search</button>
        </form>
        <div class="popular hero-in" style="--d:400ms"><span>Popular:</span><RouterLink v-for="p in popular" :key="p" :to="{path:'/restaurants',query:{search:p,field:'cuisine'}}" class="hero-chip">{{p}}</RouterLink></div>
        <div class="row hero-in" style="--d:500ms;margin-top:26px"><RouterLink to="/restaurants" class="btn cta">Browse Restaurants <Icon name="arrow-right" :size="18"/></RouterLink><RouterLink to="/countries" class="hero-link">Explore Countries <Icon name="arrow-right" :size="16"/></RouterLink></div>
        <p class="small trust hero-in" style="--d:600ms"><Icon name="shield" :size="14"/> Free to use. No account needed.</p>
      </div>
      <div class="hero-art" aria-hidden="false">
        <div class="arch"><img src="/images/photos/dining.jpg" alt="A welcoming restaurant dining room with warm lighting and carefully set tables."></div>
        <RouterLink to="/restaurants?cuisine=Sushi" class="float-card fc1"><img src="/images/photos/sushi.jpg" alt=""><div><b>Sakura Counter</b><span><Icon name="star" :size="13" fill/> Explore Sushi</span></div></RouterLink>
        <RouterLink to="/restaurants?cuisine=Pizza" class="float-card fc2"><img src="/images/photos/pizza.jpg" alt=""><div><b>Forno Azzurro</b><span>Explore Pizza</span></div></RouterLink>
        <RouterLink to="/best-quality" class="float-card fc3"><Icon name="award" :size="22"/><div><b>Quality 90+</b><span>Top scorers</span></div></RouterLink>
      </div>
    </div>
    <svg class="hero-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 80V40C200 0 420 0 720 34s560 40 720 6v40z"/></svg>
  </section>

  <div class="container">
    <p v-if="error" role="alert" class="error-box" style="margin-top:24px">{{error}}</p>

    <section class="stats-row">
      <StatCard v-for="([value,label,icon],i) in stats" :key="label" :value="value" :label="label" :icon="icon" v-reveal="i"/>
    </section>

    <section class="section tight">
      <div class="section-head" v-reveal><div><p class="eyebrow">What are you craving?</p><h2>Browse by cuisine</h2></div><RouterLink to="/cuisines" class="link-arrow">All cuisines <Icon name="arrow-right" :size="16"/></RouterLink></div>
      <div class="cuisine-strip" v-reveal>
        <RouterLink v-for="c in cuisineTiles" :key="c" :to="{path:'/restaurants',query:{cuisine:c}}" class="cuisine-tile"><div class="disc"><img :src="dishImage(c)" :alt="c+' dish inspiration'" loading="lazy"></div><span>{{c}}</span></RouterLink>
      </div>
    </section>

    <section class="section">
      <div class="section-head" v-reveal><div><p class="eyebrow">Stories worth sitting down for</p><h2>Tables worth a visit</h2><p class="muted">These curated profiles are fictional examples created for our student project.</p></div><RouterLink to="/restaurants" class="link-arrow">See all restaurants <Icon name="arrow-right" :size="16"/></RouterLink></div>
      <div v-if="loading" class="grid"><div v-for="n in 3" :key="n" class="skeleton" style="min-height:380px"></div></div>
      <div v-else class="grid"><RestaurantCard v-for="(r,i) in restaurants" :key="r._id" :restaurant="r" :index="i%3"/></div>
    </section>

    <section class="section steps-wrap">
      <div class="section-head" v-reveal><div><p class="eyebrow">A little curiosity goes a long way</p><h2>Three steps to a great meal</h2></div><RouterLink to="/how-it-works" class="link-arrow">See the full guide <Icon name="arrow-right" :size="16"/></RouterLink></div>
      <div class="steps-grid" style="margin-top:52px">
        <article v-for="([n,title,icon,text],i) in steps" :key="n" class="step-card" v-reveal="i"><span class="step-n">{{n}}</span><span class="step-icon"><Icon :name="icon" :size="30"/></span><h3>{{title}}</h3><p class="muted">{{text}}</p></article>
      </div>
    </section>

    <section class="section">
      <div class="section-head" v-reveal><div><p class="eyebrow">The world at your table</p><h2>Explore eight food cultures</h2></div><RouterLink to="/countries" class="link-arrow">See all countries <Icon name="arrow-right" :size="16"/></RouterLink></div>
      <div class="countries-grid"><CountryCard v-for="(c,i) in countries" :key="c.slug" :country="c" :index="i%4"/></div>
    </section>

    <section class="band" v-reveal.zoom>
      <p class="eyebrow">Recorded grades, clearly explained</p>
      <h2>Top scorers, ranked by data</h2>
      <p>We add every recorded score and show totals above 90. This is a classroom calculation, not an official quality or safety rating.</p>
      <div class="meter" aria-hidden="true"><i style="--w:92%"></i><i style="--w:78%"></i><i style="--w:64%"></i></div>
      <RouterLink to="/best-quality" class="btn cta">View Best Quality <Icon name="award" :size="18"/></RouterLink>
    </section>

    <section class="section">
      <div class="section-head" v-reveal><div><h2>Pick your borough</h2><p class="muted">Explore the original course dataset by New York borough.</p></div></div>
      <div class="pill-row" v-reveal><RouterLink v-for="b in BOROUGHS" :key="b" :to="{path:'/restaurants',query:{borough:b}}" class="chip-link"><Icon name="pin" :size="15"/>{{b}}</RouterLink></div>
    </section>

    <section class="band red cta-band" v-reveal.zoom>
      <div><h2>Hungry for more?</h2><p>Add your favorite restaurant, or let us surprise you.</p></div>
      <div class="row"><RouterLink to="/restaurants/new" class="btn light"><Icon name="plus" :size="18"/>Add a Restaurant</RouterLink><RouterLink to="/surprise" class="btn ghost-light"><Icon name="shuffle" :size="18"/>Surprise Me</RouterLink></div>
    </section>
  </div>
  </div>
</template>
<style scoped>
.hero{position:relative;background:radial-gradient(1200px 500px at 85% 0%,#3e4f2a,transparent 60%),linear-gradient(160deg,var(--juniper),var(--black-raspberry));color:var(--candle);overflow:hidden}
.blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.35;animation:drift 9s ease-in-out infinite}
.b1{width:340px;height:340px;background:var(--moss-gardens);left:-90px;top:20px}.b2{width:300px;height:300px;background:var(--bow);right:8%;bottom:-120px;animation-delay:-4s}
.hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);align-items:center;gap:64px;padding:80px 0 110px}
.hero h1{font-size:clamp(40px,4.6vw,66px);color:var(--candle);line-height:1.04}.hero h1 em{color:#c7cb9f;font-style:italic}
.hero .eyebrow{color:#c7cb9f;display:inline-flex;align-items:center;gap:8px}
.intro{max-width:520px;font-size:19px;color:#dad6c6}
.hero-in{animation:fade-up .8s var(--ease) both;animation-delay:var(--d,0ms)}
.hero-search{animation:none;display:flex;gap:0;align-items:center;margin:30px 0 16px;background:var(--candle);border-radius:var(--radius-pill);padding:7px;box-shadow:0 20px 50px rgba(0,0,0,.4);max-width:640px;transition:box-shadow .3s,transform .3s var(--ease)}
.hero-search:focus-within{box-shadow:0 0 0 5px rgba(117,137,86,.5),0 20px 50px rgba(0,0,0,.4);transform:translateY(-2px)}
.hs-field{flex:1;display:flex;align-items:center;gap:10px;padding-left:16px;color:var(--baby-bear)}
.hero-search input,.hero-search select{border:0;background:transparent;color:var(--black-raspberry);box-shadow:none!important;min-height:48px;padding:0 6px}
.hs-select{border-left:1px solid var(--color-border);padding:0 6px;width:118px}
.hs-btn{padding:0 24px;min-height:50px}
.popular{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:14px;color:#dad6c6}
.hero-chip{padding:5px 14px;border-radius:var(--radius-pill);background:rgba(241,236,219,.12);border:1px solid rgba(241,236,219,.22);text-decoration:none;color:var(--candle);transition:background .25s,transform .25s var(--ease)}
.hero-chip:hover{background:var(--candle);color:var(--black-raspberry);transform:translateY(-3px)}
.hero-link{text-decoration:none;display:inline-flex;align-items:center;gap:6px;margin-left:8px;color:var(--candle);font-weight:700;transition:gap .3s}.hero-link:hover{gap:12px}
.trust{margin-top:18px;color:#c9c5b4;display:flex;gap:6px;align-items:center}
.hero-art{position:relative;max-width:520px;margin-left:auto;width:100%}
.arch{border-radius:260px 260px 28px 28px;overflow:hidden;border:6px solid rgba(241,236,219,.18);box-shadow:var(--shadow-lg);animation:fade-up .8s var(--ease)}
.arch img{width:100%;aspect-ratio:4/4.6;object-fit:cover}
.float-card{text-decoration:none;position:absolute;display:flex;align-items:center;gap:12px;background:var(--candle);color:var(--black-raspberry);padding:10px 16px 10px 10px;border-radius:16px;box-shadow:var(--shadow-lg);transition:transform .3s var(--ease)}
.float-card img{width:54px;height:54px;border-radius:12px;object-fit:cover}
.float-card b{display:block;font-size:14px}.float-card span{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--baby-bear)}
.float-card svg{color:var(--star)}
.float-card:hover{transform:translateY(-4px)}.fc1{left:-24px;top:16%}.fc2{right:-20px;top:46%;animation-delay:-2s}.fc3{left:6%;bottom:-18px;animation-delay:-4s}.fc3 svg{color:var(--bow)}
.open-dot i{width:8px;height:8px;border-radius:50%;background:var(--moss-gardens);display:inline-block;animation:ping 1.8s infinite}
@keyframes ping{0%{box-shadow:0 0 0 0 rgba(117,137,86,.7)}80%,100%{box-shadow:0 0 0 9px rgba(117,137,86,0)}}
.hero-wave{position:absolute;bottom:-1px;left:0;width:100%;height:70px;fill:var(--color-bg)}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:-30px;position:relative;z-index:2}
.tight{padding-bottom:24px}
.countries-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px}
.meter{display:grid;gap:10px;margin:22px 0 28px;max-width:420px}.meter i{display:block;height:10px;border-radius:6px;background:rgba(241,236,219,.18);position:relative;overflow:hidden}
.meter i:after{content:"";position:absolute;inset:0;width:var(--w);background:linear-gradient(90deg,var(--moss-gardens),#c7cb9f);border-radius:6px;transform-origin:left;animation:grow-x 1.6s var(--ease) both}
.cta-band{display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap;margin-bottom:20px}.cta-band p{margin:0}
.btn.light{background:var(--candle);color:var(--bow)}.btn.light:hover{background:#fff}
.btn.ghost-light{background:transparent;border:1.5px solid var(--candle);color:var(--candle)}.btn.ghost-light:hover{background:var(--candle);color:var(--bow)}
@media(max-width:1000px){.countries-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:900px){.hero-grid{grid-template-columns:1fr;padding:44px 0 90px}.hero-art{max-width:400px;margin:20px auto 0}.fc1{left:-8px}.fc2{right:-8px}.stats-row{grid-template-columns:1fr 1fr}}
@media(max-width:600px){
  .hero-search{flex-wrap:wrap;border-radius:24px;padding:10px}.hs-field{flex:1 1 100%;padding:0 6px}.hs-select{border:0;flex:1;width:auto;padding:0}.hs-btn{flex:1}
  .countries-grid{grid-template-columns:1fr}.float-card{padding:8px 12px 8px 8px}.float-card img{width:42px;height:42px}.float-card b{font-size:12px}.stats-row{gap:12px}
}
</style>
