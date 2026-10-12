// Small form-validation helper: per-field rules, validate on blur, live re-validation after first touch,
// focus the first invalid field on submit, and a `shake` flag the template can use for feedback.
import {ref,reactive,nextTick} from 'vue';
export const required=(msg='This field is required.')=>v=>(v===undefined||v===null||String(v).trim()==='')?msg:'';
export const minLength=(n,msg)=>v=>v&&String(v).trim().length<n?(msg||`Please use at least ${n} characters.`):'';
export const maxLength=(n,msg)=>v=>v&&String(v).length>n?(msg||`Please use no more than ${n} characters.`):'';
export const email=(msg='Enter an email address like name@example.com.')=>v=>v&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())?msg:'';
export const url=(msg='Enter a full link starting with https://')=>v=>{if(!v)return '';try{const u=new URL(v);return ['http:','https:'].includes(u.protocol)?'':msg;}catch{return msg;}};
export const matches=(getOther,msg='These values do not match.')=>v=>v!==getOther()?msg:'';
export function useFormValidation(values,schema,{idPrefix=''}={}){
  const errors=reactive({}),touched=reactive({}),shake=ref(false);
  const check=key=>{for(const rule of schema[key]||[]){const m=rule(values.value?values.value[key]:values[key]);if(m)return m;}return '';};
  function validateField(key){touched[key]=true;errors[key]=check(key);return !errors[key];}
  function onInput(key){if(touched[key])errors[key]=check(key);}
  function reset(){for(const k of Object.keys(schema)){errors[k]='';touched[k]=false;}}
  function setServerErrors(list=[]){for(const x of list)if(x.field)errors[x.field]=x.message;}
  async function validateAll(){let first='';for(const key of Object.keys(schema)){touched[key]=true;errors[key]=check(key);if(errors[key]&&!first)first=key;}
    if(first){shake.value=false;await nextTick();shake.value=true;setTimeout(()=>shake.value=false,500);document.getElementById(idPrefix+first)?.focus();return false;}return true;}
  return{errors,touched,shake,validateField,onInput,validateAll,reset,setServerErrors};
}
