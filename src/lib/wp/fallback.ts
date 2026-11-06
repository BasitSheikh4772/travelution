import type { Destination, Service, SiteInfo, Trip } from "./types";

/**
 * Bundled content used when WordPress is unreachable (or while developing
 * offline). Mirrors what the live site already shows.
 */

const WP = "https://travelution.com.pk/wp-content/uploads";
const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=75`;

export const siteInfo: SiteInfo = {
  name: "Travelution",
  phone: "(+92) 321 2997860",
  phoneAlt: "+92 21 34169921-22",
  whatsapp: "923212997860",
  email: "info@travelution.com.pk",
  address: "Office # 2, Almustafa Terrace, Ghazi Salahuddin Road, Adamjee Nagar Society Block B, Karachi.",
  mapUrl: "https://maps.app.goo.gl/FoaLVW2Jmuj1JDGf6",
  social: {
    facebook: "https://www.facebook.com/travelution.com.pk",
    instagram: "https://www.instagram.com/travelutiontravel/",
    youtube: "https://www.youtube.com/@TravelutionTravelution",
    x: "https://x.com/travelution02",
    linkedin: "https://www.linkedin.com/company/travelution-future-of-travels/",
  },
  wpUrl: "https://travelution.com.pk",
};

export const heroImage = U("1524231757912-21f4fe3a7200"); // Galata Tower, Istanbul
export const hajjImage = U("1564769625905-50e93615e769"); // Kaaba kiswah

export const destinationArt: Record<string, { image: string; tagline: string }> = {
  turkey: { image: U("1541432901042-2d8bd64b4a9b"), tagline: "Istanbul to Cappadocia" },
  dubai: { image: U("1512453979798-5ea266f8880c"), tagline: "Skylines & desert nights" },
  maldives: { image: U("1514282401047-d79a71a590e8"), tagline: "Overwater escapes" },
  azerbaijan: { image: U("1519681393784-d120267933ba"), tagline: "Baku & the Caucasus" },
  pakistan: { image: U("1506905925346-21bda4d32df4"), tagline: "Hunza, Skardu & Swat" },
  "saudi-arabia": { image: U("1591604129939-f1efa4d9f7fa"), tagline: "Umrah & Hajj journeys" },
};
export const defaultDestinationArt = { image: U("1469474968028-56623f02e42e"), tagline: "Curated by Travelution" };

export const destinations: Destination[] = [
  { id: 91, slug: "dubai", name: "Dubai", tripCount: 0 },
  { id: 92, slug: "maldives", name: "Maldives", tripCount: 0 },
  { id: 89, slug: "turkey", name: "Turkey", tripCount: 2 },
  { id: 90, slug: "azerbaijan", name: "Azerbaijan", tripCount: 2 },
  { id: 97, slug: "pakistan", name: "Pakistan", tripCount: 14 },
  { id: 99, slug: "saudi-arabia", name: "Saudi Arabia", tripCount: 1 },
].map((d) => ({ ...d, ...(destinationArt[d.slug] ?? defaultDestinationArt) }));

const trip = (t: Partial<Trip> & Pick<Trip, "id" | "slug" | "title" | "image" | "days" | "destinationSlugs">): Trip => ({
  excerpt: "",
  price: null,
  salePrice: null,
  currency: "PKR",
  nights: t.days ? t.days - 1 : null,
  link: `https://travelution.com.pk/trip/${t.slug}/`,
  featured: false,
  ...t,
});

export const trips: Trip[] = [
  trip({
    id: 13826, slug: "15-day-umrah-package-by-travelution", title: "15-Day Umrah Package by Travelution",
    image: `${WP}/2025/06/makkah-kaaba-hajj-muslims_21730-6504-e1749038810204.jpg`, days: 15, destinationSlugs: ["saudi-arabia"],
    excerpt: "A seamless journey of spiritual devotion — comfort, focus and ease across Makkah and Madinah. Flights from Karachi to Jeddah.",
    featured: true,
  }),
  trip({
    id: 13721, slug: "10-days-tour-islamabad-to-hunza-skardu-valley", title: "10 Days Tour Islamabad to Hunza & Skardu Valley",
    image: `${WP}/2024/11/1000_F_291021669_qNyqfC3fzRXRKnQdY4lzPkjLfJIRlWBS-1.jpg`, days: 10, destinationSlugs: ["pakistan"],
    excerpt: "Karakoram highways, turquoise lakes and fort-top sunsets across Hunza and Skardu.", featured: true,
  }),
  trip({
    id: 13719, slug: "08-days-karachi-to-swat-neelum-valley", title: "08 Days Karachi to Swat & Neelum Valley",
    image: `${WP}/2024/11/beautiful-landscape-arang-kel-kashmir-with-green-fields-local-houses-with-hidden-clouds-scaled.jpg`, days: 8, destinationSlugs: ["pakistan"],
    excerpt: "Emerald meadows, Arang Kel and river-side camps in Swat and Azad Kashmir.", featured: true,
  }),
  trip({
    id: 13715, slug: "07-days-tour-karachi-to-skardu", title: "07 Days Tour Karachi to Skardu",
    image: `${WP}/2024/11/ulsan-bawi-rock-seoraksan-mountains-winter-south-korea_335224-287.jpg`, days: 7, destinationSlugs: ["pakistan"],
    excerpt: "Fly north to Skardu — Shangrila, Deosai plains and Shigar fort in one week.", featured: true,
  }),
  trip({
    id: 13717, slug: "10-days-tour-islamabad-to-neelum-kashmir-keran", title: "10 Days Tour Islamabad to Neelum & Kashmir Keran",
    image: `${WP}/2024/11/beautiful-shot-high-mountains-covered-with-green-grass-bushes_181624-7745.jpg`, days: 10, destinationSlugs: ["pakistan"],
    excerpt: "Keran, Sharda and the best of Neelum Valley with a private guide.",
  }),
  trip({
    id: 13734, slug: "06-days-tour-islamabad-to-murree-shogran-valley", title: "06 Days Tour Islamabad to Murree & Shogran Valley",
    image: `${WP}/2024/11/aerial-shot-snowboarding-resort-snow-sunlight_181624-35486.jpg`, days: 6, destinationSlugs: ["pakistan"],
    excerpt: "Hill-station escape with Siri Paye, Shogran and the Kaghan foothills.",
  }),
];

export const services: Service[] = [
  {
    slug: "private-trip-design", title: "Private Trip Designer", icon: "private",
    summary: "Tell us your budget and travel style — we build a fully personalised itinerary, exclusively yours.",
    features: ["Custom day-by-day itinerary", "Hotels, transport & experiences", "One dedicated trip manager"], href: "/contact?topic=private-trip",
  },
  {
    slug: "hajj", title: "Hajj 2027 Registration", icon: "hajj",
    summary: "A well-organised Hajj with trusted guidance, premium services and complete peace of mind.",
    features: ["Trusted guidance throughout", "Premium services", "Complete peace of mind"], href: "/contact?topic=hajj-2027",
  },
  {
    slug: "umrah", title: "Umrah Packages", icon: "umrah",
    summary: "Carefully planned Umrah journeys with flights from Karachi to Jeddah.",
    features: ["Flights from Karachi", "Makkah & Madinah stays", "Day-by-day itinerary"], href: "/contact?topic=umrah",
  },
  {
    slug: "visas", title: "Visa Assistance", icon: "visa",
    summary: "Country-wise visa guidelines and documentation support for popular destinations.",
    features: ["Country-wise guidelines", "Document checklist", "Application support"], href: "/contact?topic=visa",
  },
  {
    slug: "insurance", title: "Travel Insurance", icon: "insurance",
    summary: "Travel insurance to go with your visa and your trip.",
    features: ["Medical cover", "Baggage & cancellation", "Arranged with your booking"], href: "/contact?topic=insurance",
  },
  {
    slug: "tour-guides", title: "Tour Guides & Transport", icon: "guide",
    summary: "Local guides and private transport so you never worry about ground logistics.",
    features: ["Professional guides", "Airport transfers", "Private vehicles"], href: "/contact?topic=guide",
  },
];
