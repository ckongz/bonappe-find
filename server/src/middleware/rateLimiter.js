import rateLimit from 'express-rate-limit';
const limiter=(max,minutes)=>rateLimit({windowMs:minutes*60000,limit:max,standardHeaders:'draft-7',legacyHeaders:false,message:{success:false,message:'Too many requests. Please wait a moment and try again.',errors:[]}});
export const generalLimit=limiter(400,15),loginLimit=limiter(25,15),publicLimit=limiter(15,15),reviewLimit=limiter(10,15);
