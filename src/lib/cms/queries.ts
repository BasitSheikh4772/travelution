import { cacheLife, cacheTag } from "next/cache";
import { readDb } from "./db";
import { CONTENT_DEFAULTS } from "./content-schema";
import { TAGS } from "./tags";
import { defaultDestinationArt, destinationArt } from "./fallback";
import type { Destination, Faq, Review, Service, SiteInfo, Trip, VisaGuide } from "./types";

/**
 * Public read API. Everything here is cached and tagged; the admin portal
 * invalidates the tags on save (see lib/cms/actions.ts), so edits appear instantly.
 */

export async function getDestinations(): Promise<Destination[]> {
  "use cache";
  cacheTag(TAGS.destinations, TAGS.trips);
  cacheLife("hours");
  const db = await readDb(["destinations", "trips"]);
  const trips = db.trips.filter((t) => t.published);
  return db.destinations
    .filter((d) => d.published)
    .map((d) => ({
      id: d.id,
      slug: d.slug,
      name: d.name,
      published: true,
      tripCount: trips.filter((t) => t.destinationSlugs.includes(d.slug)).length,
      image: d.image || (destinationArt[d.slug] ?? defaultDestinationArt).image,
      tagline: d.tagline || (destinationArt[d.slug] ?? defaultDestinationArt).tagline,
    }));
}

export async function getTrips(opts: { limit?: number } = {}): Promise<Trip[]> {
  "use cache";
  cacheTag(TAGS.trips);
  cacheLife("hours");
  const db = await readDb(["trips"]);
  return db.trips.filter((t) => t.published).slice(0, opts.limit ?? 9);
}

/** Every published trip (Tour Packages archive, destination pages, static params). */
export async function getAllTrips(): Promise<Trip[]> {
  return getTrips({ limit: 500 });
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const all = await getDestinations();
  return all.find((d) => d.slug === slug) ?? null;
}

export async function getTripsByDestination(slug: string): Promise<Trip[]> {
  const all = await getAllTrips();
  return all.filter((t) => t.destinationSlugs.includes(slug));
}

export async function getTripBySlug(slug: string): Promise<Trip | null> {
  const all = await getAllTrips();
  return all.find((t) => t.slug === slug) ?? null;
}

export async function getServices(): Promise<Service[]> {
  "use cache";
  cacheTag(TAGS.services);
  cacheLife("hours");
  return (await readDb(["services"])).services.filter((s) => s.published);
}

export async function getReviews(): Promise<Review[]> {
  "use cache";
  cacheTag(TAGS.reviews);
  cacheLife("hours");
  return (await readDb(["reviews"])).reviews.filter((r) => r.published).sort((a, b) => a.order - b.order);
}

export async function getVisaGuides(): Promise<VisaGuide[]> {
  "use cache";
  cacheTag(TAGS.visas);
  cacheLife("hours");
  return (await readDb(["visas"])).visas.filter((v) => v.published);
}

export async function getFaqs(): Promise<Faq[]> {
  "use cache";
  cacheTag(TAGS.faqs);
  cacheLife("hours");
  return (await readDb(["faqs"])).faqs.filter((f) => f.published);
}

export async function getSiteInfo(): Promise<SiteInfo> {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("hours");
  return (await readDb(["settings"])).settings;
}

/** All editable page text, defaults merged with the admin's overrides. */
export async function getContent(): Promise<Record<string, string>> {
  "use cache";
  cacheTag(TAGS.content);
  cacheLife("hours");
  const stored = (await readDb(["content"])).content;
  const out = { ...CONTENT_DEFAULTS };
  for (const [k, v] of Object.entries(stored)) if (k in out && v.trim() !== "") out[k] = v;
  return out;
}
