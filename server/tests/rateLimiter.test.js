import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import {loginLimit} from '../src/middleware/rateLimiter.js';
test('successful logins do not exhaust the failed-login budget, failed attempts are limited with a wait time',async()=>{
 const app=express();app.post('/login',loginLimit,(req,res)=>res.status(req.get('x-fail')==='yes'?401:200).json({success:true}));
 for(let i=0;i<30;i++)assert.equal((await request(app).post('/login')).status,200);
 for(let i=0;i<25;i++)assert.equal((await request(app).post('/login').set('x-fail','yes')).status,401);
 const blocked=await request(app).post('/login').set('x-fail','yes');assert.equal(blocked.status,429);assert(blocked.body.retryAfter>0);assert.match(blocked.body.message,/seconds/);assert(blocked.headers['retry-after']);
});
