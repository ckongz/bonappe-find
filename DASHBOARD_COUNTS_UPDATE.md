# Dashboard count refresh

Dashboard summary refreshes independently every five seconds and on window focus. Forms, focused inputs, dialogs and list-loading errors no longer block the count request. Includes total restaurant count. Existing list refresh and action refresh remain enabled.

Verified production build and browser checks: newly created account updates total while account form is open and focused; unsaved draft preserved; failed user-list refresh does not block counts.
