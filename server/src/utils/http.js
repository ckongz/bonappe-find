import mongoose from 'mongoose';
import ApiError from './ApiError.js';
export const ok=(res,data,meta={},status=200)=>res.status(status).json({success:true,data,meta});
export const wrap=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
export const id=value=>{if(!mongoose.isValidObjectId(value))throw new ApiError(400,'Invalid id.');return value;};
export const pagination=q=>{const page=Math.max(1,Number.parseInt(q.page)||1),limit=Math.min(100,Math.max(1,Number.parseInt(q.limit)||20));return{page,limit,skip:(page-1)*limit};};
export const clean=s=>typeof s==='string'?s.replace(/[<>\u0000]/g,'').trim():s;
export function safeUser(user){const{passwordHash,resetHash,verifyHash,verifyUntil,verifyAttempts,resetUntil,__v,...data}=user.toObject?user.toObject():user;const rawId=String(data._id||'');return{...data,account_id:data.account_id||('ACC-'+rawId.toUpperCase())};}
export function check(errors){if(errors.length)throw new ApiError(422,'Please check the highlighted fields.',errors);}
