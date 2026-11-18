import type { MetadataRoute } from "next";
import { getAllTrips, getDestinations } from "@/lib/cms/queries";
import { SITE_URL } from "@/lib/seo";

const pages: [string, number][] = [
  ["/", 1], ["/tour-packages", 0.9], ["/destinations", 0.8], ["/services", 0.8], ["/hajj-registration-2027", 0.9],
  ["/reviews", 0.7], ["/about-us", 0.6], ["/contact", 0.8], ["/visas", 0.7], ["/insurance", 0.6],
  ["/design-your-trip", 0.7], ["/faq", 0.6], ["/terms-and-conditions", 0.3],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [trips, dests] = await Promise.all([getAllTrips(), getDestinations()]);
  return [
    ...pages.map(([p, priority]) => ({ url: `${SITE_URL}${p === "/" ? "" : p}`, priority })),
    ...dests.map((d) => ({ url: `${SITE_URL}/destinations/${d.slug}`, priority: 0.7 })),
    ...trips.map((t) => ({ url: `${SITE_URL}/trip/${t.slug}`, priority: 0.8 })),
  ];
}
