import bcrypt from 'bcryptjs';
import {User} from '../models/index.js';

// Optional, one-time administrator provisioning. Never updates existing accounts.
export async function ensureInitialAdmin(config=process.env){
 const email=String(config.ADMIN_EMAIL||'').trim().toLowerCase();
 if(!email)return {created:false,reason:'not-configured'};
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('ADMIN_EMAIL must be a valid email address.');
 const existing=await User.findOne({email});
 if(existing){
  if(existing.role!=='admin')throw new Error('ADMIN_EMAIL belongs to a non-admin account. Choose another email; automatic setup does not change existing roles.');
  console.log('Initial administrator already exists; password and account unchanged.');
  return {created:false,reason:'exists'};
 }
 const name=String(config.ADMIN_NAME||'').trim(),password=String(config.ADMIN_INITIAL_PASSWORD||'');
 if(!name||password.length<8||!/[A-Za-z]/.test(password)||!/[0-9]/.test(password))throw new Error('New administrator requires ADMIN_NAME and ADMIN_INITIAL_PASSWORD with 8+ characters, a letter and a number.');
 await User.init();
 try{
  await User.create({email,name,passwordHash:await bcrypt.hash(password,12),role:'admin',emailVerified:true});
 }catch(error){
  if(error.code!==11000)throw error;
  const raced=await User.findOne({email});
  if(raced?.role!=='admin')throw new Error('ADMIN_EMAIL is already taken by a non-admin account.');
  return {created:false,reason:'exists'};
 }
 console.log('Initial administrator created successfully.');
 return {created:true};
}
