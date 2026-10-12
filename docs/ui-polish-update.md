# UI polish update (alignment, interaction, motion)

Palette, fonts and the cursive logo are unchanged. New stylesheet: `client/src/assets/css/polish.css` (imported last in `main.js`).

## 1. Alignment and spacing
- One content width and section rhythm; page headers keep their action buttons right-aligned and wrap cleanly on phones.
- Equal 16:10 card/guide/editorial images; card actions pinned to the bottom, nothing clipped.
- Dashboard stat tiles on a responsive grid with readable labels; admin tabs wrap on desktop and scroll on phones; wide tables scroll inside their card instead of squeezing text.
- Account page: removed the duplicated Account ID and duplicated buttons; two-column profile layout.
- No horizontal page scroll at 390px or 1440px (checked on 30 pages).
- Body text and navigation use the Lato body face; cursive is the logo only.

## 2. Interactive components
- Restaurants: live search (debounced) combined with filters, animated "More filters" panel with active-count badge, removable filter chips, Reset all, helpful empty state with reset and suggested cuisines, updating/loading states.
- FAQ: real accordion buttons (aria-expanded), search with highlighting, category filter, answer count, reset, empty state.
- Countries, Cuisines/Dishes/Festivals, Guides, Account search history and dashboard lists: search with clear button, counts, reset and "no match" messages.
- Forms (Contact, Login/Register/Owner/Reset, Account, Claim, Best Quality, Restaurant form, Review, Report, Suggest edit, Owner message, Newsletter, Admin create-user/import): messages shown beside the field, `aria-invalid`, focus moves to the first error, loading and success states.
- Dialogs: native `<dialog>` with close button, Escape, backdrop click, focus restore, and a "discard changes?" step. Browser `confirm()`/`prompt()` calls were replaced by these dialogs. Unsaved-changes warning on Contact and Restaurant form.

## 3. Animation
- Staggered card entrance, button/hover transitions, gentle image zoom, accordion and filter-panel expansion, tab-panel fades, page transitions, heart "pop" when saving, chip pop on filters, count flash on result changes, shake on invalid submit.
- `prefers-reduced-motion` disables movement; content is visible without animation.

Note: built `client/dist` was refreshed with `npm run build`.
