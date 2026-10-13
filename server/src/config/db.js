import mongoose from 'mongoose';
import {env} from './env.js';

export async function connectDB() {
  await mongoose.connect(env.uri, {
    dbName: 'dbRestaurants',
    serverSelectionTimeoutMS: 15000
  });

  console.log('MongoDB connected!');
  console.log('Connected host:', mongoose.connection.host);
  console.log('Connected database:', mongoose.connection.name);
}