/**
 * Frontend-facing models. Components only ever see these shapes; the
 * admin portal edits the same shapes (stored in data/content.json).
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
  /** Internal link to the trip page */
  link: string;
  featured: boolean;
  published: boolean;
  /** Full plain-text description */
  description?: string;
};

export type Destination = {
  id: number;
  slug: string;
  name: string;
  tripCount: number;
  image: string;
  tagline: string;
  published: boolean;
};

export type ServiceIcon = "visa" | "insurance" | "hajj" | "umrah" | "guide" | "hotel" | "flight" | "private";

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  icon: ServiceIcon;
  features: string[];
  /** where the "learn more" button goes */
  href: string;
  published: boolean;
};

export type Review = {
  id: string;
  title: string;
  /** Reviewer name (optional) */
  name: string;
  /** Optional written quote shown under the video */
  quote: string;
  /** /media/... file or an external URL */
  video: string;
  poster: string | null;
  order: number;
  published: boolean;
  createdAt: string;
};

export type VisaGuide = {
  id: string;
  country: string;
  /** /media/... PDF or external URL */
  file: string;
  published: boolean;
};

export type SiteInfo = {
  name: string;
  phone: string;
  phoneAlt: string;
  whatsapp: string; // digits only, intl format
  email: string;
  address: string;
  mapUrl: string;
  socials: SocialLink[];
};

export type SocialLink = {
  id: string;
  /** key from social-platforms.ts (facebook, instagram …) */
  platform: string;
  url: string;
  /** optional custom icon (uploaded image) that replaces the built-in brand icon */
  icon?: string | null;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  published: boolean;
};

export type Lead = {
  id: string;
  createdAt: string;
  topic: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
};
