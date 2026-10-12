import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import router from './router/index.js';
import reveal from './directives/reveal.js';
import './assets/css/fonts.css';
import './assets/css/tokens.css';
import './assets/css/base.css';
import './assets/css/components.css';
import './assets/css/editorial.css';
import './assets/css/polish.css';
import './assets/css/enhance.css';
import './assets/css/interactions.css';
import {initInteractions} from './utils/interactions.js';
let theme='light';
try{theme=localStorage.getItem('bonappefind_theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}catch{}
document.documentElement.dataset.theme=theme;
createApp(App).use(createPinia()).use(router).directive('reveal',reveal).mount('#app');
initInteractions();
