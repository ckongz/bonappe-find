# BonAppé Find project documentation

Sophia Casey M. Ong · Abygale Santos · Ayenne Wage · Prince Pangilinan

Course: 6ADDBASE / 6WCSERVER. Instructor: ____________________. Date: ____________________.

## Purpose and scope

BonAppé Find reads and manages restaurant data in MongoDB while helping visitors understand food culture. Public visitors need no account. The implemented system includes CRUD, name/cuisine/dish search, grouped region filters, aggregate ranking, country guides, profiles, reviews, saved lists, comparison and role-protected dashboards.

## Architecture

The Vue 3 single-page frontend calls an Express REST API under /api. Controllers validate input and use Mongoose queries and aggregation against dbRestaurants. The backend serves a built SPA for same-origin deployment; Vite runs separately during development. Pinia manages account, saved-list and notification state. The router guards protected screens; backend role and ownership checks remain authoritative.

## Database design

Original course fields are preserved: restaurant_id, name, borough, cuisine, address and grades. Curated profiles add countrySlug, story, signature dishes and cultural context. Extended collections include users, claims, reports, suggestions, notifications, audit/login history, favorites, collections, session view events and owner messages. All model definitions are in server/src/models/index.js.

## Main database operations

Best Quality uses $unwind on grades, $group with $sum, $match totalScore greater than the threshold and $sort descending. Group-by endpoints use $group to count boroughs, cuisines and countries. Restaurant deletion sets isDeleted and preserves before/after audit records; restore reverses that visibility change. Owner-created restaurants are pending until staff approval.

## Security and validation

Passwords use bcrypt. Signed JWTs carry a user ID and token version; the server checks the current account status and version on each request. Logout invalidates previously issued tokens. Public registration cannot select an admin role. Role/ownership checks restrict edits and moderation. The API validates fields, escapes literal search terms, applies rate limits and security headers, and restricts browser CORS to CLIENT_ORIGIN. Gallery uploads have type and size limits. Secrets belong only in ignored .env files.

## Content and design

The source blueprint supplies eight countries, sixteen fictional curated profiles, three guides and sixteen FAQs. Both palettes are represented in CSS tokens. Georgia provides the licensed-free heading fallback. Bundled food drawings are illustrations rather than photographs. Their editable SVG sources and social/email mockups are included.

## Validation

See validation-report.md for executed checks. Run npm test and npm run build after team edits. Follow manual-test-plan.md for account/owner flows and responsive checks. Capture real Atlas proof after configuring your database.

## Limits and remaining work

The 171-feature status matrix distinguishes implemented paths, partial features and unimplemented optional extensions. SMTP and real database/deployment credentials must be configured. Google OAuth, 2FA, Atlas fuzzy search and PWA support are not implemented. Figma files, GitHub publication, actual course dataset and signed declarations are team-owned deliverables that cannot be inferred from the supplied blueprint.

## Source code and evidence

The complete source files are in this ZIP. source-code-appendix.html is a printable source listing generated from the final source. Add real application/Atlas screenshots to the final school document. Do not substitute temporary demo screenshots for Atlas proof.
