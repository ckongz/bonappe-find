# Login, search history and suggestion replies

Fixed October 13, 2026.

- Login and registration ignore stale session tokens. Successful login opens the dashboard for the account's actual role without logging it out because of a selected login tab.
- Only a 401 response for the current authenticated session clears that session. Late responses for an earlier session and failed credential attempts cannot clear a newer session.
- Search history is saved after results load, including searches opened from the homepage and filter-only searches. The dashboard restores the saved filters and can clear history.
- Administrators can reply to restaurant suggestions. Replies are saved in MongoDB, visible under the customer's suggestions, and generate account notifications. Only administrators can send these replies.
- Contact-message replies are now included in the message schema so MongoDB retains them.

Validation: production frontend build passed; 33 server tests passed; frontend session regression checks passed; 35 UI permission visibility assertions passed. A live deployment and its environment settings were not tested.

## Open the updated project

1. Extract the ZIP into a new folder.
2. Copy your existing server/.env into this project's server folder. Keep the same MongoDB database and JWT secret.
3. From the bonappe-find folder, run npm install.
4. Run npm run dev for your configured database, or npm run demo for the local demo.
5. Open http://localhost:5173 and log in again.

Do not run a reset or reseed command just to apply these fixes. For an online deployment, deploy both the updated backend and frontend; replacing only the frontend will not enable the new replies endpoint.
