// Turns ?page= and ?limit= into safe skip/limit numbers (limit capped at 100).
export function paginate(query={},defaultLimit=20){
  const limit=Math.min(100,Math.max(1,parseInt(query.limit,10)||defaultLimit));
  const page=Math.max(1,parseInt(query.page,10)||1);
  return{page,limit,skip:(page-1)*limit};
}
