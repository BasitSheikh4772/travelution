/**
 * One-off migration: pulls everything we need from the OLD WordPress site
 * (https://travelution.com.pk) into this project, so the new site no longer
 * depends on it:
 *
 *   - client review videos + poster images   → data/uploads/reviews/
 *   - tour package images                    → data/uploads/trips/
 *   - visa guideline PDFs                    → data/uploads/visas/
 *   - tours / destinations / review metadata → data/content.json
 *
 * Downloads are skipped when the file already exists. NOTE: re-running REPLACES
 * the imported collections (reviews, trips, visas, destinations) in
 * data/content.json — so run it once, before editing in the admin portal.
 * Other keys (settings, page text, enquiries) are left untouched.
 *
 *   node scripts/import-live.mjs            # download missing files, build content.json
 *   node scripts/import-live.mjs --skip-videos
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";

const ORIGIN = "https://travelution.com.pk";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";
const ROOT = path.resolve(import.meta.dirname, "..");
const DATA = path.resolve(process.env.DATA_DIR ?? path.join(ROOT, "data"));
const UPLOADS = path.join(DATA, "uploads");
const skipVideos = process.argv.includes("--skip-videos");
// --files-only: just download media into DATA_DIR/uploads (used on the server after the DB was copied over)
const filesOnly = process.argv.includes("--files-only");

for (const d of ["reviews", "trips", "visas"]) mkdirSync(path.join(UPLOADS, d), { recursive: true });

const get = (url, init = {}) => fetch(url, { ...init, headers: { "User-Agent": UA, ...(init.headers ?? {}) }, signal: AbortSignal.timeout(init.timeout ?? 60_000) });
const getJson = async (p) => {
  const res = await get(`${ORIGIN}/wp-json${p}`);
  if (!res.ok) throw new Error(`${p} → ${res.status}`);
  return res.json();
};

async function download(url, dest) {
  if (existsSync(dest) && statSync(dest).size > 0) return "cached";
  const res = await get(url, { timeout: 15 * 60_000 });
  if (!res.ok || !res.body) throw new Error(`${url} → ${res.status}`);
  const tmp = `${dest}.part`;
  await pipeline(Readable.fromWeb(res.body), createWriteStream(tmp));
  renameSync(tmp, dest);
  return "ok";
}

async function pool(items, limit, fn) {
  let i = 0;
  const run = async () => {
    while (i < items.length) {
      const idx = i++;
      try { await fn(items[idx], idx); } catch (e) { console.warn("  ! failed:", e.message); }
    }
  };
  await Promise.all(Array.from({ length: limit }, run));
}

const slug = (s) =>
  s.normalize("NFKD").replace(/[^\x00-\x7f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const decode = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&amp;/g, "&").replace(/&#8211;|&ndash;/g, "–").replace(/&nbsp;/g, " ");
const plain = (html) =>
  decode(html.replace(/<\/(p|h\d|li|div)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""))
    .replace(/[ \t]+/g, " ").replace(/\n\s*\n\s*\n+/g, "\n\n").trim();

/* ───────────────────────────── reviews ───────────────────────────── */
async function importReviews() {
  console.log("\n▶ Reviews page");
  const html = await (await get(`${ORIGIN}/reviews/`)).text();
  const videos = [...new Set([...html.matchAll(/https:\/\/travelution\.com\.pk\/storage\/[^"'\s)]+?\.mp4/g)].map((m) => m[0]))];
  const covers = [...new Set([...html.matchAll(/https:\/\/travelution\.com\.pk\/storage\/[^"'\s)]+?-Cover\.jpg/g)].map((m) => m[0]))];
  console.log(`  ${videos.length} videos, ${covers.length} posters found`);

  const reviews = videos.map((url, i) => {
    const raw = decodeURIComponent(url.split("/").pop().replace(/\.mp4$/, ""));
    const base = slug(raw);
    const file = `${String(i + 1).padStart(2, "0")}-${base.length > 3 ? base.slice(0, 50) : "review"}.mp4`;
    const cover = covers.find((c) => decodeURIComponent(c).toLowerCase().includes(`${raw.toLowerCase()}-cover`));
    const cleaned = raw.normalize("NFKC").replace(/[^\p{L}\p{N}\s._\-@']/gu, " ").replace(/_[A-Za-z0-9]{8}(-\d+)?$/, "").replace(/[._\-]+/g, " ").replace(/\s+/g, " ").trim();
    const title = cleaned.length > 60 ? cleaned.slice(0, 57).replace(/\s+\S*$/, "") + "…" : cleaned;
    return { url, cover, file, coverFile: cover ? file.replace(/\.mp4$/, ".jpg") : null, title: title || `Client review ${i + 1}` };
  });

  if (!skipVideos) {
    let done = 0;
    await pool(reviews, 3, async (r) => {
      if (r.cover) await download(r.cover, path.join(UPLOADS, "reviews", r.coverFile)).catch((e) => console.warn("  ! poster:", e.message));
      const res = await download(r.url, path.join(UPLOADS, "reviews", r.file));
      console.log(`  [${++done}/${reviews.length}] ${r.file} (${res})`);
    });
  }
  const now = new Date().toISOString();
  return reviews.map((r, i) => ({
    id: `rev-${i + 1}`,
    title: r.title,
    name: "",
    quote: "",
    video: `/media/reviews/${r.file}`,
    poster: r.coverFile && existsSync(path.join(UPLOADS, "reviews", r.coverFile)) ? `/media/reviews/${r.coverFile}` : null,
    order: i,
    published: true,
    createdAt: now,
  }));
}

/* ───────────────────────────── trips & destinations ───────────────────────────── */
async function importTrips() {
  console.log("\n▶ Tours & destinations");
  const [raw, terms] = await Promise.all([getJson("/wp/v2/trip?per_page=100"), getJson("/wp/v2/destination?per_page=100&_fields=id,slug,name,count")]);
  const destById = new Map(terms.map((t) => [t.id, t.slug]));
  const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) && n > 0 ? n : null; };

  const trips = [];
  await pool(raw, 4, async (t) => {
    let image = null;
    const file = t.featured_image?.file;
    if (file) {
      const name = `${t.slug}${path.extname(file)}`.slice(0, 120);
      const dest = path.join(UPLOADS, "trips", name);
      for (const base of [`${ORIGIN}/wp-content/uploads/`, `${ORIGIN}/storage/`]) {
        try { await download(base + file, dest); image = `/media/trips/${name}`; break; } catch { /* try next */ }
      }
    }
    const content = t.content?.rendered ? plain(t.content.rendered) : "";
    trips.push({
      id: t.id,
      slug: t.slug,
      title: plain(t.title.rendered),
      excerpt: plain(t.excerpt?.rendered ?? "").slice(0, 400),
      description: content,
      image,
      price: num(t.price),
      salePrice: num(t.sale_price),
      currency: t.currency?.code ?? "PKR",
      days: t.duration?.days || null,
      nights: t.duration?.nights || null,
      destinationSlugs: (t.destination ?? []).map((id) => destById.get(id)).filter(Boolean),
      link: `/trip/${t.slug}`,
      featured: !!t.is_featured,
      published: true,
      date: t.date,
    });
    console.log(`  trip: ${t.slug}`);
  });
  trips.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  trips.forEach((t) => delete t.date);
  return { trips, terms };
}

/* ───────────────────────────── visa PDFs ───────────────────────────── */
const VISA = [
  ["Algeria", "Algeria"], ["Australia", "Australia"], ["Austria", "Austria"], ["Canada", "Canada"], ["Bahrain", "Bahrain"],
  ["Belgium", "Belgium"], ["Brazil", "Brazil"], ["Brunei", "Brunei"], ["Bulgaria", "Bulgaria"], ["China", "China"],
  ["Dubai", "Dubai"], ["Egypt", "Egypt"], ["Malaysia", "Malaysia"], ["France", "France"], ["Germany", "Germany"],
  ["Indonesia", "Indonesia"], ["Italy", "Italy"], ["Kenya", "Kenya"], ["Singapore", "Singapore"], ["South Africa", "SouthAfrica"],
  ["Spain", "Spain"], ["Thailand", "Thailand"], ["Turkey", "Turkey"], ["UK", "UK"], ["USA", "USA"], ["Ukraine", "Ukraine"],
];
async function importVisas() {
  console.log("\n▶ Visa guideline PDFs");
  const out = [];
  await pool(VISA, 4, async ([country, file]) => {
    const dest = path.join(UPLOADS, "visas", `${file}.pdf`);
    try {
      await download(`${ORIGIN}/storage/2024/10/${file}.pdf`, dest);
      out.push({ id: `visa-${slug(country)}`, country, file: `/media/visas/${file}.pdf`, published: true });
      console.log(`  ${country}`);
    } catch (e) { console.warn(`  ! ${country}: ${e.message}`); }
  });
  const order = new Map(VISA.map(([c], i) => [c, i]));
  return out.sort((a, b) => order.get(a.country) - order.get(b.country));
}

/* ───────────────────────────── main ───────────────────────────── */
const reviews = await importReviews();
const { trips, terms } = await importTrips();
const visas = await importVisas();

if (filesOnly) { console.log(`✔ media downloaded to ${UPLOADS}`); process.exit(0); }
const file = path.join(DATA, "content.json");
const existing = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
const next = {
  ...existing,
  version: 1,
  reviews,
  trips,
  visas,
  // destination names/slugs from WP; artwork + taglines are filled from bundled defaults by the store
  destinations: terms.map((t) => ({ id: t.id, slug: t.slug, name: decode(t.name), published: true })),
};
writeFileSync(file + ".tmp", JSON.stringify(next, null, 2));
renameSync(file + ".tmp", file);
console.log(`\n✔ data/content.json written — ${reviews.length} reviews, ${trips.length} trips, ${visas.length} visa guides, ${terms.length} destinations`);
