# Manual test plan

Use the temporary demo first. Then repeat persistence checks against your own Atlas project.

1. Open Home without login. Check brand, navigation, country cards and counts.
2. Search by name (Sakura), then cuisine (Bakery). Confirm only matching rows.
3. Select Brooklyn. Confirm results and grouped borough counts agree.
4. Open Best Quality. Every value must be strictly greater than 90 and sorted descending. Increasing the minimum removes lower totals. The sixteen original seeds yield eleven qualifying profiles.
5. Log in as admin. Add a uniquely named restaurant with two grade scores totaling 91. Confirm it appears in the list and Best Quality when status is open.
6. Edit name/address/grades. Refresh and verify persistence.
7. Delete it using the named confirmation dialog. Confirm the record leaves public results and appears in Trash. Restore it and verify that its original data remains.
8. Register a customer; tap the in-app verification notification and enter the six-digit code from the development terminal (or email with SMTP). Post one review, edit it, then delete it. A second review for the same restaurant must return a duplicate error.
9. Register an owner. Verify email, claim a listing, then use admin to approve the claim. The owner can edit that listing but cannot edit another owner's listing or approve their own claim.
10. Add an owner listing. It must be pending and absent from public results until staff approve it.
11. Suspend the owner. Their old token and future login must be blocked. Existing approved restaurant listings remain public.
12. Save two restaurants. Compare them, remove one, and verify browser persistence. Log in to sync favorites.
13. Submit contact and newsletter forms. Check admin messages/subscribers; duplicate subscription must be reported.
14. Open country details and all three guide articles. Compare copy with source blueprint.
15. Use Insights. Expand each chart's data table and compare grouped values.
16. Try invalid data: empty name, score 201, grade Q, invalid coordinates and javascript URL. Verify clear errors.
17. Check width 360, 768 and 1280. No page-level horizontal overflow; desktop table becomes stacked rows at 360. Menu is keyboard accessible.
18. Navigate with Tab. Test skip link, focus outlines and delete-dialog Escape/cancel behavior.
19. Confirm rate limiting, five-failure account lockout, logout token revocation and reset-token expiry.
20. In your real Atlas setup, inspect the collection after add/edit/soft-delete/restore and capture actual evidence.

Do not run destructive experiments on real course data. Use a unique test record and restore or remove it after evidence capture.

## Updated permissions and verification checks

1. Browse logged out: Add/Edit/Delete are hidden; favorites/reviews/suggestions request login. Direct restaurant-write API calls return 401.
2. Register a regular user: notification opens /verify-email. Unverified favorites work; reviews and suggestions return 403.
3. Verify with an incorrect code, an expired code, and five failed attempts; request a fresh code after cooldown. Reuse and account-crossing fail. Correct the email with the current password.
4. Register an owner, verify email, and confirm management stays hidden while pending. Admin rejection needs a reason and appears in the owner dashboard. Approval creates the requested notification. Unverified approved owners still cannot manage.
5. An approved verified owner can add/edit/delete only their own restaurants. Try another owner's IDs and revoke approval while the owner remains logged in.
6. Submit a suggestion with optional URL/uploaded photo; required-field validation and duplicate warnings work. Refresh and confirm Pending. Admin can edit/approve/reject; user sees the result notification/reason. Publication creates no ownership for the submitter.
7. Refresh/restart with a persistent database and verify stored records/decisions. Demo records intentionally reset on demo shutdown.
8. Confirm development says no email was sent without SMTP; test actual inbox delivery with your configured provider.
