import {Restaurant} from '../models/index.js';
import {ok,pagination} from '../utils/http.js';
import {buildRestaurantQuery,topQualityPipeline,groupPipeline} from '../utils/restaurant.js';
import {env} from '../config/env.js';
import ApiError from '../utils/ApiError.js';
export async function topQuality(req,res){const min=req.query.min==null?env.min:Number(req.query.min);if(!Number.isFinite(min)||min<0)throw new ApiError(422,'Please enter a valid minimum score.');const {limit}=pagination(req.query);const data=await Restaurant.aggregate(topQualityPipeline(buildRestaurantQuery(req.query),min,limit));ok(res,data,{min,limit});}
export const group=field=>async(req,res)=>ok(res,await Restaurant.aggregate(groupPipeline(field,buildRestaurantQuery(req.query))));
