import restaurantPhotos from './restaurant-photos.js';
const photosById=new Map(restaurantPhotos.map(p=>[p.id,p.image]));
const photosByName=new Map(restaurantPhotos.map(p=>[p.name,p.image]));
const cuisinePhotos=[["south indian", "BF-012"], ["northern thai", "BF-013"], ["thai street", "BF-014"], ["japanese curry", "BF-EXP-016"], ["japanese grill", "BF-EXP-014"], ["italian grill", "BF-EXP-024"], ["mexican grill", "BF-EXP-030"], ["french grill", "BF-EXP-040"], ["indian grill", "BF-EXP-044"], ["thai grill", "BF-EXP-052"], ["filipino fusion", "BF-EXP-002"], ["french fusion", "BF-EXP-039"], ["filipino", "BF-001"], ["korean", "BF-EXP-003"], ["chinese", "BF-EXP-004"], ["mediterranean", "BF-EXP-005"], ["seafood", "BF-EXP-064"], ["ramen", "BF-004"], ["noodle", "BF-EXP-009"], ["sushi", "BF-003"], ["japanese", "BF-EXP-011"], ["pizza", "BF-006"], ["italian", "BF-005"], ["pasta", "BF-EXP-021"], ["taco", "BF-008"], ["mexican", "BF-007"], ["bagel", "BF-015"], ["bakery", "BF-EXP-034"], ["cafe", "BF-EXP-007"], ["caf\u00e9", "BF-EXP-007"], ["coffee", "BF-EXP-020"], ["french", "BF-009"], ["indian", "BF-EXP-041"], ["curry", "BF-EXP-054"], ["thai", "BF-EXP-051"], ["burger", "BF-EXP-057"], ["barbecue", "BF-EXP-062"], ["american", "BF-EXP-060"], ["grill", "BF-EXP-052"], ["fusion", "BF-EXP-019"]];
export function dishImage(cuisine=''){
  const c=String(cuisine).toLowerCase();
  const hit=cuisinePhotos.find(([keyword])=>c.includes(keyword));
  return photosById.get(hit?.[1])||'/images/photos/table.jpg';
}
// Picks the best bundled or uploaded picture for a restaurant record.
export function restaurantImage(r,resolve=x=>x){
  const u=r?.profile?.imageUrl;
  const matched=photosById.get(r?.restaurant_id)||photosByName.get(r?.name);
  if(matched&&(!u||u.startsWith('/images/photos/')))return matched;
  if(u&&(u.startsWith('/uploads/')||u.startsWith('/images/photos/')||u.startsWith('/images/restaurants/')||/^https?:/.test(u)))return resolve(u);
  const id=String(r?.restaurant_id||'').toLowerCase();
  if(/^bf-0\d\d$/.test(id))return dishImage(r.cuisine);
  if(r?.cuisine)return dishImage(r.cuisine);
  return '/images/photos/dining.jpg';
}
export function flag(iso=''){return [...iso.toUpperCase()].map(x=>String.fromCodePoint(x.charCodeAt(0)+127397)).join('');}
export function initials(name=''){return name.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();}

export function countryImage(slug){const map={"japan": "BF-003", "italy": "BF-005", "mexico": "BF-008", "india": "BF-012", "thailand": "BF-013", "france": "BF-010", "philippines": "BF-001", "united-states": "BF-EXP-057"};return photosById.get(map[slug])||'/images/photos/table.jpg';}
