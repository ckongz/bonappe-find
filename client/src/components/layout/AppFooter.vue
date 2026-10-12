<script setup>
import {useAuth} from '../../stores/index.js';const auth=useAuth();
import NewsletterBox from '../NewsletterBox.vue';
import Icon from '../common/Icon.vue';
const explore=[['Restaurants','/restaurants'],['Countries','/countries'],['Best Quality','/best-quality'],['Cuisines','/cuisines'],['Surprise Me','/surprise'],['Guides','/guides']];
const company=[['About','/about'],['Features','/features'],['How It Works','/how-it-works'],['Team','/team'],['FAQs','/faqs'],['Contact','/contact']];
const legal=[['Terms of Use','/terms'],['Privacy Policy','/privacy'],['Cookie Policy','/cookies'],['Accessibility','/accessibility'],['Sitemap','/sitemap'],['Photo credits','/photo-credits']];
</script>
<template>
  <footer>
    <svg class="wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60V28C240 -4 480 -4 720 24s480 34 720 4v32z"/></svg>
    <div class="container">
      <section class="news-panel" aria-labelledby="news-title">
        <div class="news-copy"><h2 id="news-title">Hungry for more?</h2><p>One tasty story a month: new finds, country food guides and the dishes behind them.</p></div>
        <NewsletterBox class="news-form"/>
      </section>

      <div class="footer-grid">
        <div class="brand"><RouterLink class="wordmark" to="/" aria-label="BonAppé Find, go to the home page">BonAppé Find</RouterLink><p class="tagline">Great dining starts with a great find.</p><p class="blurb">A restaurant guide that explains the food as well as the address.</p>
          <p class="free"><Icon name="shield" :size="15"/> Free to use. No account needed.</p>
          <div class="brand-actions"><RouterLink to="/restaurants" class="btn small brand-btn">Browse restaurants</RouterLink><RouterLink v-if="!auth.user||auth.user.role==='customer'" to="/suggest-restaurant" class="btn secondary small">Suggest a Restaurant</RouterLink><RouterLink v-if="auth.canManage" to="/restaurants/new" class="btn small ghost-light">Add a restaurant</RouterLink></div>
        </div>
        <nav aria-labelledby="f-explore"><h3 id="f-explore">Explore</h3><ul><li v-for="[n,u] in explore" :key="u"><RouterLink :to="u"><Icon name="chevron-right" :size="14"/>{{n}}</RouterLink></li></ul></nav>
        <nav aria-labelledby="f-company"><h3 id="f-company">Company</h3><ul><li v-for="[n,u] in company" :key="u"><RouterLink :to="u"><Icon name="chevron-right" :size="14"/>{{n}}</RouterLink></li></ul></nav>
        <nav aria-labelledby="f-legal"><h3 id="f-legal">Legal</h3><ul><li v-for="[n,u] in legal" :key="u"><RouterLink :to="u"><Icon name="chevron-right" :size="14"/>{{n}}</RouterLink></li></ul></nav>
      </div>

      <div class="footer-bottom">
        <div class="legal-text"><p>© 2026 BonAppé Find. A student project for 6ADDBASE and 6WCSERVER.</p><p>Curated restaurants are fictional examples. Please confirm details with a restaurant before you visit.</p></div>
      </div>
    </div>
  </footer>
</template>
<style scoped>
footer{position:relative;background:var(--bistre);color:var(--candle);padding:70px 0 34px;margin-top:100px}
.wave{position:absolute;top:1px;left:0;width:100%;height:46px;transform:translateY(-100%);fill:var(--bistre)}
.news-panel{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:32px;align-items:center;padding:30px 34px;margin-bottom:56px;border:1px solid rgba(241,236,219,.16);border-radius:26px;background:linear-gradient(135deg,rgba(117,137,86,.35),rgba(241,236,219,.05))}
.news-copy h2{margin:0 0 6px;color:var(--candle);font-size:clamp(26px,3vw,34px)}
.news-copy p{margin:0;opacity:.85;max-width:420px;line-height:1.55}
.news-form :deep(label){position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.news-form :deep(.nl-msg){margin-bottom:0}
.footer-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:48px}
footer h3{color:var(--candle);margin:0 0 16px;font-family:var(--font-heading);font-size:22px}
ul{list-style:none;margin:0;padding:0}
.footer-grid li a{display:inline-flex;align-items:center;gap:4px;padding:7px 0;font-size:15px;color:var(--candle);text-decoration:none;opacity:.82;transition:opacity .2s,transform .25s var(--ease)}
.footer-grid li a:hover{opacity:1;transform:translateX(5px);text-decoration:underline;text-underline-offset:5px}
.wordmark{font-family:var(--font-brand);font-size:38px;font-weight:400;line-height:1;text-decoration:none;color:var(--candle);display:inline-block}
.tagline{font-style:italic;margin:14px 0 6px}
.blurb{margin:0 0 14px;opacity:.8;font-size:14px;line-height:1.6;max-width:340px}
.free{display:flex;align-items:center;gap:8px;margin:0 0 18px;font-size:13px;color:#c7cb9f;font-weight:700}
.brand-actions{display:flex;flex-wrap:wrap;gap:10px}
.brand-actions .btn{min-height:42px}
.brand-btn{background:var(--candle);color:var(--forestry);border:0;font-weight:800}
.brand-btn:hover{background:#fff;color:var(--forestry)}
.ghost-light{background:transparent;border:1.5px solid rgba(241,236,219,.4);color:var(--candle)}
.ghost-light:hover{background:rgba(241,236,219,.14);color:var(--candle)}
.footer-bottom{display:flex;gap:24px;margin-top:48px;padding-top:24px;border-top:1px solid rgba(241,236,219,.16)}
.legal-text p{margin:0 0 6px;font-size:13px;opacity:.78;max-width:720px;line-height:1.55}
@media(max-width:1000px){.footer-grid{grid-template-columns:1fr 1fr;gap:36px 40px}.brand{grid-column:1/-1}.news-panel{grid-template-columns:1fr;padding:26px}}
@media(max-width:600px){footer{padding:56px 0 28px}.footer-grid{grid-template-columns:1fr 1fr;gap:28px 20px}.footer-bottom{flex-direction:column}.news-panel{padding:22px 18px;border-radius:22px;margin-bottom:40px}.wordmark{font-size:34px}}
@media(max-width:380px){.footer-grid{grid-template-columns:1fr}}
</style>
