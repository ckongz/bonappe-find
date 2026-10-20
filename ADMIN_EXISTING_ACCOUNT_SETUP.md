# Existing administrator only

No administrator is automatically created when the API starts, and the optional demo launcher no longer seeds a demo administrator. Your existing admin document and password hash are not changed by this code.

1. Copy `server/.env.example` to `server/.env`.
2. Set `MONGODB_URI` to the same MongoDB server/cluster where your admin record exists. Make sure the database name is correct: the backend uses `dbRestaurants` (see `server/src/config/db.js`).
3. Set a private `JWT_SECRET` (32+ characters). Do not share credentials or put admin passwords in source code.
4. Run `npm install` and `npm run dev`.
5. Log in with your existing administrator credentials.

`npm run demo` is a separate isolated demo database, so your existing MongoDB administrator will not be there. Use `npm run dev` for the existing account.

In-app verification remains enabled in development without SMTP.
