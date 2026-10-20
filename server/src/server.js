import {app} from './app.js';
import {env,checkEnv} from './config/env.js';
import {connectDB} from './config/db.js';
import mongoose from 'mongoose';
try{checkEnv();await connectDB();const server=app.listen(env.port,()=>console.log(`BonAppé Find API running at http://localhost:${env.port}/api`));for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(async()=>{await mongoose.disconnect();process.exit(0);}));}catch(e){console.error(e.message);process.exit(1);}
