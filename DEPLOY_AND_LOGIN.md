# Connect Vercel, Render, and Atlas

1. Push the updated source to your existing GitHub checkout (do not copy .git, node_modules or .env).
2. Render: npm ci, npm start, NODE_ENV=production, MONGODB_URI=your actual Atlas connection string, JWT_SECRET=your private random secret, CLIENT_ORIGIN=https://bonappe-find.vercel.app, APP_URL=https://bonappe-find.vercel.app. Keep Atlas access for Render's outbound ranges.
3. Vercel: Vite preset, root at the directory containing package.json/client/server, build npm run build, output client/dist. Set VITE_API_URL=https://bonappe-find.onrender.com/api and redeploy Production.
4. Open https://bonappe-find.onrender.com/api/health and check database=connected, demo=false.

# Create your online administrator

In your local server/.env, use the same MONGODB_URI as Render. Allow your computer's current IP in Atlas. From the root project folder run:

```sh
npm ci
npm run create:admin -w server
```

Enter your own administrator email, name and password privately. Then log in on Vercel with those credentials. Accounts are stored in dbRestaurants. No redeployment is needed after account creation. If the email already exists, the script will refuse to overwrite it.

# Customers and owners

Register on the website. Owners must verify their email and receive admin approval before managing listings. Real verification/reset emails require SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and MAIL_FROM on Render. Production never exposes verification codes.

# Automatic administrator

See AUTO_ADMIN_SETUP.md. Set private ADMIN_EMAIL, ADMIN_NAME and ADMIN_INITIAL_PASSWORD variables on Render; startup creates the administrator only if missing. The demo-account section is now removed entirely.

# Included fixes

Valid logins route by the stored account role, not the selected role hint. Duplicate submissions are blocked while a request is running. Render proxy support prevents users sharing the proxy's IP rate limit. Successful authentication requests do not consume the failed-request allowance. Dashboard counts refresh every 15 seconds and still refresh after actions. Rate-limit messages include remaining wait seconds.
