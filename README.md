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

## Logins (demo)
Each portal has its own ID + password login. Demo accounts:
ADM-0001 / admin123, USR-0001 / U5R8WN, EMP-0001 / K7M2QX, BKR-0001 / P4D9ZT. CHANGE THEM before going live.
Admin creates User IDs, User creates Employer/Booker IDs, Shopkeepers create their own SHP ID.
IDs are generated automatically per role. Shopkeepers order bundles with + / - buttons.

## Status
Logins are checked in the browser and saved in this browser only (demo level, NOT secure).
Real security needs Supabase Auth (schema.sql is ready for it). Don't share the hash links publicly yet.
The public website can save guest orders to Supabase after running schema.sql.
