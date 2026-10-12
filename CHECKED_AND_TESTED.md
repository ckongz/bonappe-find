# Verification of this version

The latest project was installed and tested with a real isolated MongoDB database and a Chromium browser. The temporary database was used only for testing.

## Passed checks

- Production Vite build.
- 30 server tests covering authentication, permissions, verification codes, password reset expiry and attempt limits, session revocation, owner decisions, restaurant CRUD and approvals, review rating updates, favorites, suggestions, uploads, sample seed coverage, and filter queries.
- 35 rendered UI permission assertions across the header, footer, and dashboard shell.
- 12 browser checks: restaurant filters; registration code popup; verification code submission; password reset popup and old-session clearing; first login with the new password; immediate saved-list/count updates; preservation of profile drafts during refresh; admin approval reaching the owner dashboard; owner Add Restaurant controls and save; listing approval and updated owner counts; mobile form without horizontal overflow; no JavaScript errors in these flows.

## Additional fixes in this review

Password reset clears the old browser session before the next login. Saved restaurants load from the signed-in account instead of uploading another account's cached list. Logging out clears cached favorites and open code popups. Restaurant review actions refresh the displayed rating and count. The old integration-test expectation was updated from 16 to 80 restaurants; new tests cover reset codes, owner count changes, filter availability, and sample-review seeding. API documentation now describes the code-based reset flow.

## Where to find the code popups

With simulated email delivery (`SMTP_HOST` blank in server configuration):

1. Create an account: a popup shows the six-digit verification code and Go to Verify Email / Close.
2. On Verify Email, Resend code or Correct email address / Save email and request code opens a new popup after the 60-second cooldown.
3. On Forgot Password, enter a registered email and select Send reset code: the password reset popup shows its code and Continue password reset / Close.

With real SMTP configured, codes are sent to the email inbox and are not exposed in the browser. SMTP delivery was tested against a local test server; delivery through your email provider still depends on your SMTP credentials and certificate/network configuration.

## Run this ZIP

Extract to a fresh folder, open its bonappe-find folder, and run `npm install` then `npm run demo`. Both popups work in simulated mode. For your persistent MongoDB database, keep your configuration, run `npm run seed` to add the expanded sample dataset, and run `npm run dev`. Existing edits and accounts are preserved by the seed.

Dashboard updates run after actions, on section changes or window focus, and every 15 seconds while active. Background refresh pauses during form editing or confirmation dialogs so unsaved work is preserved. Conflicting filters and arbitrary search text may still produce no matches; the app does not substitute unrelated results.
