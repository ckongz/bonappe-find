import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {createSSRApp} from 'vue';
import {renderToString} from '@vue/server-renderer';
import {createPinia} from 'pinia';
import {createRouter,createMemoryHistory} from 'vue-router';
// Render controls under each account status without a browser or external service.
globalThis.window={location:{href:'http://localhost'},addEventListener(){},removeEventListener(){}};
globalThis.document={documentElement:{dataset:{}}};
globalThis.localStorage={getItem(){return null;},setItem(){}};
const server=await createServer({root:new URL('..',import.meta.url).pathname,server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]}});
try{
 const {useAuth}=await server.ssrLoadModule('/src/stores/index.js');
 const components=await Promise.all(['AppHeader','AppFooter','DashShell'].map(async name=>(await server.ssrLoadModule('/src/components/layout/'+name+'.vue')).default));
 for(const [label,user,manage,suggest] of [
  ['visitor',null,false,true],['regular',{role:'customer',emailVerified:false},false,true],
  ['pending owner',{role:'owner',emailVerified:true,ownerProfile:{verificationStatus:'pending'}},false,false],
  ['rejected owner',{role:'owner',emailVerified:true,ownerProfile:{verificationStatus:'rejected'}},false,false],
  ['unverified approved owner',{role:'owner',emailVerified:false,ownerProfile:{verificationStatus:'approved'}},false,false],
  ['approved owner',{role:'owner',emailVerified:true,ownerProfile:{verificationStatus:'approved'}},true,false],
  ['admin',{role:'admin',emailVerified:true},true,false]]){
  for(const [index,component]of components.entries()){
   const pinia=createPinia(),auth=useAuth(pinia);auth.user=user?{name:'Test Account',_id:'123',...user}:null;
   const router=createRouter({history:createMemoryHistory(),routes:[{path:'/:pathMatch(.*)*',component:{render:()=>null}}]});await router.push('/');await router.isReady();
   const app=createSSRApp(component,{title:'Test dashboard',addLink:true});app.use(pinia).use(router);const html=await renderToString(app);
   assert.equal(/href="\/restaurants\/new"/.test(html),manage,`${label}: management visibility in component ${index}`);
   if(index<2)assert.equal(/href="\/suggest-restaurant"/.test(html),suggest,`${label}: separate suggestions`);
  }
 }
 console.log('Passed 35 UI permission visibility assertions across header, footer and dashboard shell.');
}finally{await server.close();}
