# Implementation status against blueprint v1.3

This package implements the core rubric workflows and the main page inventory. It does not claim all 171 optional ideas are complete. "Implemented" means the code path exists; it is not a claim that real Atlas, Figma or external services have been verified. "Partial" identifies exactly what is available and what remains. External setup is described in README.md.

| ID | Blueprint feature | Status | Notes |
| --- | --- | --- | --- |
| F-001 | Admin Login | Implemented | See corresponding source and manual checks. |
| F-002 | Restaurant Owner Login | Implemented | See corresponding source and manual checks. |
| F-003 | Customer Login and Register | Implemented | See corresponding source and manual checks. |
| F-004 | Logout | Implemented | See corresponding source and manual checks. |
| F-005 | Role-Based Access Control | Implemented | See corresponding source and manual checks. |
| F-006 | Email Verification | Partial / configuration | Account-bound, expiring single-use verification codes with attempt limit, cooldown and email correction. SMTP required for actual delivery; simulated development codes print in the terminal. |
| F-007 | Password Reset | Partial / configuration | Expiring password-reset links implemented. SMTP configuration required for delivery. |
| F-008 | Password Strength Meter | Implemented | See corresponding source and manual checks. |
| F-009 | Account Lockout | Implemented | See corresponding source and manual checks. |
| F-010 | Social Login (Google) | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-011 | Two-Factor Authentication (Admin) | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-012 | Restaurant Owner Registration | Implemented | See corresponding source and manual checks. |
| F-013 | Claim a Restaurant | Implemented | See corresponding source and manual checks. |
| F-014 | Owner Verification | Partial / configuration | Evidence-link claims and human approval are supported. Phone OTP, uploaded document checks and domain automation are not. |
| F-015 | Approve / Reject Owner Requests | Implemented | See corresponding source and manual checks. |
| F-016 | Pending Request Counter | Partial / configuration | Dashboard pending count is shown; no continuously updating header badge. |
| F-017 | Claimed / Verified Badge | Partial / configuration | Claimed badge shown after staff claim approval. New owner-created listings are owned but not independently verified. |
| F-018 | Multi-Branch Management | Partial / configuration | An owner can manage multiple listings; no branch grouping UI. |
| F-019 | Restaurant Profile Completion Percentage | Partial / configuration | Percentage is computed during profile edits for six fields, not the entire planned field set. |
| F-020 | Owner Onboarding Checklist | Partial / configuration | Dashboard explains completion steps; no persisted task checklist. |
| F-021 | Restaurant Approval System | Implemented | See corresponding source and manual checks. |
| F-022 | Owner Edits Pending Approval | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-023 | Restaurant Status | Implemented | See corresponding source and manual checks. |
| F-024 | Soft Delete / Restore Restaurant | Implemented | See corresponding source and manual checks. |
| F-025 | Last Updated Date | Implemented | See corresponding source and manual checks. |
| F-026 | Report Closed Restaurant | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-027 | Opening and Closing Hours | Implemented | See corresponding source and manual checks. |
| F-028 | Open Now Indicator | Implemented | See corresponding source and manual checks. |
| F-029 | Special and Holiday Hours | Partial / configuration | specialHours schema and server computation supported; no dedicated holiday-hours editor. |
| F-030 | Restaurant Price Range | Implemented | See corresponding source and manual checks. |
| F-031 | Dietary Options | Implemented | See corresponding source and manual checks. |
| F-032 | Halal / Vegan / Vegetarian / Gluten-Free Tags | Implemented | See corresponding source and manual checks. |
| F-033 | Allergen Information | Partial / configuration | allergens field is in the schema; dedicated editor/display not completed. |
| F-034 | Restaurant Amenities | Partial / configuration | Amenities checklist and profile text are available; individual pictograms are not. |
| F-035 | Accessibility Details | Partial / configuration | Accessibility schema exists; dedicated profile editor/display not completed. |
| F-036 | Payment Methods | Partial / configuration | Payment checklist and text display are available; no extra payment integrations. |
| F-037 | Spice Level Indicator | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-038 | Occasion Tags | Partial / configuration | occasion field in schema only. |
| F-039 | Reservation Info | Implemented | See corresponding source and manual checks. |
| F-040 | Restaurant Contact Information | Implemented | See corresponding source and manual checks. |
| F-041 | Get Directions Button | Implemented | See corresponding source and manual checks. |
| F-042 | Restaurant Social Media Links | Implemented | See corresponding source and manual checks. |
| F-043 | Restaurant Website Link | Implemented | See corresponding source and manual checks. |
| F-044 | Restaurant Image Gallery | Implemented | See corresponding source and manual checks. |
| F-045 | Restaurant Menu Preview | Implemented | See corresponding source and manual checks. |
| F-046 | Featured Restaurants | Implemented | See corresponding source and manual checks. |
| F-047 | Schedule Featured Restaurants | Implemented | Staff can set optional featured start/end dates in the restaurant form; schedules filter the featured endpoint. |
| F-048 | Newly Added Restaurants | Implemented | See corresponding source and manual checks. |
| F-049 | Trending Restaurants | Partial / configuration | Last-seven-day view-based trending implemented. Saves are all-time counters, not seven-day save events. |
| F-050 | Most Viewed Restaurants | Implemented | See corresponding source and manual checks. |
| F-051 | Top-Rated Restaurants | Implemented | See corresponding source and manual checks. |
| F-052 | Recently Viewed Restaurants | Implemented | See corresponding source and manual checks. |
| F-053 | Similar Restaurant Recommendations | Implemented | See corresponding source and manual checks. |
| F-054 | Restaurant View Counter | Implemented | See corresponding source and manual checks. |
| F-055 | Restaurant of the Day | Partial / configuration | Random restaurant supplied; no stable day-specific choice. |
| F-056 | Auto-Generated Top 10 Lists | Partial / configuration | Ranking and filter endpoints can form these lists; no dedicated generated list pages. |
| F-057 | Advanced Search | Implemented | See corresponding source and manual checks. |
| F-058 | Search Suggestions | Implemented | See corresponding source and manual checks. |
| F-059 | Empty Search Suggestions | Implemented | See corresponding source and manual checks. |
| F-060 | Search History | Implemented | See corresponding source and manual checks. |
| F-061 | Search by Dish Name | Implemented | See corresponding source and manual checks. |
| F-062 | Fuzzy Search | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-063 | Filter by Price Range | Implemented | See corresponding source and manual checks. |
| F-064 | Filter by Rating | Implemented | See corresponding source and manual checks. |
| F-065 | Filter by Cuisine | Implemented | See corresponding source and manual checks. |
| F-066 | Filter by Location / Borough | Implemented | See corresponding source and manual checks. |
| F-067 | Filter by Dietary Options | Implemented | See corresponding source and manual checks. |
| F-068 | Filter by Grade | Implemented | See corresponding source and manual checks. |
| F-069 | Sort by Rating | Implemented | See corresponding source and manual checks. |
| F-070 | Sort Alphabetically | Implemented | See corresponding source and manual checks. |
| F-071 | Sort by Newest | Implemented | See corresponding source and manual checks. |
| F-072 | Active Filter Chips | Partial / configuration | Active filter chips and clear-all work; chips do not include every search parameter. |
| F-073 | Filters in the URL | Implemented | See corresponding source and manual checks. |
| F-074 | Saved Searches | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-075 | Map View | Partial / configuration | Leaflet/OpenStreetMap view with recorded coordinates implemented. Map tiles require network access. |
| F-076 | Near Me and Distance Sort | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-077 | Favorites / Saved Restaurants | Implemented | See corresponding source and manual checks. |
| F-078 | Share Restaurant | Implemented | See corresponding source and manual checks. |
| F-079 | Open Graph Preview Images | Partial / configuration | No per-restaurant server-rendered Open Graph cards; static SPA metadata only. |
| F-080 | Restaurant Comparison | Implemented | See corresponding source and manual checks. |
| F-081 | Surprise Me / Random Restaurant | Implemented | See corresponding source and manual checks. |
| F-082 | Custom Collections | Implemented | See corresponding source and manual checks. |
| F-083 | Want to Try / Been There | Partial / configuration | Collections work, but dedicated Want to Try / Been There buttons are not added. |
| F-084 | Food Passport | Partial / configuration | Saved countries can be derived; no visual passport. |
| F-085 | Customer Profile Page | Implemented | See corresponding source and manual checks. |
| F-086 | Customer Reviews | Implemented | See corresponding source and manual checks. |
| F-087 | Star Ratings | Implemented | See corresponding source and manual checks. |
| F-088 | Sub-Ratings | Partial / configuration | subRatings schema exists; aggregate/editor not completed. |
| F-089 | Rating Breakdown Bars | Implemented | See corresponding source and manual checks. |
| F-090 | One Review per User | Implemented | See corresponding source and manual checks. |
| F-091 | Helpful Votes | Partial / configuration | Helpful votes are deduplicated per account; no most-helpful review sort in the UI. |
| F-092 | Sort Reviews | Implemented | See corresponding source and manual checks. |
| F-093 | Review Photos | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-094 | Profanity and Spam Filter | Partial / configuration | Simple link/spam keyword checks send reviews to pending. Comprehensive profanity filtering is not included. |
| F-095 | Review Moderation | Implemented | See corresponding source and manual checks. |
| F-096 | Report a Review | Implemented | See corresponding source and manual checks. |
| F-097 | Owner Reply to Reviews | Implemented | See corresponding source and manual checks. |
| F-098 | Report Incorrect Restaurant Information | Implemented | See corresponding source and manual checks. |
| F-099 | Suggest an Edit | Implemented | See corresponding source and manual checks. |
| F-100 | Contact Restaurant Owner | Implemented | See corresponding source and manual checks. |
| F-101 | Admin Dashboard | Implemented | See corresponding source and manual checks. |
| F-102 | Restaurant Owner Dashboard | Implemented | See corresponding source and manual checks. |
| F-103 | Admin Notifications | Partial / configuration | Staff in-app records created for new claims, reports and messages; no polling notification bell. |
| F-104 | Owner Notifications | Implemented | See corresponding source and manual checks. |
| F-105 | Total Restaurant Counter | Implemented | See corresponding source and manual checks. |
| F-106 | Total Cuisine Counter | Implemented | See corresponding source and manual checks. |
| F-107 | Total Owner Counter | Implemented | See corresponding source and manual checks. |
| F-108 | Restaurants by Borough Statistics | Implemented | See corresponding source and manual checks. |
| F-109 | Restaurants by Cuisine Statistics | Implemented | See corresponding source and manual checks. |
| F-110 | Most Popular Cuisine | Implemented | See corresponding source and manual checks. |
| F-111 | Review Statistics | Implemented | See corresponding source and manual checks. |
| F-112 | Date Range Filter | Partial / configuration | Review statistics API accepts 7/30/90 days; UI displays 30 days only. |
| F-113 | Owner Analytics | Partial / configuration | Owner views/saves/reviews totals implemented; timed direction/call analytics not implemented. |
| F-114 | Announcements / Today's Special | Partial / configuration | Announcement schema exists; editor and expiry display are not connected. |
| F-115 | Activity Logs | Implemented | See corresponding source and manual checks. |
| F-116 | Login History | Implemented | See corresponding source and manual checks. |
| F-117 | CRUD History | Implemented | See corresponding source and manual checks. |
| F-118 | Admin User Management | Implemented | See corresponding source and manual checks. |
| F-119 | Owner Account Management | Implemented | See corresponding source and manual checks. |
| F-120 | Suspend / Reactivate Owner Account | Implemented | See corresponding source and manual checks. |
| F-121 | Unified Moderation Queue | Implemented | See corresponding source and manual checks. |
| F-122 | Granular Admin Roles | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-123 | CSV / JSON Import and Export | Partial / configuration | Validated JSON import and JSON/CSV export implemented. CSV upload parser not included. |
| F-124 | Bulk Actions | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-125 | Duplicate Detection | Implemented | See corresponding source and manual checks. |
| F-126 | Data Quality Report | Implemented | See corresponding source and manual checks. |
| F-127 | Audit Log Export | Partial / configuration | Audit logs are readable; no filtered CSV exporter. |
| F-128 | Site-Wide Announcement Banner | Partial / configuration | Admin banner and expiration supported; no markdown formatting. |
| F-129 | Maintenance Mode | Partial / configuration | Frontend shows maintenance page to visitors. Read API remains accessible. |
| F-130 | Dish Glossary | Implemented | See corresponding source and manual checks. |
| F-131 | Food Festival Calendar | Implemented | See corresponding source and manual checks. |
| F-132 | Cuisine of the Month | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-133 | First-Time Guide | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-134 | Dining Etiquette Quiz | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-135 | Language Toggle (English / Filipino) | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-136 | FAQ | Implemented | See corresponding source and manual checks. |
| F-137 | Contact / Feedback Form | Implemented | See corresponding source and manual checks. |
| F-138 | About BonAppé Find | Implemented | See corresponding source and manual checks. |
| F-139 | Terms and Conditions | Implemented | See corresponding source and manual checks. |
| F-140 | Privacy Policy | Implemented | See corresponding source and manual checks. |
| F-141 | Accessibility Page | Partial / configuration | Accessibility statement, focus rings and / search shortcut included; no formal assistive-technology audit. |
| F-142 | Cookie Consent Banner | Implemented | See corresponding source and manual checks. |
| F-143 | Delete My Account / Download My Data | Implemented | See corresponding source and manual checks. |
| F-144 | Notification Preferences | Partial / configuration | Email-alert preference saved; per-notification/email-category controls not implemented. |
| F-145 | Mobile Responsive Navigation | Implemented | See corresponding source and manual checks. |
| F-146 | Success / Error Notifications | Implemented | See corresponding source and manual checks. |
| F-147 | Delete Confirmation | Implemented | See corresponding source and manual checks. |
| F-148 | Form Validation | Implemented | See corresponding source and manual checks. |
| F-149 | Pagination | Implemented | See corresponding source and manual checks. |
| F-150 | Back-to-Top Button | Implemented | See corresponding source and manual checks. |
| F-151 | Dark Mode | Implemented | See corresponding source and manual checks. |
| F-152 | Skeleton Loaders | Implemented | See corresponding source and manual checks. |
| F-153 | Designed Empty and Error States | Implemented | See corresponding source and manual checks. |
| F-154 | Breadcrumbs | Implemented | See corresponding source and manual checks. |
| F-155 | Search Shortcut | Implemented | See corresponding source and manual checks. |
| F-156 | Undo After Delete | Implemented | See corresponding source and manual checks. |
| F-157 | Form Autosave Draft | Implemented | See corresponding source and manual checks. |
| F-158 | Skip Link and Focus Rings | Implemented | See corresponding source and manual checks. |
| F-159 | Print Stylesheet and QR Code | Implemented | See corresponding source and manual checks. |
| F-160 | Lazy-Loaded Images | Implemented | See corresponding source and manual checks. |
| F-161 | PWA and Offline Saved List | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-162 | Rate Limiting | Implemented | See corresponding source and manual checks. |
| F-163 | Helmet, CORS and Input Sanitization | Implemented | See corresponding source and manual checks. |
| F-164 | Honeypot Field | Implemented | See corresponding source and manual checks. |
| F-165 | JWT in httpOnly Cookie | Not implemented | Optional extension remains in the source blueprint; no working UI/API is claimed. |
| F-166 | More MongoDB Indexes | Implemented | See corresponding source and manual checks. |
| F-167 | Swagger / OpenAPI Documentation | Implemented | See corresponding source and manual checks. |
| F-168 | Postman Collection | Implemented | See corresponding source and manual checks. |
| F-169 | Automated Tests | Implemented | See corresponding source and manual checks. |
| F-170 | Seed and Reset Scripts | Implemented | See corresponding source and manual checks. |
| F-171 | Schema.org JSON-LD | Implemented | See corresponding source and manual checks. |

## Items requiring your own evidence

The real course dataset, real Atlas connection and screenshots, public GitHub upload, real Figma design/prototype, instructor information, team signatures and peer evaluation scores are not supplied or fabricated. Original blueprint copy is retained; implementation-specific FAQ and policy notes take precedence where v1.3 adds ownership and recoverable deletion.
