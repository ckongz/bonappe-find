See **EMAIL_SERVICE_SETUP.md** for email-code setup and the updated permission/approval workflows.

# Run BonAppé Find

Extract the ZIP first, then open the extracted `bonappe-find` folder in VS Code. Run commands from this folder, which contains the root `package.json`. Do not double-click `client/index.html`.

## Quick design review without Atlas

Use Node.js 20.19+ or 22.12+ and npm.

```sh
npm ci
npm run demo
```

Open **http://localhost:5173**. First launch needs internet to download the MongoDB binary. Photos and the cursive logo font are bundled locally. Demo changes are saved in `.local-demo-db` and restored after Ctrl+C and restarting. Extract each new ZIP to a fresh folder. Do not copy old node_modules into it.

Demo logins, all with password `ReviewOnly123`:

- `reviewer@example.test`: administrator
- `owner@example.test`: restaurant owner
- `customer@example.test`: diner

These accounts exist only in the local demo. Use your own accounts and passwords with your real database.

## Run with your MongoDB database

1. Run `npm ci` once.
2. Copy `server/.env.example` to `server/.env` (the client uses the included Vite proxy; no client/.env is required).
3. Set `MONGODB_URI` in `server/.env` to your existing MongoDB connection string. This application uses the database name `dbRestaurants`. The variable for this project is `MONGODB_URI`, not `MONGO_URI`. Keep this file private.
4. Set a random `JWT_SECRET` of at least 32 characters. Generate one with:

```sh
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

5. For a new database, run `npm run seed`. The seed inserts missing examples and preserves existing records; it does not need to run again simply to review the design.
6. If needed, create your first administrator with `npm run create:admin --workspace server`.
7. Run `npm run dev`, then open http://localhost:5173.

If Atlas reports authentication failure, verify the database username/password and connection string. Ensure Atlas Network Access permits your computer. The design update does not change your Atlas account or credentials.

## Production build / checks

```sh
npm test
npm run build
npm start
```

`npm start` uses your configured MongoDB and serves the built frontend on port 5000. Configure `CLIENT_ORIGIN` and `APP_URL` for the origin you actually use. Never deploy the temporary demo credentials.

See `docs/design-update.md`, `docs/design-testing.md`, `PHOTO_SOURCES.md` and the main README for details.
