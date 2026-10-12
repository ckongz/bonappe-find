import ApiError from '../utils/ApiError.js';
// validate(fn) runs a validator that returns the cleaned body or throws, and stores it on req.body.
export const validate=fn=>(req,res,next)=>{try{req.body=fn(req.body);next();}catch(e){next(e instanceof ApiError?e:new ApiError(422,e.message));}};
