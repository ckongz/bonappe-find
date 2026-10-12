import {ActivityLog,Notification,User} from '../models/index.js';
export const audit=(req,action,type,entityId,before,after)=>ActivityLog.create({actor:req.user?._id,role:req.user?.role||'visitor',action,entityType:type,entityId:String(entityId),before,after,ip:req.ip});
export const notify=(user,title,message,link='/account')=>Notification.create({user,type:'update',title,message,link});
export async function notifyStaff(title,message,link='/admin'){const users=await User.find({role:{$in:['admin','moderator']},status:'active'});await Promise.all(users.map(u=>notify(u._id,title,message,link)));}
