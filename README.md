# Travelution — Next.js frontend (headless WordPress)

Frontend: Next.js 16 (App Router, Cache Components) · Tailwind v4 · Motion (`motion/react`) · Magic UI–style components.
CMS: the existing WordPress site (WP Travel Engine, Contact Form 7, Yoast).

Pages built so far: `/` Home · `/services` · `/contact`.

## Run

```bash
cp .env.example .env.local   # then edit
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start
```

## How WordPress sync works

```
WordPress REST (/wp-json/…)  ──►  src/lib/wp/queries.ts  ──►  typed models (types.ts)  ──►  components
                                   ('use cache' + cacheTag)
```

| Frontend data | WordPress source | Status |
|---|---|---|
| Tour packages | `wp/v2/trip` (WP Travel Engine) | **live** — falls back to `fallback.ts` if WP is down |
| Destinations | `wp/v2/destination` | **live** names/counts; artwork is bundled in `fallback.ts` (`destinationArt`) |
| Services | `wp/v2/service` (does not exist yet) | bundled copy; create a `service` CPT with `show_in_rest` and it takes over automatically |
| Contact details / socials | bundled (`fallback.ts`) | swap `getSiteInfo()` for an ACF Options endpoint when needed |
| Enquiry form | CF7 via `/api/contact` | needs `WP_CF7_FORM_ID` (form fields: `your-name, your-email, your-phone, your-subject, your-message`) |

Components never touch raw WP JSON — only the models in `src/lib/wp/types.ts`. Adding a page later = add a query + mapper, no UI rewrite.

### Instant updates (webhook)

Data is cached (hours) and tagged. To refresh immediately when an editor saves in WP, call:

```
POST {SITE_URL}/api/revalidate
x-revalidate-secret: <REVALIDATE_SECRET>
{ "tag": "trips" | "destinations" | "services" | "settings" | "all" }
```

(e.g. from the *WP Webhooks* plugin on `save_post`, or a few lines in a mu-plugin).

## Important notes

- `WP_API_URL` currently points at the public site. The host's bot protection serves a challenge page to some non-browser clients; the client detects non-JSON and falls back to bundled data. For production, whitelist the Next server's IP or use a dedicated `cms.` subdomain.
- Booking/checkout and trip detail links still go to WordPress (`trip.link`) until those pages are ported.
- Destination/hero images are Unsplash placeholders — replace with brand photography (put in WP media, reference via `destinationArt`).
- Copy for Services is a draft based on the live site's menu; confirm with the client.
- Stats (12 yrs, 8k tours, 19k travellers, 97%) are copied from the current homepage.
