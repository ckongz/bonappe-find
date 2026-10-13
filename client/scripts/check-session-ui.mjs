import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {createPinia,setActivePinia} from 'pinia';
const storage=new Map();let ended=0;
globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
globalThis.window={addEventListener(){},dispatchEvent(){ended++;}};
const server=await createServer({root:new URL('..',import.meta.url).pathname,server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]}});
try{
 const {api}=await server.ssrLoadModule('/src/services/api.js');
 const attach=api.interceptors.request.handlers[0].fulfilled;
 const reject=api.interceptors.response.handlers[0].rejected;
 storage.set('bonappefind_token','new-session');
 for(const url of ['/auth/login','/auth/register','/owners/register','/auth/forgot-password','/auth/reset-password'])assert.equal(attach({url,headers:{}}).headers.Authorization,undefined);
 assert.equal(attach({url:'/me/search-history',headers:{}}).headers.Authorization,'Bearer new-session');
 const fail=async authorization=>{try{await reject({response:{status:401},config:{headers:{Authorization:authorization}}});}catch{}};
 await fail(undefined);assert.equal(storage.get('bonappefind_token'),'new-session');
 await fail('Bearer old-session');assert.equal(storage.get('bonappefind_token'),'new-session');assert.equal(ended,0);
 await fail('Bearer new-session');assert.equal(storage.has('bonappefind_token'),false);assert.equal(ended,1);
 const {useAuth}=await server.ssrLoadModule('/src/stores/index.js');setActivePinia(createPinia());const auth=useAuth();auth.accept({token:'accepted-session',user:{_id:'test',role:'owner'}});assert.equal(auth.ready,true);assert.equal(auth.user.role,'owner');
 console.log('Frontend session regression checks passed.');
}finally{await server.close();}
