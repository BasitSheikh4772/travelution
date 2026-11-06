import { cacheLife, cacheTag } from "next/cache";
import { TAGS, WP_URL } from "./config";
import { cleanText, wpGet } from "./client";
import {
  defaultDestinationArt,
  destinationArt,
  destinations as fallbackDestinations,
  services as fallbackServices,
  siteInfo as fallbackSiteInfo,
  trips as fallbackTrips,
} from "./fallback";
import type { Destination, Service, SiteInfo, Trip } from "./types";

/* ───────────── raw WordPress shapes (WP Travel Engine + core) ───────────── */

type WpTrip = {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  destination?: number[];
  price?: string | number;
  sale_price?: string | number;
  currency?: { code?: string };
  duration?: { days?: number; nights?: number };
  is_featured?: boolean;
  featured_image?: { sizes?: Record<string, { source_url: string }>; file?: string };
};

type WpTerm = { id: number; slug: string; name: string; count: number };

const num = (v: unknown) => {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
};

const decode = (s: string) => cleanText(s, 200);

function mapTrip(t: WpTrip, destById: Map<number, string>): Trip {
  const sizes = t.featured_image?.sizes;
  const image =
    sizes?.["tourm_420X347"]?.source_url ??
    sizes?.["medium_large"]?.source_url ??
    sizes?.["full"]?.source_url ??
    (t.featured_image?.file ? `${WP_URL}/wp-content/uploads/${t.featured_image.file}` : null);
  return {
    id: t.id,
    slug: t.slug,
    title: decode(t.title.rendered),
    excerpt: cleanText(t.excerpt.rendered, 130),
    image,
    price: num(t.price),
    salePrice: num(t.sale_price),
    currency: t.currency?.code ?? "PKR",
    days: t.duration?.days || null,
    nights: t.duration?.nights || null,
    destinationSlugs: (t.destination ?? []).map((id) => destById.get(id)).filter((x): x is string => !!x),
    link: t.link,
    featured: !!t.is_featured,
  };
}

/* ───────────────────────────── cached queries ───────────────────────────── */

export async function getDestinations(): Promise<Destination[]> {
  "use cache";
  cacheTag(TAGS.destinations);
  cacheLife("hours");

  const terms = await wpGet<WpTerm[]>("/wp/v2/destination", { per_page: 50, _fields: "id,slug,name,count" });
  if (!terms?.length) return fallbackDestinations;

  // destinations with curated artwork first (WP term images aren't in REST by default)
  const rank = (slug: string) => {
    const i = Object.keys(destinationArt).indexOf(slug);
    return i === -1 ? 99 : i;
  };
  return terms
    .map((t) => ({
      id: t.id,
      slug: t.slug,
      name: decode(t.name),
      tripCount: t.count,
      ...(destinationArt[t.slug] ?? defaultDestinationArt),
    }))
    .sort((a, b) => rank(a.slug) - rank(b.slug));
}

export async function getTrips(opts: { limit?: number } = {}): Promise<Trip[]> {
  "use cache";
  cacheTag(TAGS.trips);
  cacheLife("hours");
  const limit = opts.limit ?? 9;

  const [raw, terms] = await Promise.all([
    wpGet<WpTrip[]>("/wp/v2/trip", {
      per_page: limit,
      orderby: "date",
      order: "desc",
      _fields: "id,slug,link,title,excerpt,destination,price,sale_price,currency,duration,is_featured,featured_image",
    }),
    wpGet<WpTerm[]>("/wp/v2/destination", { per_page: 50, _fields: "id,slug" }),
  ]);
  if (!raw?.length) return fallbackTrips.slice(0, limit);

  const destById = new Map((terms ?? []).map((t) => [t.id, t.slug]));
  return raw.map((t) => mapTrip(t, destById));
}

/**
 * Services: today they come from bundled copy. When you're ready, create a
 * `service` custom post type in WordPress (title, excerpt, ACF "features",
 * "icon") exposed with show_in_rest — this function will pick it up with no UI change.
 */
export async function getServices(): Promise<Service[]> {
  "use cache";
  cacheTag(TAGS.services);
  cacheLife("hours");

  type WpService = { slug: string; title: { rendered: string }; excerpt: { rendered: string }; acf?: { icon?: Service["icon"]; features?: string[]; href?: string } };
  const raw = await wpGet<WpService[]>("/wp/v2/service", { per_page: 20, _fields: "slug,title,excerpt,acf" });
  if (!raw?.length) return fallbackServices;

  return raw.map((s) => ({
    slug: s.slug,
    title: decode(s.title.rendered),
    summary: cleanText(s.excerpt.rendered, 200),
    icon: s.acf?.icon ?? "private",
    features: s.acf?.features ?? [],
    href: s.acf?.href ?? "/contact",
  }));
}

/**
 * Global contact details / socials. Swap for an ACF Options-page endpoint
 * (e.g. /wp-json/acf/v3/options/options) when the client wants them editable in WP.
 */
export async function getSiteInfo(): Promise<SiteInfo> {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("days");
  return fallbackSiteInfo;
}
