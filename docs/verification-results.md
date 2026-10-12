# Verification results — updated BonAppé Find

Checked 10 October 2026.

| Check | Result |
| --- | --- |
| Automated server tests (`npm test`) | 27 passed, 0 failed |
| Rendered UI visibility (`npm run test:permissions -w client`) | 35 assertions passed |
| Vue production build (`npm run build`) | Passed |
| Original palette styles, photos, fonts and design assets | 35 files compared byte-for-byte; unchanged |
| Local demo startup | Started successfully, seeded existing records and sample accounts |
| Browser screenshot/interaction checks | Not completed: available browser binaries were missing and the browser download failed |
| Real SMTP provider / inbox | Requires the user's configured SMTP service; local SMTP transport test passed |

The server suite exercises direct unauthorized API calls, including the former development authentication bypass; unverified login/favorites and blocked reviews; code expiry, incorrect attempts, maximum attempts, account binding and concurrent single-use consumption; resend cooldown; email correction; verification data redaction; independent owner approval/rejection with notifications; revoked approval and other-owner edit/delete denial; suggestion validation/duplicate flags, admin edits/publication/rejection, notifications, no submitter ownership; photo authorization/signature validation; and status/public-listing persistence after a database disconnect/reconnect. Existing restaurant browsing, filters, CRUD validation, claims, content endpoints, audit logs and token revocation are also covered.

The UI checks render the actual header, footer and dashboard shell for visitors, regular users, pending owners, rejected owners, approved-but-unverified owners, verified approved owners and administrators. They check the Add Restaurant link and the separate Suggest a Restaurant link. Production compilation covers the new code-entry and suggestion forms. These checks do not prove full browser interactions, mobile layout or accessibility; use the manual test plan for those.

SMTP transport tests use a local SMTP server to confirm submission succeeds before returning delivery success, transport errors reject, and missing SMTP in development returns explicit simulated/no-email wording. They do not prove arrival in a real inbox.

No user's Atlas connection, email credentials or production service was accessed. Tests use isolated databases. The quick demo intentionally deletes records on shutdown; lasting persistence requires the normal configured MongoDB startup.
