# Corrected package

- Fixed Vite API and upload proxy to port 5000.
- Allowed both local development origins.
- Registration returns a usable account if SMTP delivery fails; resend remains available.
- Removed unavailable social login controls.
- Local demo now saves changes in .local-demo-db and seeds only on first launch.
- Excluded machine-specific node_modules, private environment files, test databases and uploads.

Validation: production build; 31 backend tests; 35 permission visibility assertions; frontend proxy and account persistence across restart.

Extract to a fresh folder, run npm ci, then npm run demo. Open http://127.0.0.1:5173. First run needs internet for MongoDB. Read START_HERE.md for real MongoDB setup.

## Favicon update
Your supplied B logo is included as favicon.png, a multi-size favicon.ico, and apple-touch-icon.png. Updated icon URLs use v=2 to refresh cached icons.
Validation: 31 backend tests, 35 permission checks, production build, 20 page/icon HTTP checks, and 3 role login/dashboard API checks passed. Full visual browser testing could not run because the browser download failed in this environment.

## Admin dashboard layout fix
Widened dashboard workspace; restaurant rows switch to labeled cards when the center panel is narrower than 850px. Removed the table minimum-width overflow and kept edit/delete/approval/status controls wrapping within each row. Changes also apply to the owner restaurant dashboard. Validation: Vue production build and existing UI permission assertions.
