import {Restaurant,Review} from '../models/index.js';
// Only newly inserted fictional expansion records receive a labeled sample review.
export async function seedSampleReviews(rows){
 for(const row of rows){
  if(!row.restaurant_id?.startsWith('BF-EXP-')||!row.sampleReviewRating)continue;
  const restaurant=await Restaurant.findOne({restaurant_id:row.restaurant_id});
  if(!restaurant||await Review.exists({restaurant:restaurant._id}))continue;
  await Review.create({restaurant:restaurant._id,author:'Sample diner (fictional)',title:'Sample review for filter testing',rating:row.sampleReviewRating,comment:'Fictional review for the BonAppé Find class project. This rating is sample data, not a real customer review.',status:'published'});
  await Restaurant.updateOne({_id:restaurant._id},{$set:{avgRating:row.sampleReviewRating,reviewCount:1}});
 }
}
