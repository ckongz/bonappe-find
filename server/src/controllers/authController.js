import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User,LoginHistory,Review,Favorite,Collection,Notification,SearchHistory,Claim} from '../models/index.js';
import {env} from '../config/env.js';
import {ok,check,clean,safeUser} from '../utils/http.js';
import {sendMail} from '../utils/mail.js';
import ApiError from '../utils/ApiError.js';
import {audit,notifyStaff} from '../utils/audit.js';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const passValid=p=>typeof p==='string'&&p.length>=8&&p.length<=128&&/[A-Za-z]/.test(p)&&/\d/.test(p);
const token=u=>jwt.sign({sub:String(u._id),ver:u.tokenVersion},env.secret,{expiresIn:env.expires});
export async function register(req,res){const e=[];if(!req.body.name?.trim())e.push({field:'name',message:'Please enter your name.'});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email||''))e.push({field:'email',message:'Please enter a valid email address.'});if(!passValid(req.body.password))e.push({field:'password',message:'Password must be at least 8 characters with a letter and a number.'});if(req.body.confirmPassword!==req.body.password)e.push({field:'confirmPassword',message:'Passwords do not match.'});check(e);const email=req.body.email.trim().toLowerCase();if(await User.exists({email}))throw new ApiError(409,'This email is already registered.');const owner=req.path.includes('owners');if(owner&&(!req.body.businessName?.trim()||!req.body.phone?.trim()||!req.body.position?.trim()))throw new ApiError(422,'Please enter your business name, phone and position.');const u=await User.create({name:clean(req.body.name).slice(0,120),email,passwordHash:await bcrypt.hash(req.body.password,12),role:owner?'owner':'customer',ownerProfile:owner?{businessName:clean(req.body.businessName),phone:clean(req.body.phone),position:clean(req.body.position),verificationStatus:'pending'}:undefined});let delivery;try{delivery=await issueCode(u);}catch(error){console.error('Verification email could not be sent:',error.code||error.name);delivery={delivered:false,deliveryFailed:true,cooldown:0,message:'Your account was created, but the verification email could not be sent. You can log in and request another code from Verify Email.'};}await Notification.create({user:u._id,title:'Verify your email',message:'Verify your email. Tap here to verify your email address.',link:'/verify-email'});if(owner)await notifyStaff('New owner account',u.name,'/admin/owners');ok(res,{user:safeUser(u),token:token(u),message:delivery.message,delivery},{},201);}
export async function login(req,res){const email=String(req.body.email||'').trim().toLowerCase();const u=await User.findOne({email}).select('+passwordHash');const history={email,user:u?._id,ip:req.ip,userAgent:req.get('user-agent')?.slice(0,300)};if(u?.lockUntil>Date.now())throw new ApiError(429,'Account locked. Please try again in 15 minutes.');if(!u||!await bcrypt.compare(String(req.body.password||''),u.passwordHash)){if(u){u.failedLoginCount++;if(u.failedLoginCount>=5){u.lockUntil=new Date(Date.now()+15*60000);u.failedLoginCount=0;}await u.save();}await LoginHistory.create({...history,success:false});throw new ApiError(401,'Email or password is incorrect.');}if(u.status!=='active')throw new ApiError(403,'This account is suspended.');u.failedLoginCount=0;u.lockUntil=undefined;u.lastLoginAt=new Date();await u.save();await LoginHistory.create({...history,success:true});ok(res,{user:safeUser(u),token:token(u)});}
export async function logout(req,res){await User.updateOne({_id:req.user._id},{$inc:{tokenVersion:1}});ok(res,{message:'You have been logged out.'});}
export async function me(req,res){ok(res,safeUser(req.user));}
// Each code is bound to its account; conditional updates make consumption atomic.
export async function issueCode(u){
 const code=String(crypto.randomInt(100000,1000000));
 const result=await sendMail(u.email,'Your BonAppé Find verification code',`Your verification code is ${code}. It expires in 10 minutes. Do not share it.`);
 const sentAt=new Date();await User.updateOne({_id:u._id},{verifyHash:hash(String(u._id)+':'+code),verifyUntil:new Date(Date.now()+600000),verifySentAt:sentAt,verifyAttempts:0});u.verifySentAt=sentAt;
 return {delivered:result.delivered,...(!result.delivered&&(env.nodeEnv!=='production'||process.env.IN_APP_CODES==='true'||process.env.DEMO_MODE==='true')?{developmentCode:code}:{}),cooldown:60,message:result.delivered?'Verification code sent to your email.':'In-app verification: your code is displayed in the application popup (no email sent).'};
}
export async function verify(req,res){
 if(req.user.emailVerified)throw new ApiError(409,'This email is already verified.');
 const u=await User.findById(req.user._id).select('+verifyHash +verifyUntil +verifyAttempts');
 if(!u.verifyHash||!u.verifyUntil||u.verifyUntil<=new Date())throw new ApiError(400,'This code has expired or was already used. Please resend a code.');
 if(u.verifyAttempts>=5)throw new ApiError(429,'Too many incorrect attempts. Please resend a code.');
 const code=String(req.body.code||'');
 if(!/^\d{6}$/.test(code)||hash(String(u._id)+':'+code)!==u.verifyHash){await User.updateOne({_id:u._id,verifyHash:u.verifyHash,verifyAttempts:{$lt:5}},{$inc:{verifyAttempts:1}});throw new ApiError(400,'Incorrect verification code. Check the six digits shown in the app.');}
 const verified=await User.findOneAndUpdate({_id:u._id,email:u.email,emailVerified:false,verifyHash:u.verifyHash,verifyUntil:{$gt:new Date()},verifyAttempts:{$lt:5}},{$set:{emailVerified:true},$unset:{verifyHash:1,verifyUntil:1,verifyAttempts:1}},{new:true});
 if(!verified)throw new ApiError(400,'This code is expired, already used, or has too many attempts.');
 ok(res,{user:safeUser(verified),message:verified.role==='owner'?'Email verified. Your owner account is awaiting administrator approval. You can manage restaurant listings once approved.':'Email verified. You can now post reviews and suggest restaurants.'});
}
export async function resend(req,res){
 if(req.user.emailVerified)throw new ApiError(409,'This email is already verified.');
 const reserved=await User.findOneAndUpdate({_id:req.user._id,$or:[{verifySentAt:{$lte:new Date(Date.now()-60000)}},{verifySentAt:null}]},{$set:{verifySentAt:new Date()}},{new:true});
 if(!reserved)throw new ApiError(429,'Please wait 60 seconds before requesting another code.');
 try{ok(res,await issueCode(reserved));}catch(e){await User.updateOne({_id:reserved._id},{$unset:{verifySentAt:1}});throw e;}
}
export async function correctEmail(req,res){
 if(req.user.emailVerified)throw new ApiError(409,'Your email is already verified.');
 const email=String(req.body.email||'').trim().toLowerCase();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new ApiError(422,'Enter a valid email address.');
 const u=await User.findById(req.user._id).select('+passwordHash');
 if(!await bcrypt.compare(String(req.body.password||''),u.passwordHash))throw new ApiError(403,'Enter your current password to correct your email.');
 if(await User.exists({email,_id:{$ne:u._id}}))throw new ApiError(409,'This email is already registered.');
 if(u.verifySentAt&&Date.now()-u.verifySentAt.getTime()<60000)throw new ApiError(429,'Please wait 60 seconds before changing the email and requesting a code.');
 u.email=email;u.verifyHash=undefined;u.verifyUntil=undefined;await u.save();const delivery=await issueCode(u);ok(res,{user:safeUser(u),...delivery});
}
export async function forgot(req,res){
 const email=String(req.body.email||'').trim().toLowerCase();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new ApiError(422,'Enter a valid email address.');
 const response={message:'If an account exists, a six-digit reset code has been sent. Codes expire in 10 minutes.',cooldown:60};
 const u=await User.findOneAndUpdate({email,$or:[{resetSentAt:{$lte:new Date(Date.now()-60000)}},{resetSentAt:null}]},{$set:{resetSentAt:new Date()}},{new:true});
 if(u){
  const code=String(crypto.randomInt(100000,1000000));
  try{
   const delivery=await sendMail(email,'Your BonAppé Find password reset code',`Your password reset code is ${code}. It expires in 10 minutes. Do not share it.`);
   await User.updateOne({_id:u._id},{resetHash:hash(String(u._id)+':reset:'+code),resetUntil:new Date(Date.now()+600000),resetAttempts:0});
   if(!delivery.delivered&&(env.nodeEnv!=='production'||process.env.IN_APP_CODES==='true'||process.env.DEMO_MODE==='true')){response.developmentCode=code;response.message='Email delivery is simulated. Your reset code is shown in the popup and server terminal.';}
  }catch(e){await User.updateOne({_id:u._id},{$unset:{resetSentAt:1}});throw e;}
 }
 ok(res,response);
}
export async function reset(req,res){
 if(!passValid(req.body.password))throw new ApiError(422,'Password must be at least 8 characters with a letter and a number.');
 if(req.body.password!==req.body.confirmPassword)throw new ApiError(422,'Passwords do not match.');
 const email=String(req.body.email||'').trim().toLowerCase(),code=String(req.body.code||'');
 const u=await User.findOne({email}).select('+resetHash +resetUntil +resetAttempts');
 const invalid='Invalid or expired reset code. Request a new code and try again.';
 if(!u||!u.resetHash||!u.resetUntil||u.resetUntil<=new Date())throw new ApiError(400,invalid);
 if(u.resetAttempts>=5)throw new ApiError(429,'Too many incorrect attempts. Request a new reset code.');
 if(!/^\d{6}$/.test(code)||hash(String(u._id)+':reset:'+code)!==u.resetHash){await User.updateOne({_id:u._id,resetHash:u.resetHash,resetAttempts:{$lt:5}},{$inc:{resetAttempts:1}});throw new ApiError(400,invalid);}
 const updated=await User.findOneAndUpdate({_id:u._id,email,resetHash:u.resetHash,resetUntil:{$gt:new Date()},resetAttempts:{$lt:5}},{$set:{passwordHash:await bcrypt.hash(req.body.password,12),failedLoginCount:0},$inc:{tokenVersion:1},$unset:{resetHash:1,resetUntil:1,resetAttempts:1,lockUntil:1}},{new:true});
 if(!updated)throw new ApiError(400,invalid);
 ok(res,{message:'Password updated. Please log in with your new password.'});
}
export async function profile(req,res){for(const k of ['name','avatar'])if(typeof req.body[k]==='string')req.user[k]=clean(req.body[k]).slice(0,300);if(req.body.preferences)for(const k of ['emailAlerts','language','theme'])if(req.body.preferences[k]!=null)req.user.set('preferences.'+k,req.body.preferences[k]);await req.user.save();ok(res,safeUser(req.user));}
export async function download(req,res){const user=req.user._id;const [reviews,favorites,collections,searchHistory]=await Promise.all([Review.find({user}),Favorite.find({user}),Collection.find({user}),SearchHistory.find({user})]);ok(res,{user:safeUser(req.user),reviews,favorites,collections,searchHistory});}
export async function deleteAccount(req,res){if(req.user.role==='admin')throw new ApiError(403,'Ask another administrator to remove an admin account.');const user=req.user._id;await Promise.all([Favorite.deleteMany({user}),Collection.deleteMany({user}),Notification.deleteMany({user}),SearchHistory.deleteMany({user}),Claim.deleteMany({user,status:'pending'})]);await Review.updateMany({user},{author:'Deleted user',comment:'[Removed by author]',status:'hidden'});await User.deleteOne({_id:user});await audit(req,'delete-account','user',user,null,null);ok(res,{message:'Account deleted.'});}
