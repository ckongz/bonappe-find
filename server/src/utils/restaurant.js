import ApiError from './ApiError.js';
export const escapeRegex=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export const publicFilter=()=>({isDeleted:{$ne:true},approvalStatus:'approved'});
export function buildRestaurantQuery(q={}){
 const f=publicFilter();
 for(const key of ['borough','cuisine','country','countrySlug'])if(typeof q[key]==='string'&&q[key])f[key]=q[key];
 if(q.search){const re=new RegExp(escapeRegex(String(q.search).slice(0,120)),'i');const fields=q.field==='name'?['name']:q.field==='cuisine'?['cuisine']:q.field==='dish'?['profile.signatureDishes','menuPreview.name']:['name','cuisine','profile.signatureDishes','menuPreview.name'];f.$or=fields.map(k=>({[k]:re}));}
 if(q.grade)f['grades.grade']=String(q.grade);if(q.price)f.priceLevel=Number(q.price);if(q.minRating)f.avgRating={$gte:Number(q.minRating)};if(q.dietary)f.dietary={$all:String(q.dietary).split(',')};if(q.status)f.status=String(q.status);if(q.open==='now')f.status='open';return f;
}
export const sorting=q=>({name:{name:1},'name-desc':{name:-1},rating:{avgRating:-1,reviewCount:-1},'rating-asc':{avgRating:1},newest:{createdAt:-1},views:{viewCount:-1},saves:{saveCount:-1}}[q.sort]||{name:1});
export function isOpenNow(r,now=new Date()){
 if(r.status!=='open')return false;if(!r.hours?.length)return null;
 let parts;try{parts=new Intl.DateTimeFormat('en-US',{timeZone:r.timezone||'America/New_York',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);}catch{return null;}
 const obj=Object.fromEntries(parts.map(x=>[x.type,x.value]));const day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(obj.weekday),date=`${obj.year}-${obj.month}-${obj.day}`,time=`${obj.hour}:${obj.minute}`;
 const special=r.specialHours?.find(x=>x.date===date);if(special)return !special.closed&&time>=special.open&&time<special.close;
 const slots=r.hours.filter(x=>x.day===day&&!x.closed);if(slots.some(x=>x.close>x.open?time>=x.open&&time<x.close:time>=x.open))return true;
 return r.hours.some(x=>x.day===(day+6)%7&&!x.closed&&x.close<x.open&&time<x.close);
}
export function presentRestaurant(r){if(r?.toObject)r=r.toObject();const p=r.profile||{};return{...r,totalScore:(r.grades||[]).reduce((s,g)=>s+(Number(g.score)||0),0),openNow:isOpenNow(r),profile:{tagline:`A ${r.cuisine} favorite in ${r.borough}.`,story:`${r.name} serves ${r.cuisine} food in ${r.borough}, ${r.country}. A full story for this restaurant has not been written yet. Check its recorded grades and learn about the country before you go.`,signatureDishes:['Ask the staff for the house specialty.'],openingHours:'Please confirm hours with the restaurant.',dressCode:'Come as you are.',reservations:'Call ahead for large groups.',...Object.fromEntries(Object.entries(p).filter(([,v])=>v!==''&&v!=null&&(!Array.isArray(v)||v.length)))}};}
export function topQualityPipeline(filters,min,limit){return[{$match:{...filters,status:'open'}},{$unwind:'$grades'},{$group:{_id:'$_id',name:{$first:'$name'},borough:{$first:'$borough'},cuisine:{$first:'$cuisine'},country:{$first:'$country'},address:{$first:'$address'},totalScore:{$sum:'$grades.score'},gradeCount:{$sum:1}}},{$match:{totalScore:{$gt:min}}},{$sort:{totalScore:-1,name:1}},{$limit:limit}];}
export function groupPipeline(field,filters){return[{$match:filters},{$addFields:{quality:{$sum:'$grades.score'}}},{$group:{_id:`$${field}`,count:{$sum:1},avgQuality:{$avg:'$quality'},views:{$sum:'$viewCount'},saves:{$sum:'$saveCount'}}},{$sort:{count:-1,_id:1}}];}

// Counts for available choices, excluding the dimension being changed.
export function filterAvailability(records,q={},now=new Date()){
 const values={borough:[...new Set(records.map(r=>r.borough))].sort(),country:[...new Set(records.map(r=>r.country))].sort(),cuisine:[...new Set(records.map(r=>r.cuisine))].sort(),price:['1','2','3','4'],dietary:['Halal','Vegan','Vegetarian','Gluten-Free'],minRating:['3','4','5'],grade:['A','B','C','Z'],open:['now']};
 function matches(r,filters){
  for(const key of ['borough','country','cuisine'])if(filters[key]&&r[key]!==filters[key])return false;
  if(filters.countrySlug&&r.countrySlug!==filters.countrySlug)return false;
  if(filters.status&&r.status!==filters.status)return false;
  if(filters.price&&r.priceLevel!==Number(filters.price))return false;
  if(filters.dietary&&!String(filters.dietary).split(',').every(value=>r.dietary?.includes(value)))return false;
  if(filters.minRating&&(r.avgRating||0)<Number(filters.minRating))return false;
  if(filters.grade&&!r.grades?.some(g=>g.grade===filters.grade))return false;
  if(filters.open==='now'&&isOpenNow(r,now)!==true)return false;
  if(filters.search){const needle=String(filters.search).slice(0,120).toLowerCase();const names=[r.name],cuisines=[r.cuisine],dishes=[...(r.profile?.signatureDishes||[]),...(r.menuPreview||[]).map(item=>item.name)];const fields=filters.field==='name'?names:filters.field==='cuisine'?cuisines:filters.field==='dish'?dishes:[...names,...cuisines,...dishes];if(!fields.some(text=>String(text||'').toLowerCase().includes(needle)))return false;}
  return true;
 }
 return Object.fromEntries(Object.entries(values).map(([key,options])=>[key,Object.fromEntries(options.map(value=>[value,records.filter(r=>matches(r,{...q,[key]:value})).length]))]));
}
