# Aab-e-Khizri (آبِ خضری) - Cumin Water

Files: index.html, style.css, app.js, config.js, logo.png, schema.sql

## Pages
- Open the site with no `#` -> only the public website (storefront) shows.
- Staff portals open only with a hash: `#admin`, `#user`, `#employer`, `#booker`, `#shopkeeper`.
  Anything else after `#` shows the website.

## GitHub Pages
1. Upload all files to the **root** of a repository.
2. Settings -> Pages -> Deploy from a branch -> `main` / `(root)` -> Save.

## Supabase
1. SQL Editor -> paste `schema.sql` -> Run (tables use the `ak_` prefix).
2. `config.js` already has the project URL and the public key. Set your WhatsApp number there.
3. Only publishable keys go in config.js. Never use the service_role key in the browser.

## Status
The website can save guest orders to Supabase after step 1. The staff portals are still demo screens
(no real login yet), so don't share the hash links publicly.
