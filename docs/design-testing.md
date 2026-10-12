# Design and functionality testing

Tested 9 October 2026 with a temporary, isolated MongoDB instance and Chromium. No user database was modified.

| Check | Result |
| --- | --- |
| Production client build | Passed |
| Existing Node unit/API suite | 16 passed, 0 failed |
| Route and viewport audit | 93 route instances × 3 widths = 279 checks |
| Horizontal page overflow / bundled image errors in route audit | None found |
| Final functional browser scenarios | 11 passed, 0 failed |
| Additional control scenarios | 6 passed |
| Final SPA navigation sequence | 52 public destinations rendered successfully |
| Final narrow/tablet checks | Core pages at 360, 390, 768 and 1024 pixels; no horizontal overflow |
| Hero and footer wave SVGs | Original markup preserved byte-for-byte |
| Text-only brand and local fonts | Verified, including accented é |
| Bundled photographs | All 14 JPEGs decoded and source downloads succeeded |

## Covered routes and features

The route audit covers home; About, Features, How It Works, Team, all policies, accessibility, sitemap, thanks and credits; FAQs/contact; search, add, detail and owner-edit restaurant pages; quality rankings; all eight country guides; all three article guides; cuisines, dishes and festivals; surprise, saved, compare, recent, trending, new, top-rated and most-viewed lists; login/registration/owner registration/password and invalid verification states; account, owner and administrator routes. Details for all sixteen seeded restaurants were visited. Unknown-page behavior was included.

Final browser checks exercise hero search, local font loading, contact submission, newsletter success and duplicate feedback, account profile updates, account tabs, collection create/publish/open/delete, review submission, gallery upload, lightbox Escape and Close, owner claims, restaurant form controls, restaurant create/edit/delete/restore, header/footer link resolution, login/logout, protected-route redirects, dropdown links, mobile menu navigation, FAQ search/categories/accordions, grid/table/map controls, save/compare selection, dark/light mode and reduced-motion visibility. Earlier checks also exercised password mismatch feedback, policy contents anchors, cookie-storage tables and dashboard tab routing.

The page-transition wrapper could leave a blank content area when navigating from the homepage. It now renders the next route directly with a short CSS entrance animation. The final browser sequence confirmed that all 52 checked public destinations render content. Initial route-audit timing failures were revisited after this fix; final About checks at narrow/tablet widths passed.

## Evidence

- `testing/route-viewport-audit.json`: initial full route audit, including expected invalid-token errors and the earlier transition timing failure.
- `testing/final-functional-audit.json`: final 11 passing browser scenarios and 32 additional records, including responsive checks and the 52-route SPA sequence.
- `testing/final-controls-audit.json`: six passing control checks observed before a final long-page screenshot timeout.
- `screenshots/home-desktop.png`, `home-mobile.png`, `about.png`, `privacy.png`, `restaurants.png`, `faqs.png`: successfully captured final viewport previews.

The screenshot timeout affected a redundant capture after the control assertions completed. It does not mean those control assertions failed. Existing final captures are supplied.

The temporary UI test bootstrap disabled only the general request throttle so hundreds of automated page requests would not exhaust its 400-request window. This bootstrap is not in the deliverable. The shipped server retains its original rate limits; the 16-test backend suite runs with the normal middleware.

## Not tested against live services

- Your actual Atlas account, credentials, network access and existing/imported production data. The connection configuration is preserved; no real credentials were supplied for testing.
- Real SMTP/inbox delivery, external newsletter campaigns or OAuth integrations. Local development email behavior and backend account operations were tested.
- Accuracy of real map marker positions or restaurant directions. Seeded fictional addresses lack coordinates; map controls initialize, but real geographic data needs separate checking.
- Real phone/email/social/website destinations belonging to fictional sample restaurants. These placeholder values are preserved and need real business details before public use.
- Every optional advanced dashboard mutation, bulk-import/export combination or future uploaded-data edge case. Their existing code remains intact; core CRUD, claims, reviews, account and role flows were exercised.
- Native devices, Safari/Firefox, external hosting and a full assistive-technology audit. Responsive checks use Chromium viewport emulation; keyboard menu/dialog closing and focus behavior were checked.

Existing optional-feature limitations remain documented in `implementation-status.md` and the main README.
