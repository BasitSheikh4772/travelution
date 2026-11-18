import type { Metadata } from "next";
import { getContent } from "@/lib/cms/queries";

/** Accepts a bare hostname too (adds https://), so a missing scheme can never break the build. */
const rawSite = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim();
export const SITE_URL = (/^https?:\/\//.test(rawSite) ? rawSite : `https://${rawSite}`).replace(/\/$/, "");
export const SITE_NAME = "Travelution";

export const abs = (u: string) => (/^https?:\/\//.test(u) ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);

/** Default share image: admin-chosen, else the home banner. */
export function shareImage(c: Record<string, string>) {
  return abs(c["seo.ogImage"] || c["home.hero.image"]);
}

/** Title/description/canonical/OpenGraph/Twitter for a page, text editable in the admin. */
export async function pageMeta(page: string, path: string, opts: { image?: string | null } = {}): Promise<Metadata> {
  const c = await getContent();
  const title = c[`${page}.seo.title`];
  const description = c[`${page}.seo.description`];
  const image = opts.image ? abs(opts.image) : shareImage(c);
  return {
    title: page === "home" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title: page === "home" ? title : `${title} | ${SITE_NAME}`, description, url: path, siteName: SITE_NAME, type: "website", locale: "en_PK", images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export const breadcrumb = (items: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
});
