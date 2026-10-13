import rateLimit from 'express-rate-limit';
const limiter=(max,minutes,options={})=>rateLimit({windowMs:minutes*60000,limit:max,standardHeaders:'draft-7',legacyHeaders:false,...options,handler:(req,res)=>{const seconds=Math.max(1,Math.ceil(((req.rateLimit?.resetTime?.getTime()||Date.now()+minutes*60000)-Date.now())/1000));res.status(429).json({success:false,message:`Too many requests. Please try again in ${seconds} seconds.`,retryAfter:seconds,errors:[]});}});
// Dashboard polling and browsing share this budget; authentication has its own stricter limit.
export const generalLimit=limiter(1200,15),loginLimit=limiter(25,15,{skipSuccessfulRequests:true}),publicLimit=limiter(15,15),reviewLimit=limiter(10,15);
