> Historical v1.3.1 notes. The current application design is described in `design-update.md`; its photo assets and fonts supersede the illustration notes below.

# Redesign and gap-fill notes (v1.3.1)

## Design
- Restaurant-finder look: sticky header with search pill, hero with big search, cuisine tiles, card grids, wave dividers, pattern bands. Palette from blueprint Part 2 is unchanged; Cormorant Garamond and Lato load from Google Fonts with the blueprint fallbacks.
- Icons: inline SVG set in `client/src/components/common/Icon.vue` (no extra dependency).
- Images: each curated restaurant now shows its own `images/restaurants/bf-0xx.svg`; other records fall back to a dish illustration chosen from the cuisine. New `empty-plate.svg` and `pattern-utensils.svg`.
- Cards: `RestaurantCard`, `CountryCard`, `StatCard`, podium cards on Best Quality, cuisine cards, info cards.
- Interactive: heart-save pop, compare toggle, view toggle (Grid / Table / Map), borough pills, theme toggle, "More" mega-menu, mobile drawer, back-to-top, scroll progress bar, toasts with undo.
- Animations: scroll reveal (`v-reveal`), staggered cards, count-up stats, floating hero cards, page transitions, image zoom, shimmer skeletons. All disabled under `prefers-reduced-motion`.
- The restaurant list now opens in **Grid** view; **Table** (the rubric view) is one click away or `?view=table`. To make the table the default again, change `view:'grid'` to `view:'table'` in `RestaurantsView.vue` (two places).

## Files added to match blueprint Part 3.2
- `docs/BonAppeFind_Project_Blueprint.pdf`
- `client/src/assets/css/components.css`
- `client/src/components/layout/` AppHeader, AppFooter, Breadcrumbs, ToastHost
- `client/src/components/common/` Icon, StarRating, EmptyState, Pagination, StatCard, LoadingSpinner
- `client/src/components/restaurants/` RestaurantCard, GradeBadge, SearchBar, BoroughFilter
- `client/src/components/countries/CountryCard.vue`
- `client/src/composables/` useDebounce, usePagination, useToast, useCountUp
- `client/src/utils/` formatters.js, constants.js; `client/src/directives/reveal.js`
- `server/src/middleware/` asyncHandler, notFound, validate; `server/src/utils/` slugify, pagination

## Still needs your own input
- Screenshots in `docs/screenshots/` were taken before this redesign. Re-capture them from the running app (plus Atlas evidence).
- Real course dataset, Atlas connection, Figma link, instructor details, signatures and peer evaluation scores.
- `node_modules` and two unrelated Python wheel files were left out of the ZIP; run `npm install`.
