# BonAppé Find — In-App Verification (Owner + Customer)

## Quick start (no external MongoDB or SMTP configuration)

1. Install Node.js and open the extracted project folder in VS Code.
2. Run `npm install` (requires internet access).
3. Run `npm run dev`. This now uses the existing local demo database launcher.
4. Open http://127.0.0.1:5173/ and register a customer or owner.
5. The six-digit code appears in the application popup. Choose **Go to Verify Email**, enter the code and submit.
6. The code expires after 10 minutes; resends have a 60-second cooldown.

The first launch may download a MongoDB binary for the demo database (requires internet). Local demo data is kept in `.local-demo-db/`.

## Existing MongoDB connection

If you prefer your own local MongoDB or MongoDB Atlas, copy `server/.env.example` to `server/.env`, set a working `MONGODB_URI` and a strong random `JWT_SECRET`, then run `npm run dev:external-db`. `IN_APP_CODES=true` bypasses SMTP in this local demonstration mode.

## Important

This is **in-app account verification**, not proof of email ownership. Do not use in-app codes to verify email ownership in a real deployed service. Use an email delivery provider in production. Do not commit real `.env` credentials.
