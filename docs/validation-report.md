# Validation report

Package checked on October 8, 2026.

## Executed checks

- `npm run build`: passed; Vue/Vite production bundle generated.
- `npm test`: all 16 tests passed against real, isolated temporary MongoDB 7.0.24.
- API tests verified restaurant create/read/update/soft-delete/restore; name/cuisine search; borough filtering/grouping; strict aggregate threshold and sorting; validation messages; 400/404/409/422 statuses; customer/owner/staff permissions; pending restaurant visibility; review uniqueness and rating updates; ownership claim approval; favorites isolation; contact/newsletter behavior; protected dashboard access; login/logout token revocation; and public registration preventing admin role selection.
- Unit tests checked server validation, escaped literal search terms, score calculations and timezone-aware overnight hours.
- Browser smoke check visited 34 public routes at 1280-pixel width. No JavaScript page errors or page-level horizontal overflow were detected.
- Browser add/edit/delete flow completed through actual form controls and confirmation dialog.
- Signed-in admin, owner and customer screens were captured from the temporary demo.
- Home, restaurant list/detail, countries and login were checked at 360 × 800 pixels; no page-level horizontal overflow detected.
- AI-use and peer-evaluation DOCX templates were rendered and visually checked as single-page documents.

Screenshots and the browser check report are included in this folder. They use fictional data and temporary demo accounts.

## Limits

These checks do not prove connection to your real Atlas cluster, performance on the full instructor dataset, production deployment, SMTP delivery, Figma prototype behavior or complete accessibility compliance. The 171-feature status matrix records optional gaps. Follow the manual test plan and capture genuine Atlas add/edit/delete evidence before submitting.
