# Travelution — Next.js website + admin portal

Self-contained site: **no WordPress / old-website dependency.** All content (tours, destinations, services,
review videos, visa PDFs, page text, enquiries) lives in `data/` and is edited from the admin portal at `/admin`.

Stack: Next.js 16 (App Router, Cache Components) · Tailwind v4 · Motion.

## Run

```bash
npm install
cp .env.example .env.local     # set ADMIN_PASSWORD + SESSION_SECRET
npm run dev                    # http://localhost:3000   (admin: /admin)
npm run build && npm start     # production
```

## Admin portal (`/admin`)

| Section | What you can do |
|---|---|
| Reviews (videos) | upload / replace / reorder / hide / delete the client review videos |
| Tour packages | add, edit (image, price, days, destinations), hide, delete |
| Destinations | add, edit, reorder |
| Services | edit the Services page cards |
| Visa guides | upload country PDFs |
| Page content | edit headings, paragraphs, buttons, banner images, stats on every page |
| Enquiries | messages sent from the website forms |
| Site settings | phone, email, address, WhatsApp, social links |

Login: `ADMIN_USER` / `ADMIN_PASSWORD` from the environment (single admin, signed HttpOnly cookie).
**Change the password before going live.** Edits are live immediately (cache tags are invalidated on save).

## Where data lives

**MySQL / MariaDB** (tables: reviews, trips, destinations, services, visa_guides, faqs, leads, settings, content_overrides).
Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in `.env.local` (XAMPP defaults work out of the box:
root, no password, database `travelution`). The database and tables are created automatically on first run, and the
old `data/content.json` is imported once (then no longer used — keep it as a backup).

- MySQL: all text and records.
- `data/uploads/`: videos, images, PDFs, served at `/media/…` (HTTP Range, so videos seek).

Back up **both** the database (mysqldump) and `data/uploads` (`DATA_DIR` moves it; ≈850 MB of video, git-ignored).

## Hosting requirements

Needs a Node host with MySQL and a **persistent disk** (for uploads) (VPS, cPanel “Node.js app”, Railway/Render with a volume).
It will not work on Vercel/Netlify serverless or GitHub Pages (the `output: export` / Pages workflow
can no longer be used — admin, uploads and the enquiry form need a server).

Large uploads (up to `MAX_UPLOAD_MB`, default 600) stream straight to disk. If you put nginx in front, set
`client_max_body_size 700m;`.

## One-off import from the old WordPress site

`node scripts/import-live.mjs` downloaded the review videos/posters, tour images, visa PDFs, tours and
destinations from the old site into `data/`. Re-running it **replaces** those collections, so run it only on a
fresh `data/`.

Notes: destination/hero images that were already Unsplash placeholders still point at Unsplash — replace them
from the admin (Destinations / Page content → Home) with your own photos.

## Deploy on Railway (GitHub → Railway)

1. **Push to GitHub** — Railway auto-deploys on every push to the connected branch. (The old GitHub Pages
   workflow is now manual-only; Pages can't run the admin/database.)
2. **Railway project** → *New → GitHub Repo* (this repo), then add **MySQL** (*New → Database → MySQL*).
3. **Copy the database** from your PC to Railway *before the first deploy* (so the build sees real data):
   `node scripts/db-copy.mjs "<MYSQL_PUBLIC_URL of the Railway MySQL service>"`
4. **Volume** on the web service: *Settings → Volumes → mount path* `/data` (holds the review videos/uploads).
5. **Variables** on the web service (also used at build time, so use the *public* DB host):
   ```
   DB_HOST=${{MySQL.RAILWAY_TCP_PROXY_DOMAIN}}
   DB_PORT=${{MySQL.RAILWAY_TCP_PROXY_PORT}}
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_NAME=${{MySQL.MYSQLDATABASE}}
   DATA_DIR=/data
   ADMIN_USER=admin
   ADMIN_PASSWORD=<strong password>
   SESSION_SECRET=<long random string>
   NEXT_PUBLIC_SITE_URL=https://<your-domain>
   ```
6. **Media files**: after the first deploy open a shell on the service (`railway ssh`) and run
   `node scripts/import-live.mjs --files-only` — it downloads the videos/PDFs/images into the volume.
   (Needs the old site to still be online; otherwise upload through the admin.)
7. Custom domain: *Settings → Networking*; then set `NEXT_PUBLIC_SITE_URL` to it and redeploy.
