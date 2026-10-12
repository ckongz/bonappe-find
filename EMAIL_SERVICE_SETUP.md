# BonAppé Find — email codes, permissions and restaurant suggestions

The current visual theme, stylesheet palette, local photos, fonts, restaurant seed data and existing browsing features are retained. New controls use the existing cards, fields, buttons and dashboard styles.

## Run the project

Extract the ZIP and open the `bonappe-find` folder containing `package.json`.

```sh
npm install
npm run demo
```

Open http://127.0.0.1:5173. The first demo run downloads MongoDB and needs internet. The login page shows the three sample accounts. **Demo records survive page refreshes but are erased when the demo process stops.** Approvals are real server checks against this temporary database. Without SMTP, verification is simulated: no email is sent, and the generated code is shown in a popup after registration, resending, or correcting the email, and is also printed in the backend terminal. There is no browser-only authentication/approval substitute. A static frontend must connect to the API; it cannot verify emails or approve accounts on its own.

For lasting records, use your existing MongoDB/Atlas database:

1. Run `npm install`.
2. Copy `server/.env.example` to `server/.env`. On Windows Command Prompt: `copy server\.env.example server\.env`.
3. Set `MONGODB_URI` to your existing connection string, including your database name. This project uses `MONGODB_URI`, not `MONGO_URI`.
4. Set `JWT_SECRET` to a random secret of at least 32 characters. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
5. Keep `REQUIRE_AUTH_FOR_WRITES=true`. All restaurant permissions are enforced even if the legacy flag is false.
6. Set `CLIENT_ORIGIN` and `APP_URL` to the frontend origin, normally `http://localhost:5173` for development. Use `http://127.0.0.1:5173` for the quick demo.
7. Run `npm run seed` only when you want the supplied example records. It preserves existing records. Do not reset your production database.
8. Create the initial administrator with `npm run create:admin --workspace server` if necessary; follow the terminal prompts.
9. Run `npm run dev`. Changes, approvals, favorites, suggestions and notifications are stored in MongoDB and remain after refreshing or restarting the application.

Keep `.env` private. Never deploy demo credentials or use the temporary demo database for lasting records.

## Configure actual email delivery

Use the SMTP host, port and credentials supplied by your email service. Add them to `server/.env`:

```dotenv
SMTP_HOST=your-provider-smtp-host
SMTP_PORT=587
SMTP_USER=your-provider-smtp-username
SMTP_PASS=your-provider-smtp-password
MAIL_FROM=BonAppe Find <verified-sender@your-domain.example>
```

Replace every placeholder. The sender/domain must be authorized by your provider. Port 465 uses implicit TLS; port 587 uses SMTP with STARTTLS when supported. Configure your provider's sender/domain verification and DNS requirements. Restart the backend after changing `.env`.

Register a test account you control, check its inbox/spam folder, then enter the six-digit code on `/verify-email`. The API reports delivery only after the SMTP service accepts the message; inbox arrival can still be delayed or filtered. Provider errors are surfaced rather than reported as success. Without SMTP in development, the response explicitly says no email was sent and the code prints in the server terminal. Production requires SMTP for email operations and does not fall back to simulated email. If registration saved the account but email delivery failed, log in and use Resend code after fixing SMTP.

Password reset retains its separate email-link flow. Verification links have been removed; old email verification links no longer verify accounts. Existing unverified accounts should log in and request a new code. Existing verified accounts remain verified.

## Verification behavior

After registration, the notification and persistent banner read: “Verify your email. Tap here to verify your email address.” They open the code page.

- Six random digits, bound to the authenticated account, stored as a hash; never returned in API user data.
- Codes expire after 10 minutes, are single-use, and allow at most five incorrect attempts.
- Resending has a server-enforced 60-second cooldown and replaces the old code. The page displays a countdown that survives refresh through the saved send time.
- The verification page displays the requested instructions, loading text and role-specific success message.
- Email correction requires the current password and a valid unused email address; it invalidates the old code and requests a new code. The same cooldown applies.
- Only a successful server verification changes `emailVerified`. Concurrent attempts cannot consume a valid code twice.
- Unverified accounts can log in and save favorites. Reviews and suggestions require verification.

## Account permissions

| Account | Permissions |
| --- | --- |
| Visitor | Browse/search. Favorites, reviews and suggestions prompt login/registration. No Add Restaurant or management controls. |
| Regular user (`customer`) | Favorites while unverified; reviews and restaurant suggestions after verification. No restaurant create/edit/delete access. |
| Pending/rejected owner | Dashboard shows application status and explanation/rejection reason. Listing management is unavailable. |
| Verified, approved owner | Add listings and manage only their own listings, including editing, deleting, status changes, gallery photos and review replies. New owner listings await administrator publication approval. |
| Administrator | Create/manage all listings; approve listings, review owner applications, edit/approve/reject restaurant suggestions. |

The existing moderator role retains community moderation features, but cannot create/edit/delete/publish restaurant listings or decide owner applications. Management routes check current database state on every request; an old login token cannot bypass revoked approval. Claim approval connects a particular restaurant to an owner and does not separately approve their owner application.

Administrators use **Admin → Owners** to review business information, verify the email status, approve an application, or enter a reason and reject it. Email verification and owner approval are independent. Approving an unverified owner does not unlock management until their email is verified. Approval creates the requested in-app notification. Owner dashboards refresh account status on load.

## Restaurant suggestions

Regular users choose **Suggest a Restaurant**. Required fields are restaurant name, cuisine, address, contact details, opening hours and description. Website and photo are optional. A photo can be supplied as a URL or uploaded as JPEG, PNG or WebP (maximum 5 MB). Photo signatures and URLs are checked on the server.

Possible duplicate names are flagged for administrator review; repeating the same pending name/address from the same account is blocked. Submission uses the requested confirmation message. Users track decisions through **Account → Your restaurant suggestions**.

Administrators open **Review restaurant suggestions** in the admin dashboard. They can edit the submitted details before publishing or reject with a required reason. The submitter receives an in-app result notification. Approval creates a public restaurant listing without assigning ownership or editing rights to the submitter. The publication identifier is deterministic and decision updates are protected against concurrent/repeated approvals. Interrupted decisions can be retried after a 60-second review lease.

Optional website/photo links must use HTTP(S). Stored upload links also work. Uploaded photos are public assets; only authorized, verified users can upload them. Suggestion photos uploaded without subsequently submitting a form can remain as unreferenced files; routine upload housekeeping is not automated.

## API and database changes

- `POST /api/auth/verify-email` with `{ "code": "123456" }` and a Bearer session token.
- `POST /api/auth/resend-verification`; `POST /api/auth/correct-email` with email/password.
- `POST /api/restaurant-suggestions`; `POST /api/restaurant-suggestions/photo` (multipart `image`).
- `GET /api/me/restaurant-suggestions`; admin list at `/api/admin/restaurant-suggestions`.
- `PATCH /api/admin/restaurant-suggestions/:id` with status, optional edited `details`, and required reason for rejection.
- `PATCH /api/admin/owners/:id` with status and reason for rejection.

User fields add code expiry, send time, attempt count and owner rejection reason. Restaurant suggestions use a separate collection with submitter, details, duplicate warning, decision, review metadata and published listing reference. Mongoose adds these fields without a destructive migration. No connection secrets are included in the ZIP. Swagger documentation is available at `/api/docs`.

## Checks

```sh
npm test
npm run build
```

Automated tests cover visitor/customer restrictions, disabled legacy bypass, code expiry/account binding/reuse/attempt limits, resend cooldown, email correction, secret redaction, registration role injection, unverified favorites/reviews, owner application decisions/notifications, own-listing restrictions and revoked approval, suggestion validation/duplicates/approval/rejection/no ownership, photo authorization/content validation, database reconnect persistence, existing browsing/CRUD/content features, and SMTP transport success/failure/simulation. Tests use isolated temporary MongoDB databases and a local SMTP test server; they never email other people.

See `docs/verification-results.md` for the final checks and UI results. Real provider delivery still needs testing with your configured SMTP account.


Password recovery uses a separate six-digit reset code instead of a link. Enter your registered email, enter the code, and set and confirm a new password. Reset codes expire after 10 minutes, allow five incorrect attempts, and can be requested once per minute. Successful resets invalidate prior login sessions. Simulated reset codes appear in a popup and the terminal; real delivery sends the code only by email.
