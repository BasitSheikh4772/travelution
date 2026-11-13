/**
 * Frontend-facing models. Components only ever see these shapes —
 * never raw WordPress JSON — so the CMS can change without touching the UI.
 */

export type Trip = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  /** Regular price in major units, null = "price on request" */
  price: number | null;
  salePrice: number | null;
  currency: string;
  days: number | null;
  nights: number | null;
  destinationSlugs: string[];
  /** Canonical URL on the WordPress/booking site (used until trip pages are ported) */
  link: string;
  featured: boolean;
  /** Full plain-text description (only populated by getTripBySlug) */
  description?: string;
};

export type Destination = {
  id: number;
  slug: string;
  name: string;
  tripCount: number;
  image: string;
  tagline: string;
};

export type Service = {
  slug: string;
  title: string;
  summary: string;
  icon: "visa" | "insurance" | "hajj" | "umrah" | "guide" | "hotel" | "flight" | "private";
  features: string[];
  /** where the "learn more" button goes */
  href: string;
};

export type SiteInfo = {
  name: string;
  phone: string;
  phoneAlt: string;
  whatsapp: string; // digits only, intl format
  email: string;
  address: string;
  mapUrl: string;
  social: { facebook: string; instagram: string; youtube: string; x: string; linkedin: string };
  /** Base URL of WordPress — used for booking / checkout deep links */
  wpUrl: string;
};
