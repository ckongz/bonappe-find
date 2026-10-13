# Automatic administrator setup

The demo-account section has been removed completely from the login page.

In Render > bonappe-find > Environment, add these private settings:

```env
ADMIN_EMAIL=sophiacaseyong@gmail.com
ADMIN_NAME=Sophia Ong
ADMIN_INITIAL_PASSWORD=YOUR_PRIVATE_INITIAL_PASSWORD
```

Use the initial password supplied separately in the chat; it is not embedded in the source or ZIP. Save and redeploy Render. Startup creates a verified admin in dbRestaurants only when that email does not already exist. Login at https://bonappe-find.vercel.app/login.

If the administrator already exists, its current password, verification and status are preserved. The new initial password will not replace its password. Existing non-admin accounts are never promoted automatically; select a different admin email or have an existing admin update the role.

After first successful provisioning, remove ADMIN_INITIAL_PASSWORD from Render's environment; keep ADMIN_EMAIL if you want the existence check. Existing admins can reset their passwords using configured email delivery.

For local Atlas use, add the same variables to server/.env and run npm run dev. Never commit server/.env.

Push these updated source files to the existing GitHub checkout, then redeploy Render and Vercel. Vercel keeps VITE_API_URL=https://bonappe-find.onrender.com/api. SMTP must be configured for real verification/password-reset emails.
