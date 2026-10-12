# Expanded restaurant dataset

This version includes 80 sample restaurants: the original 16 plus 64 new fictional listings, covering 32 cuisines, 16 regions, and 8 countries. Added records include signature dishes, menus, local images, price levels, dietary tags, grades, and recorded hours. New expansion records receive one clearly labeled fictional sample review so rating filters have real stored review records to count.

## Load the new records

For the temporary demo, stop the running app and start `npm run demo` again. It loads the expanded dataset automatically.

For your configured MongoDB database, run `npm run seed` from the project root, then restart `npm run dev`. The seed adds missing records without overwriting existing restaurant edits or accounts. Sample reviews are added only to newly inserted expansion records. Do not use the reset command to apply this update.

## Search and filter coverage

Search supports restaurant names, cuisines, and dish names. Suggestions follow the selected search field. Every individual displayed country, region, cuisine, price, dietary choice, rating threshold, and grade has sample matches. Recorded all-day sample venues provide Open now results throughout the day.

The filters show matching counts based on the current search and other selections. Choices with no matches are disabled; the active choice remains available so it can be cleared. Arbitrary search text or incompatible combinations from saved URLs can still return no results. Search results are never replaced with unrelated restaurants.

All new businesses, addresses, inspection grades, dietary tags, menu prices, hours, and reviews are fictional project data, not verified business information. The new listings have no invented map coordinates. Local photos are illustrative.
