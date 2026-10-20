import nodemailer from 'nodemailer';
import {env} from '../config/env.js';
export async function sendMail(to,subject,text){if(process.env.SMTP_HOST && process.env.IN_APP_CODES !== 'true' && process.env.DEMO_MODE !== 'true'){const t=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:Number(process.env.SMTP_PORT)===465,auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}:undefined});await t.sendMail({from:process.env.MAIL_FROM,to,subject,text});return {delivered:true};}else if(env.nodeEnv!=='production'){console.log(`[DEV MAIL — SIMULATED, NO EMAIL SENT] To: ${to}\n${subject}\n${text}`);return {delivered:false};}else{throw new Error('SMTP_HOST is required for email delivery in production.');}}
a
import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export async function sendMail(to, subject, message) {
  const inAppCodes =
    process.env.IN_APP_CODES === 'true' ||
    process.env.DEMO_MODE === 'true';

  // Classroom demonstration only: no SMTP delivery.
  if (inAppCodes) {
    console.log(`[IN-APP MODE] Email delivery simulated for ${to}`);
    return { delivered: false };
  }

  if (process.env.SMTP_HOST) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        : undefined
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      text: message
    });

    return { delivered: true };
  }

  if (env.nodeEnv !== 'production') {
    console.log(`[DEV MAIL] To: ${to}\n${subject}\n${message}`);
    return { delivered: false };
  }

  throw new Error('Email delivery is not configured.');
}
