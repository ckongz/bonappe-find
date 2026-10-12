import fs from 'node:fs/promises';
import mongoose from 'mongoose';
import {seedSampleReviews} from './sampleReviews.js';
import {Country,Restaurant,Guide,Faq} from '../models/index.js';
import {connectDB} from '../config/db.js';
try{await connectDB();if(process.argv.includes('--reset-demo')){console.log('Resetting BF-001 to BF-016 only; course records and accounts are preserved.');await Restaurant.deleteMany({restaurant_id:/^BF-0(0[1-9]|1[0-6])$/});}
 for(const [name,Model,key]of[['countries',Country,'slug'],['restaurants',Restaurant,'restaurant_id'],['guides',Guide,'slug'],['faqs',Faq,'question']]){const data=JSON.parse(await fs.readFile(new URL(`./data/${name}.json`,import.meta.url),'utf8'));const inserted=[];for(const row of data){const result=await Model.updateOne({[key]:row[key]},{$setOnInsert:row},{upsert:true,runValidators:true});if(result.upsertedCount)inserted.push(row);}if(name==='restaurants')await seedSampleReviews(inserted);console.log(`${data.length} ${name} ready (existing edits preserved).`);}console.log('Seed complete. No accounts or passwords were created.');}catch(e){console.error(e.message);process.exitCode=1;}finally{await mongoose.disconnect();}
