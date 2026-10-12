# API reference

Base path: `/api`. Interactive Swagger UI: `/api/docs`. Authorization: `Bearer <token>`.

Success: `{ "success": true, "data": ..., "meta": ... }`. Error: `{ "success": false, "message": "...", "errors": [] }`.

| Method | Endpoint | Purpose | Login |
| --- | --- | --- | --- |
| GET | `/health` | Server and database status | Public |
| POST | `/auth/register` | Customer registration | Public |
| POST | `/owners/register` | Owner registration | Public |
| POST | `/auth/login` | Login | Public |
| POST | `/auth/forgot-password` | Send reset link | Public |
| POST | `/auth/reset-password` | Reset password | Public |
| POST | `/auth/verify-email` | Validate account-bound code | Logged in |
| POST | `/auth/correct-email` | Correct unverified email using current password | Logged in |
| GET | `/auth/me` | Current user | Yes; role/ownership applies |
| POST | `/auth/logout` | Logout and invalidate tokens | Yes; role/ownership applies |
| POST | `/auth/resend-verification` | Resend verification code (60 second cooldown) | Yes; role/ownership applies |
| PATCH | `/me` | Update profile | Yes; role/ownership applies |
| GET | `/me/data` | Download own data | Yes; role/ownership applies |
| DELETE | `/me` | Delete own account | Yes; role/ownership applies |
| GET | `/restaurants` | Paginated restaurant list | Public |
| GET | `/restaurants/meta/filters` | Distinct filters | Public |
| GET | `/restaurants/random` | Random open restaurant | Public |
| GET | `/restaurants/compare` | Compare two or three IDs | Public |
| GET | `/restaurants/by-ids` | Saved or recent records | Public |
| GET | `/restaurants/suggest` | Search suggestions | Public |
| GET | `/restaurants/featured` | Discovery: featured | Public |
| GET | `/restaurants/new` | Discovery: new | Public |
| GET | `/restaurants/trending` | Discovery: trending | Public |
| GET | `/restaurants/top-rated` | Discovery: top-rated | Public |
| GET | `/restaurants/most-viewed` | Discovery: most-viewed | Public |
| GET | `/restaurants/stats/by-borough` | MongoDB aggregation: by-borough | Public |
| GET | `/restaurants/stats/by-cuisine` | MongoDB aggregation: by-cuisine | Public |
| GET | `/restaurants/stats/by-country` | MongoDB aggregation: by-country | Public |
| GET | `/restaurants/stats/top-quality` | MongoDB aggregation: top-quality | Public |
| POST | `/restaurants` | Create restaurant | Yes; role/ownership applies |
| GET | `/restaurants/{id}` | Read restaurant | Public |
| PUT | `/restaurants/{id}` | Update restaurant | Yes; role/ownership applies |
| DELETE | `/restaurants/{id}` | Soft delete restaurant | Yes; role/ownership applies |
| POST | `/restaurants/{id}/restore` | Restore restaurant | Yes; role/ownership applies |
| PATCH | `/restaurants/{id}/status` | Change status | Yes; role/ownership applies |
| PATCH | `/restaurants/{id}/approval` | Approve restaurant | Yes; role/ownership applies |
| POST | `/restaurants/{id}/claim` | Claim restaurant | Yes; role/ownership applies |
| POST | `/restaurants/{id}/reports` | Report wrong data | Yes; role/ownership applies |
| GET | `/restaurants/{id}/similar` | Similar restaurants | Public |
| POST | `/restaurants/{id}/view` | Record session view | Public |
| POST | `/restaurants/{id}/contact-owner` | Message owner | Yes; role/ownership applies |
| POST | `/restaurants/{id}/images` | Upload gallery image | Yes; role/ownership applies |
| GET | `/restaurants/{id}/suggestions` | Suggested edits | Yes; role/ownership applies |
| POST | `/restaurants/{id}/suggestions` | Suggested edits | Yes; role/ownership applies |
| PATCH | `/restaurants/{id}/suggestions` | Suggested edits | Yes; role/ownership applies |
| GET | `/restaurants/{id}/reviews` | Published reviews | Public |
| POST | `/restaurants/{id}/reviews` | Write review | Yes; role/ownership applies |
| PATCH | `/reviews/{id}` | Edit own review or moderate | Yes; role/ownership applies |
| DELETE | `/reviews/{id}` | Remove review | Yes; role/ownership applies |
| POST | `/reviews/{id}/helpful` | Helpful vote | Yes; role/ownership applies |
| POST | `/reviews/{id}/reply` | Owner reply | Yes; role/ownership applies |
| POST | `/reviews/{id}/report` | Report review | Yes; role/ownership applies |
| GET | `/countries` | List countries | Public |
| GET | `/countries/{slug}` | Read countries | Public |
| POST | `/countries` | Create countries | Yes; role/ownership applies |
| PUT | `/countries/{slug}` | Update countries | Yes; role/ownership applies |
| DELETE | `/countries/{slug}` | Delete countries | Yes; role/ownership applies |
| GET | `/guides` | List guides | Public |
| GET | `/guides/{slug}` | Read guides | Public |
| POST | `/guides` | Create guides | Yes; role/ownership applies |
| PUT | `/guides/{slug}` | Update guides | Yes; role/ownership applies |
| DELETE | `/guides/{slug}` | Delete guides | Yes; role/ownership applies |
| GET | `/countries/{slug}/restaurants` | Restaurants in country | Public |
| GET | `/faqs` | Frequently asked questions | Public |
| POST | `/contact` | Submit message | Public |
| GET | `/contact` | Manage contact messages | Yes; role/ownership applies |
| PATCH | `/contact/{id}` | Manage contact messages | Yes; role/ownership applies |
| DELETE | `/contact/{id}` | Manage contact messages | Yes; role/ownership applies |
| POST | `/newsletter` | Subscribe or unsubscribe | Public |
| DELETE | `/newsletter` | Subscribe or unsubscribe | Public |
| GET | `/me/favorites` | Own favorites | Yes; role/ownership applies |
| POST | `/me/favorites` | Own favorites | Yes; role/ownership applies |
| DELETE | `/me/favorites` | Own favorites | Yes; role/ownership applies |
| GET | `/me/collections` | Own collections | Yes; role/ownership applies |
| POST | `/me/collections` | Own collections | Yes; role/ownership applies |
| PUT | `/me/collections/{id}` | Own collections | Yes; role/ownership applies |
| DELETE | `/me/collections/{id}` | Own collections | Yes; role/ownership applies |
| GET | `/collections/{id}` | Public collection | Public |
| GET | `/me/reviews` | Own reviews | Yes; role/ownership applies |
| GET | `/me/search-history` | Own search history | Yes; role/ownership applies |
| POST | `/me/search-history` | Own search history | Yes; role/ownership applies |
| DELETE | `/me/search-history` | Own search history | Yes; role/ownership applies |
| GET | `/notifications` | Own notifications | Yes; role/ownership applies |
| PATCH | `/notifications/{id}/read` | Mark notification read | Yes; role/ownership applies |
| GET | `/owner/restaurants` | Owner data | Yes; role/ownership applies |
| GET | `/owner/reviews` | Owner data | Yes; role/ownership applies |
| GET | `/owner/messages` | Owner data | Yes; role/ownership applies |
| GET | `/owner/stats` | Owner data | Yes; role/ownership applies |
| PATCH | `/owner/messages/{id}` | Mark owner message read | Yes; role/ownership applies |
| GET | `/admin/stats/summary` | Staff management data | Yes; role/ownership applies |
| GET | `/admin/stats/reviews` | Staff management data | Yes; role/ownership applies |
| GET | `/admin/restaurants` | Staff management data | Yes; role/ownership applies |
| GET | `/admin/logs` | Staff management data | Yes; role/ownership applies |
| GET | `/admin/login-history` | Staff management data | Yes; role/ownership applies |
| GET | `/admin/users` | Staff management data | Yes; role/ownership applies |
| GET | `/admin/reviews` | Staff management data | Yes; role/ownership applies |
| GET | `/admin/subscribers` | Staff management data | Yes; role/ownership applies |
| GET | `/admin/quality-report` | Staff management data | Yes; role/ownership applies |
| GET | `/admin/restaurants/export` | Staff management data | Yes; role/ownership applies |
| GET | `/claims` | Staff management data | Yes; role/ownership applies |
| GET | `/reports` | Staff management data | Yes; role/ownership applies |
| GET | `/suggestions` | Staff management data | Yes; role/ownership applies |
| PATCH | `/claims/{id}` | Approve or reject claim | Yes; role/ownership applies |
| PATCH | `/reports/{id}` | Resolve or dismiss report | Yes; role/ownership applies |
| POST | `/admin/users` | Create user | Yes; role/ownership applies |
| PATCH | `/admin/users/{id}` | Change user role/status | Yes; role/ownership applies |
| PATCH | `/admin/users/{id}/status` | Suspend or reactivate | Yes; role/ownership applies |
| POST | `/admin/restaurants/import` | Validated bulk JSON import | Yes; role/ownership applies |
| GET | `/settings` | Public settings | Public |
| PUT | `/settings` | Update settings | Yes; role/ownership applies |

Use JSON import records in the seed-file schema. Image uploads use multipart `image` and optional `alt`. `/api/restaurants/compare?ids=a,b,c` takes two or three IDs. All IDs are MongoDB `_id`, not restaurant_id. `/api/admin/restaurants?trash=true` reads soft-deleted data. Logs and admin list routes default to 20 records with a maximum of 100.

## Restaurant suggestions and owner applications

| Method | Endpoint | Purpose | Permission |
| --- | --- | --- | --- |
| POST | `/restaurant-suggestions` | Submit a new restaurant for review | Verified regular user |
| POST | `/restaurant-suggestions/photo` | Upload optional image | Verified regular user |
| GET | `/me/restaurant-suggestions` | Track own suggestions | Logged in |
| GET | `/admin/restaurant-suggestions` | Review submissions | Administrator |
| PATCH | `/admin/restaurant-suggestions/{id}` | Edit/approve or reject with reason | Administrator |
| PATCH | `/admin/owners/{id}` | Approve/reject owner application | Administrator |

Restaurant create/edit/delete requires administrator access or a verified, approved owner acting on their own listing. The legacy anonymous-write flag cannot bypass permissions. Publication approval and restoration require an administrator. See EMAIL_SERVICE_SETUP.md for request fields and behavior.
