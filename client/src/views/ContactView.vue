<script setup>
import {ref,computed} from 'vue';import {useRouter} from 'vue-router';import {post,message} from '../services/api.js';import {useFormValidation,required,email,minLength} from '../composables/useFormValidation.js';import {useUnsavedGuard} from '../composables/useUnsavedGuard.js';import ConfirmDialog from '../components/ConfirmDialog.vue';
const router=useRouter(),b=ref({name:'',email:'',subject:'',message:'',website:''}),busy=ref(false),error=ref(''),sent=ref(false);
const {errors,touched,shake,validateField,onInput,validateAll,setServerErrors}=useFormValidation(b,{name:[required('Please tell us your name.')],email:[required('Please enter your email address.'),email()],subject:[required('Choose a subject so we can route your message.')],message:[required('Write a short message.'),minLength(10,'Please write at least 10 characters so we can help.')]},{idPrefix:'contact-'});
const dirty=computed(()=>!sent.value&&(b.value.name||b.value.email||b.value.subject||b.value.message));
const guard=useUnsavedGuard(()=>!!dirty.value);
async function submit(){error.value='';if(!await validateAll())return;busy.value=true;try{await post('/contact',b.value);sent.value=true;router.push('/thank-you');}catch(e){error.value=message(e);setServerErrors(e.response?.data?.errors);}finally{busy.value=false;}}
const bad=k=>!!(touched[k]&&errors[k]);
</script>
<template>
<div class="container section"><div class="page-head"><p class="eyebrow muted">We read every message</p><h1>Say hello</h1><p>Questions, corrections and ideas are always welcome.</p></div>
<div class="split"><form novalidate :aria-busy="busy" class="card pad stack" :class="{shake}" @submit.prevent="submit">
  <p v-if="error" class="form-status error" role="alert">{{error}}</p>
  <div class="form-grid">
    <div class="field"><label for="contact-name">Your name <span class="req" aria-hidden="true">*</span></label><input id="contact-name" v-model="b.name" autocomplete="name" :aria-invalid="bad('name')" aria-describedby="contact-name-msg" @blur="validateField('name')" @input="onInput('name')"><p id="contact-name-msg" v-if="bad('name')" class="field-msg">{{errors.name}}</p></div>
    <div class="field"><label for="contact-email">Email address <span class="req" aria-hidden="true">*</span></label><input id="contact-email" v-model="b.email" type="email" autocomplete="email" :aria-invalid="bad('email')" aria-describedby="contact-email-msg" @blur="validateField('email')" @input="onInput('email')"><p id="contact-email-msg" v-if="bad('email')" class="field-msg">{{errors.email}}</p></div>
  </div>
  <div class="field"><label for="contact-subject">Subject <span class="req" aria-hidden="true">*</span></label><select id="contact-subject" v-model="b.subject" :aria-invalid="bad('subject')" aria-describedby="contact-subject-msg" @blur="validateField('subject')" @change="validateField('subject')"><option value="">Choose a subject</option><option v-for="x in ['General question','Report wrong information','Add or remove a restaurant','Feedback or idea','Bug report','Partnership','Something else']" :key="x">{{x}}</option></select><p id="contact-subject-msg" v-if="bad('subject')" class="field-msg">{{errors.subject}}</p></div>
  <div class="field"><label for="contact-message">Message <span class="req" aria-hidden="true">*</span></label><textarea id="contact-message" v-model="b.message" maxlength="1000" placeholder="Tell us how we can help" :aria-invalid="bad('message')" aria-describedby="contact-message-msg" @blur="validateField('message')" @input="onInput('message')"></textarea><div class="msg-row"><p id="contact-message-msg" v-if="bad('message')" class="field-msg">{{errors.message}}</p><span class="char-count" :class="{near:b.message.length>900}">{{b.message.length}} / 1000</span></div></div>
  <div class="honeypot" aria-hidden="true"><label for="contact-website">Leave this empty</label><input id="contact-website" v-model="b.website" tabindex="-1" autocomplete="off"></div>
  <p class="small muted">By sending this form you agree that we may use your details to reply to you. See our <RouterLink to="/privacy">Privacy Policy</RouterLink>.</p>
  <button class="cta" :class="{'is-loading':busy}" :disabled="busy"><span>Send message</span></button>
</form>
<aside class="card contact-aside"><img class="contact-photo" src="/images/photos/bistro.jpg" alt="A comfortable restaurant dining area" loading="lazy"><div class="pad"><h2>Good to know</h2><p>Please do not include passwords or private details in your message.</p><p>This form stores messages in the project database for the team to review.</p><p class="small muted">hello@bonappefind.example is a placeholder address. Replace it before public launch.</p></div></aside></div>
<ConfirmDialog v-if="guard.pending.value" title="Leave without sending?" text="Your message has not been sent. If you leave now, what you typed will be lost." confirm-label="Leave page" cancel-label="Keep writing" @cancel="guard.stay" @confirm="guard.leave"/>
</div>
</template>
<style scoped>.contact-photo{width:100%;aspect-ratio:16/9;object-fit:cover}.contact-aside{align-self:start}.msg-row{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.msg-row .field-msg{flex:1}.msg-row .char-count{margin-left:auto}.char-count.near{color:var(--bow);font-weight:700}.honeypot{position:absolute;left:-10000px}</style>
