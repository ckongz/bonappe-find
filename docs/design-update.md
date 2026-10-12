# BonAppé Find design update

## What changed

- Text-only BonAppé Find branding in navigation and footer, using the locally bundled Allura cursive font. Both logos link home; no symbol appears beside them.
- Original hero and footer SVG waves retained byte-for-byte. Hero blobs and illustrated placeholder image files removed. The footer's straight divider removed.
- Fourteen local restaurant, café and food photographs, consistent crops, descriptive image text and a new `/photo-credits` page. Sources and licenses are in `PHOTO_SOURCES.md`.
- Spacious two-row desktop navigation, balanced action gaps, visible active states and a mobile menu with accessible account/logout links.
- Shared spacing, colors, forms, buttons, cards and typography across all Vue page templates, including owner and staff pages. Body/navigation text remains easy to read.
- About and policy sections become numbered reading cards with photographs and linked contents. Existing introductory content and section 5 headings are restored from the existing source content rather than omitted by the old filtering logic. Cookie storage information becomes an accessible table.
- Guide cards include photos. Guide articles use numbered reading sections alongside an editorial photo; FAQ retains searchable categories and native keyboard-operable accordions, with visible selected states.
- Subtle card entrances, image zooms, button transitions, accordion entrances and non-blocking page entrance transitions. Reveal content stays visible before animation; reduced-motion rules disable movement.
- Contact page photo and information card, form loading states, helpful password-match validation, and selected/focus/disabled states.
- Dashboard and account tabs update real routes, including subscribers, imports, data quality, reviews and notifications. Policy contents links scroll to the intended section.
- Native gallery lightbox and confirmation dialogs close with Escape or backdrop interaction and return focus. Native dialog supplies keyboard focus containment.

## Preserved

Vue/Express/MongoDB architecture, database configuration, API endpoints, authentication/authorization, review moderation, owner claims, listing create/edit/delete/restore, favorites, collections, filters, charts, country content, newsletter/contact storage and role-dependent navigation. No production database was edited. Existing seed image paths were updated only to reference bundled photography.

## Photo meaning

The restaurants in the bundled seed dataset remain fictional. Photos illustrate food and dining themes. A food photo is not proof of a restaurant's actual menu, interiors or location. Owner-uploaded and externally supplied restaurant photos continue to take priority over bundled illustration photography. A full credit page is linked in the footer.

## Design scope

Shared styles apply to every application view. Pre-existing social media/email mockups in `design/` and historical documents are retained as project material; they are not application pages. Existing optional feature limitations documented in the original project still apply.

## October 9 final requirement pass

- Login now begins with explicit Admin, Restaurant Owner, and Customer choices, includes the required account-saving explanation, owner-registration link, password visibility controls, inline password-match feedback, loading states, and a server-backed “Sample Accounts — For Checking” panel.
- Demo buttons use the temporary accounts created by `npm run demo`: customer@example.test, owner@example.test, and reviewer@example.test with password `ReviewOnly123`. `Use` fills the form; `Log in` submits it immediately and checks the selected role before redirecting.
- Customer saving now requires authentication. Signed-out save attempts show a login message and preserve the current restaurant URL as the post-login redirect instead of silently creating a local-only favorite.
- Customer, owner, and administrator screens expose a deterministic unique Account ID derived from the database ObjectId. Restaurant listings continue to use automatically generated unique `BF-<UUID>` restaurant IDs and retain `createdBy` / `ownerId` ownership fields.
- The restaurant-create permission error now uses the required wording: “Please log in as a restaurant owner or administrator to add and manage a restaurant listing.”
