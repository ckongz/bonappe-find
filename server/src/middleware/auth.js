import jwt from 'jsonwebtoken';
import {User} from '../models/index.js';
import {env} from '../config/env.js';
import ApiError from '../utils/ApiError.js';
export async function optionalAuth(req,res,next){try{if(req.method==='POST'&&['/auth/login','/auth/register','/owners/register','/auth/forgot-password','/auth/reset-password'].includes(req.path))return next();const raw=req.headers.authorization;if(raw?.startsWith('Bearer ')){let token;try{token=jwt.verify(raw.slice(7),env.secret);}catch{throw new ApiError(401,'Your session has ended. Please log in again.');}const u=await User.findById(token.sub);if(!u||u.status!=='active'||u.tokenVersion!==token.ver)throw new ApiError(401,'Your session has ended. Please log in again.');req.user=u;}next();}catch(e){next(e);}}
export function requireUser(req,res,next){if(!req.user)return next(new ApiError(401,'Please log in to continue.'));next();}
export const roles=(...r)=>(req,res,next)=>{if(!req.user)return next(new ApiError(401,'Please log in to continue.'));if(!r.includes(req.user.role))return next(new ApiError(403,'You do not have permission to do that.'));next();};
export const isStaff=u=>['admin','moderator'].includes(u?.role);
export const canManage=u=>u?.role==='admin'||(u?.role==='owner'&&u.emailVerified&&u.ownerProfile?.verificationStatus==='approved');
export function requireManager(req,res,next){if(!req.user)return next(new ApiError(401,'Please log in to continue.'));if(!canManage(req.user))return next(new ApiError(403,'Owners need verified email and administrator approval to manage listings.'));next();}
export function requireVerified(req,res,next){if(!req.user)return next(new ApiError(401,'Please log in to continue.'));if(!req.user.emailVerified)return next(new ApiError(403,'Please verify your email first.'));next();}
export function canEdit(req,r){if(req.user?.role==='admin')return;if(canManage(req.user)&&String(r.ownerId)===String(req.user._id))return;throw new ApiError(403,'You do not have permission to manage this restaurant.');}
