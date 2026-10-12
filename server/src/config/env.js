import dotenv from 'dotenv';
import {fileURLToPath} from 'node:url';
dotenv.config({path:fileURLToPath(new URL('../../.env',import.meta.url)),quiet:true});
export const env={port:Number(process.env.PORT||5000),nodeEnv:process.env.NODE_ENV||'development',uri:process.env.MONGODB_URI,origin:process.env.CLIENT_ORIGIN||'http://localhost:5173',secret:process.env.JWT_SECRET,expires:process.env.JWT_EXPIRES_IN||'7d',min:Number(process.env.TOP_QUALITY_MIN||90),requireAuth:process.env.REQUIRE_AUTH_FOR_WRITES!=='false',appUrl:process.env.APP_URL||'http://localhost:5173'};
export function checkEnv(){if(!env.uri)throw new Error('MONGODB_URI is missing. Copy server/.env.example to server/.env.');if(!env.secret||env.secret.length<32||env.secret.startsWith('replace-'))throw new Error('Set JWT_SECRET to a random string with at least 32 characters.');if(env.nodeEnv==='production'&&!env.requireAuth)throw new Error('REQUIRE_AUTH_FOR_WRITES must be true in production.');}
