# Final update: codes, permissions and restaurant suggestions

Replaced email verification links with server-validated codes. Added a verification notification, code-entry page, resend cooldown, email correction, expiry, single-use consumption and attempt limits. Unverified accounts retain login and favorites.

Centralized owner management permissions require email verification and independent administrator approval. Removed the legacy anonymous-write bypass, restricted owners to their listings, and added application approval/rejection controls and reasons/notifications. Regular users now have a separate restaurant suggestion form, optional photo upload, duplicate flags, dashboard tracking and administrator review/edit/publish/reject workflow. Publication grants no ownership to the submitter.

Original palette styles, photos, fonts and design assets are preserved. New flows use existing UI components/classes. MongoDB stores all changes; the quick demo remains deliberately temporary and clearly labeled.

Email-service setup is in EMAIL_SERVICE_SETUP.md. The final verification report is docs/verification-results.md. Automated server tests, rendered UI visibility checks and the production build passed. Browser screenshots and real provider inbox delivery were not verified in this environment.
