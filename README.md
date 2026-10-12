See **EMAIL_SERVICE_SETUP.md** for the updated verification, permissions, suggestions and setup instructions.

# BonAppé Find

Great dining starts with a great find.

This package implements the BonAppé Find v1.3 blueprint as a Vue 3 application with a Node.js/Express API and MongoDB. It includes public discovery pages, country guides, full restaurant CRUD, aggregate ranking, owner claims, reviews, account tools and admin management. The original blueprint is in `docs/`.

**Start with `START_HERE.md`.** See `docs/design-update.md` and `docs/design-testing.md` for this design update and its testing results. Do not open `client/index.html` by double-clicking it: the application needs a development server and the API.

## Requirements

Node.js 20.19+ or 22.12+, npm, and either MongoDB Atlas or a local MongoDB service. Node 24 was used for the bundled checks. Internet is needed for first-time package installation. A temporary MongoDB demo is available without an Atlas account.

## Quick demo without Atlas

From the extracted `bonappe-find` folder:

```sh
npm install
npm run demo
```

Open http://localhost:5173. Use `reviewer@example.test` and `ReviewOnly123` to review the **temporary demo** admin account. Also available in the demo: `owner@example.test` and `customer@example.test`, using the same `ReviewOnly123` password. These accounts exist only in demo mode, not in your Atlas database. Changes are erased when you stop the demo. The first demo/test launch downloads a MongoDB binary. Demo credentials are deliberately public and must never be used for deployment.

## Connect your actual database

1. Run `npm install` at the project root (once for both workspaces).
2. Copy `server/.env.example` to `server/.env`; copy `client/.env.example` to `client/.env`.
3. Put your MongoDB URI in `MONGODB_URI`, using `/dbRestaurants`. Keep the credentials private. Configure Atlas Network Access for the IP of your computer or deployed API.
4. Generate a secret and paste it into `JWT_SECRET`:

```sh
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

5. Run:

```sh
npm run seed
npm run create:admin --workspace server
npm run dev
```

6. Visit http://localhost:5173 and log in with the admin account you created. Browsing needs no login. Owners and customers can register through the website.

If you have your instructor's original course JSON, import it before or after seeding:

```sh
npm run import:db --workspace server -- "C:\path\to\restaurants.json"
```

The importer accepts a JSON array or one JSON object per line. It preserves original field names and enriches US records. The course dataset was not attached, so it is **not bundled**; the sixteen fictional curated records are included.

## Scripts

| Command | Result |
| --- | --- |
| `npm run dev` | API on 5000 and frontend on 5173; uses your configured MongoDB |
| `npm run demo` | Temporary MongoDB and seeded demo, erased after shutdown |
| `npm run seed` | Inserts missing countries, profiles, articles and FAQs; preserves edits |
| `npm run import:db --workspace server -- <file>` | Imports your course dataset |
| `npm run create:admin --workspace server` | Prompts for the first admin account |
| `npm test` | Unit and API tests against an isolated temporary database |
| `npm run test:unit --workspace server` | Validation, queries and opening-hours tests |
| `npm run build` | Produces `client/dist` |
| `npm start` | API serves the built frontend and `/api` together |
| `npm run reset:demo --workspace server` | Resets only BF-001 through BF-016 in your configured DB; preserves course records |

## Features and permissions

Visitors browse, search, filter, read guides and compare without logging in. Saving favorites requires login; unverified users can save. Verified regular users post reviews and suggest restaurants for administrator approval. Verified, approved owners add pending listings and manage only their own restaurants. Moderators retain community moderation and claim review. Administrators manage all restaurant listings, publication, restoration, owner applications and suggestions, plus users, messages, settings and imports.

`REQUIRE_AUTH_FOR_WRITES=true` is the default. Restaurant writes always require an administrator or a verified, approved owner. The legacy `false` setting no longer permits anonymous writes. The website normally presents management buttons according to the signed-in role.

Restaurant deletion is recoverable soft deletion, matching the v1.3 extended feature list. Trash restoration is an administrator tool. Audit logs retain before/after restaurant records.

## Data and scores

Eight country guides, sixteen fictional restaurant profiles, three food guides and sixteen FAQs were extracted from the supplied DOCX. The Quality Score is a sum of recorded grade scores, with **strictly greater than 90**, sorted descending. Eleven of the original sixteen seed records meet this threshold. Lower scores are better in the raw NYC inspection dataset; this classroom aggregate must not be treated as an official safety or restaurant rating. Review stars are a separate measure.

Food and dining photos are bundled locally under `client/public/images/photos`. Source links and usage license links appear on `/photo-credits` and in `PHOTO_SOURCES.md`. These are illustrative stock photographs, not photographs of the fictional restaurants. The text-only logo uses bundled Allura (SIL Open Font License); readable body text and serif headings retain their existing font stacks. Black Mango is not bundled. Real contact information still needs to be supplied before public launch.

## Email and uploads

Verification codes and password-reset links are printed in the backend terminal in development if SMTP is unset. Configure SMTP for real email delivery; production does not pretend to send email without it. Contact and newsletter forms persist records; a scheduled newsletter campaign and automatic contact acknowledgments are not configured. HTML email mockups are included under `design/mockups`.

Gallery uploads accept JPEG, PNG or WebP up to 5 MB, maximum ten per restaurant. Files are stored under `server/uploads`. Use persistent storage on deployment; an ephemeral host can erase uploads on restart. Map tiles and directions need internet; only real records with coordinates appear on the map.

## Project folders

- `client/`: Vue SPA, router, components, state, API service, CSS, extracted copy and assets.
- `server/`: Express API, Mongoose models, role checks, controllers, validation, import, seed and tests.
- `design/`: CSS tokens, ten SVG social mockups, social captions and three HTML email mockups.
- `docs/`: source blueprint, API docs, status for all 171 feature ideas, manual checks, declaration/evaluation templates and submission checklist.
- `postman/`: API collection and local environment (no real secret).

## What still needs the team

See `docs/implementation-status.md`. The core rubric workflows and main pages are implemented; the blueprint's entire 171-item wish list is **not all complete**. Google OAuth, authenticator 2FA, Atlas typo-tolerant search, near-me distance sorting, PWA/offline support, some advanced analytics and several optional extensions remain documented. No real Figma file, Atlas screenshot, public GitHub upload, student signature or peer score is fabricated. `docs/submission-checklist.md` lists the real evidence you must capture.

## Tests and API documentation

Run `npm test`. Tests create an isolated temporary MongoDB instance and never use your Atlas URI. Interactive API documentation is at http://localhost:5000/api/docs; the JSON contract and a Postman collection are included. See `docs/validation-report.md` for the checks completed for this package and their limits.

## Build and deploy

The simplest deployment serves both layers from Express:

```sh
npm install
npm run build
npm start
```

For a same-origin deployment remove `client/.env` (or set `VITE_API_URL=/api`) **before** building; set `CLIENT_ORIGIN` and `APP_URL` to your actual HTTPS site origin. Configure `MONGODB_URI`, a strong `JWT_SECRET`, `NODE_ENV=production`, and SMTP. `render.yaml` is an editable deployment template, not a deployed service.

For Netlify frontend plus a separately hosted API, configure `VITE_API_URL=https://your-api.example/api`, set `CLIENT_ORIGIN` to the Netlify origin, run `npm run build`, and publish `client/dist`. `_redirects` provides SPA route fallback. The API cannot run on a static-only Netlify deployment.

## Team

Abygale Santos and Ayenne Wage: Figma/UI design. Prince Pangilinan: frontend/backend development. Casey Ong: frontend/backend development, documentation, deliverable finalization, GitHub coordination and group submission. This generated implementation must be reviewed, understood and disclosed according to your course's AI-use rules before submission.

## Sample accounts — for checking

For a disposable local review environment, run:

```bash
npm run demo
```

Then open the Vite URL shown in the terminal and use any of these demo-only accounts:

- Customer: `customer@example.test` / `ReviewOnly123`
- Restaurant owner: `owner@example.test` / `ReviewOnly123`
- Administrator: `reviewer@example.test` / `ReviewOnly123`

The login page also has **Use** and **Log in** buttons for these accounts. Passwords are verified by the temporary Express/MongoDB demo server. The temporary demo database is deleted when that demo server exits. These credentials are not production accounts.


Dashboard updates: admin actions reload the current list and counts. Separate pending and approved owner totals are displayed; pending requests include owner applications, listing approvals, claims, reports, suggested edits, and restaurant suggestions. Owner lists are filtered on the server before pagination. The dashboard refreshes every 15 seconds while active and when returning to the window, and provides a manual Refresh dashboard button. Automatic refresh pauses while editing forms or confirming actions.

Customer and owner updates: account details, preferences, favorites, reviews, collections, notifications, and search history refresh on navigation, window focus, and active 15-second checks. Favorite changes refresh the account counts immediately. Customer suggestion status also refreshes periodically. Unsaved display-name and collection drafts pause background refresh. Owner statistics separate approved, pending, and rejected listings and include unread notifications.
