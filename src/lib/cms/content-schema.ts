/**
 * Every piece of editable page text. The admin "Page content" screen is generated
 * from this list; pages read values via getContent() and fall back to `default`.
 */
export type ContentField = { key: string; label: string; type?: "text" | "textarea" | "image"; default: string; hint?: string };
export type ContentGroup = { id: string; title: string; description?: string; fields: ContentField[] };

const hero = (page: string, eyebrow: string, title: string, body: string): ContentField[] => [
  { key: `${page}.hero.eyebrow`, label: "Small label above the title", default: eyebrow },
  { key: `${page}.hero.title`, label: "Page title", default: title },
  { key: `${page}.hero.body`, label: "Intro text", type: "textarea", default: body },
];

const stat = (n: number, value: string, suffix: string, label: string): ContentField[] => [
  { key: `home.stat${n}.value`, label: `Stat ${n} — number`, default: value },
  { key: `home.stat${n}.suffix`, label: `Stat ${n} — suffix`, default: suffix },
  { key: `home.stat${n}.label`, label: `Stat ${n} — label`, default: label },
];

export const CONTENT_GROUPS: ContentGroup[] = [
  {
    id: "home",
    title: "Home page",
    description: "Top banner, statistics, and the Private Tour / Hajj sections.",
    fields: [
      { key: "home.hero.badge", label: "Banner badge", default: "The Future of Travel · Karachi" },
      { key: "home.hero.line1", label: "Headline (first line)", default: "Wake up in" },
      { key: "home.hero.words", label: "Rotating destinations", type: "textarea", hint: "One per line", default: "Istanbul.\nDubai.\nthe Maldives.\nHunza.\nBaku.\nMakkah." },
      { key: "home.hero.sub", label: "Banner paragraph", type: "textarea", default: "Destinations, transport, hotels and experiences — handled for you. Tell us your budget and travel style; we design a trip that’s exclusively yours." },
      { key: "home.hero.cta1", label: "Main button text", default: "Design your private tour" },
      { key: "home.hero.cta2", label: "Second button text", default: "Explore packages" },
      { key: "home.hero.image", label: "Banner background image", type: "image", default: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1400&q=75" },
      ...stat(1, "12", "+", "Years experience"),
      ...stat(2, "8000", "+", "Tours completed"),
      ...stat(3, "19000", "+", "Happy travellers"),
      ...stat(4, "97", "%", "Retention rate"),
      { key: "home.band.words", label: "Scrolling word band", type: "textarea", hint: "One per line", default: "Turkey\nDubai\nMaldives\nAzerbaijan\nPakistan\nUmrah\nHajj 2027\nVisas" },
      { key: "home.private.titleStart", label: "Private tour — title (plain part)", default: "Design your" },
      { key: "home.private.titleAccent", label: "Private tour — title (gold part)", default: "private tour." },
      { key: "home.private.body", label: "Private tour — paragraph", type: "textarea", default: "Planning the perfect trip can feel overwhelming. We handle destinations, transport, hotels and experiences — a fully personalised plan based on your preferences, budget and travel style." },
      { key: "home.hajj.titleStart", label: "Hajj banner — title (plain part)", default: "Your Hajj journey" },
      { key: "home.hajj.titleAccent", label: "Hajj banner — title (gold part)", default: "begins here." },
      { key: "home.hajj.body", label: "Hajj banner — paragraph", type: "textarea", default: "Experience a well-organised Hajj with trusted guidance, premium services and complete peace of mind." },
      { key: "home.hajj.button", label: "Hajj banner — button", default: "Start your Hajj journey" },
      { key: "home.hajj.image", label: "Hajj banner image", type: "image", default: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=75" },
    ],
  },
  { id: "reviews", title: "Reviews page", description: "The videos themselves are managed under “Reviews”.", fields: hero("reviews", "Reviews", "Our clients, in their words.", "Hear from travellers who’ve journeyed with us.") },
  { id: "tours", title: "Tour packages page", fields: hero("tours", "Tour packages", "Every itinerary, in one place.", "From weekend escapes to two-week journeys — pick a package or ask us to tailor one.") },
  { id: "destinations", title: "Destinations page", fields: hero("destinations", "Destinations", "Where to next?", "Pick a destination to see every package we run there.") },
  { id: "services", title: "Services page", fields: hero("services", "What we do", "Everything your journey needs, under one roof.", "From a private itinerary to visas and insurance — one team, one point of contact.") },
  {
    id: "about",
    title: "About page",
    fields: [
      ...hero("about", "About us", "Travel that’s fast, easy and affordable.", "We sell globally but price locally — a Karachi team of travel consultants since 2016."),
      { key: "about.history", label: "Our history", type: "textarea", default: "Founded in 2016 with a small team and about ten years of combined industry experience, Travelution is a licensed travel agency offering personal, comprehensive travel services as a private limited company." },
      { key: "about.vision", label: "Our vision (intro line)", type: "textarea", default: "High-class services at reasonable prices, delivered ethically and responsibly." },
    ],
  },
  {
    id: "hajj",
    title: "Hajj 2027 page",
    fields: [
      ...hero("hajj", "Hajj 2027", "Begin your blessed journey.", "Trusted guidance, premium accommodation and peace of mind — visa and documentation handled by our team."),
      { key: "hajj.package.meta", label: "Package — small line", default: "16 days · 5 star hotels" },
      { key: "hajj.package.name", label: "Package — name", default: "Maktab A – Zone 1" },
      { key: "hajj.package.price", label: "Package — price", default: "PKR 2,750,000/- · USD 8,600 (without ticket)" },
    ],
  },
  { id: "visas", title: "Visas page", description: "The country PDFs themselves are managed under “Visa guides”.", fields: hero("visas", "Services", "Visa requirements, country by country.", "Download the guidelines for your destination — then let our team handle the application.") },
  {
    id: "insurance",
    title: "Insurance page",
    fields: [
      ...hero("insurance", "Services", "Travel insurance.", "Travel with cover for the unexpected. Tell us your destination and dates and we’ll arrange a policy."),
      { key: "insurance.body", label: "Page text", type: "textarea", default: "Insurance is arranged per trip. Contact a consultant for plans and pricing." },
    ],
  },
  { id: "design", title: "Design your trip page", fields: hero("design", "Private trips", "Design your private trip.", "Share your preferences and we’ll design a personalised itinerary with hotel deals, transport and a hassle-free experience.") },
  { id: "contact", title: "Contact page", description: "Phone, email, address and social links are under “Site settings”.", fields: hero("contact", "Contact", "Let’s plan your next journey.", "Tell us where you want to go. A consultant replies with ideas, not a sales script.") },
  {
    id: "terms",
    title: "Terms & Conditions page",
    fields: [
      ...hero("terms", "Legal", "Terms & Conditions", "The terms that apply to bookings made with Travelution."),
      { key: "terms.body", label: "Terms text", type: "textarea", hint: "Leave a blank line between paragraphs.", default: "The full terms are being migrated. Until then please contact our team for the current terms of your booking." },
    ],
  },
  { id: "faq", title: "FAQ page", description: "The questions themselves are managed under “FAQs”.", fields: hero("faq", "FAQ", "Questions, answered.", "Quick answers about our tours, Umrah, Hajj, visas and bookings.") },
  {
    id: "seo",
    title: "Site-wide SEO",
    description: "Defaults used when a page is shared on WhatsApp, Facebook, X or found by search engines and AI assistants.",
    fields: [
      { key: "seo.ogImage", label: "Default share image", type: "image", default: "", hint: "Wide image (1200×630). Used when a page has no image of its own. Empty = home banner image." },
      { key: "seo.about", label: "One-paragraph business summary (for AI assistants)", type: "textarea", default: "Travelution is a licensed travel agency in Karachi, Pakistan, founded in 2016. It offers private and group tour packages, Umrah and Hajj journeys, visa assistance, travel insurance, air tickets, hotel booking and transfers.", hint: "Published in llms.txt and structured data. Factual, plain sentences work best." },
    ],
  },
  {
    id: "footer",
    title: "Footer",
    fields: [
      { key: "footer.cta", label: "Big footer heading (plain part)", default: "Ready for your next" },
      { key: "footer.ctaAccent", label: "Big footer heading (gold part)", default: "journey?" },
      { key: "footer.tagline", label: "Footer description", type: "textarea", default: "Your travel companion from Karachi — private tours, Hajj & Umrah, visas and insurance, designed around you." },
    ],
  },
];


/** [search title, search description] per page group — editable in the admin ("Search appearance") */
const SEO: Record<string, [string, string]> = {
  home: ["Travelution — Tours, Umrah, Hajj & Visas from Karachi", "Travelution is a Karachi-based travel company crafting private tours, Hajj & Umrah journeys, visas and insurance — worldwide."],
  reviews: ["Client Video Reviews", "Watch video reviews from Travelution clients — group tours, Umrah, Hajj and private trips."],
  tours: ["Tour Packages", "Browse every Travelution tour — Pakistan northern valleys, Turkey, Azerbaijan, Europe, Singapore and Umrah packages."],
  destinations: ["Destinations", "Explore Travelution destinations — Pakistan, Turkey, Azerbaijan, Saudi Arabia, Europe, Singapore, USA and more."],
  services: ["Travel Services", "Private trip design, Hajj & Umrah, visas, insurance and tour guides — everything for your journey from Travelution."],
  about: ["About Us", "Travelution is a Karachi travel agency founded in 2016 — leisure, corporate, religious tourism, visas and insurance."],
  hajj: ["Hajj 2027 Registration", "Register for Hajj 2027 with Travelution — visa assistance, group travel support and a dedicated team."],
  visas: ["Visa Requirements", "Download visa requirement guidelines by country, or let Travelution handle your visa application."],
  insurance: ["Travel Insurance", "Travel insurance arranged by Travelution for your trip."],
  design: ["Design Your Trip", "Design a private trip with Travelution — choose dates, destination, hotel category and transport, and we’ll send an itinerary."],
  contact: ["Contact Us", "Request a quote or talk to a Travelution travel consultant — Karachi office, phone, email and WhatsApp."],
  terms: ["Terms & Conditions", "Travelution terms and conditions."],
  faq: ["Frequently Asked Questions", "Answers to common questions about Travelution tours, Umrah, Hajj 2027, visas and bookings."],
};
for (const g of CONTENT_GROUPS) {
  const s = SEO[g.id];
  if (!s) continue;
  g.fields.push(
    { key: `${g.id}.seo.title`, label: "Search title (SEO)", default: s[0], hint: "Shown in Google results. Keep under ~60 characters." },
    { key: `${g.id}.seo.description`, label: "Search description (SEO)", type: "textarea", default: s[1], hint: "Shown under the title in Google and used by AI assistants. 120–160 characters is ideal." },
  );
}

export const CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(CONTENT_GROUPS.flatMap((g) => g.fields.map((f) => [f.key, f.default])));
export const lines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
