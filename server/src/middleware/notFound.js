import ApiError from '../utils/ApiError.js';
// Friendly JSON 404 for unknown /api routes.
export function notFound(req,res,next){next(new ApiError(404,'API route not found.'));}
