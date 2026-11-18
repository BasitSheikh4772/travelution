import type { TagKey } from "./tags";

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "multiselect" | "lines" | "image" | "video" | "pdf";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  /** static options, or "destinations" to list the destinations collection */
  options?: { value: string; label: string }[] | "destinations";
  /** upload folder for image/video/pdf fields */
  folder?: string;
  /** half-width in the form grid */
  half?: boolean;
  placeholder?: string;
};

export type EntityKey = "reviews" | "trips" | "destinations" | "services" | "visas" | "faqs";

export type EntityDef = {
  key: EntityKey;
  title: string;
  singular: string;
  blurb: string;
  tags: TagKey[];
  idType: "number" | "string";
  fields: FieldDef[];
  /** reviews/services/visas keep a manual order; trips are newest-first as saved */
  orderable?: boolean;
  /** which field is the row's main label / image in the list */
  labelField: string;
  imageField?: string;
};

export const ICON_OPTIONS = ["private", "hajj", "umrah", "visa", "insurance", "guide", "hotel", "flight"].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }));

const BASE: Omit<Record<EntityKey, EntityDef>, "faqs"> = {
  reviews: {
    key: "reviews",
    title: "Client reviews",
    singular: "review",
    blurb: "Video reviews shown on the Reviews page. Upload the video here — it is stored on this site, not on any other server.",
    tags: ["reviews"],
    idType: "string",
    orderable: true,
    labelField: "title",
    imageField: "poster",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "e.g. China group tour review" },
      { name: "name", label: "Client name (optional)", type: "text", half: true },
      { name: "published", label: "Show on website", type: "checkbox", half: true },
      { name: "video", label: "Review video", type: "video", folder: "reviews", required: true, hint: "MP4 recommended. Large files are fine (up to 600 MB)." },
      { name: "poster", label: "Cover image (optional)", type: "image", folder: "reviews", hint: "If empty, the first frame of the video is shown." },
      { name: "quote", label: "Written quote (optional)", type: "textarea" },
    ],
  },
  trips: {
    key: "trips",
    title: "Tour packages",
    singular: "tour package",
    blurb: "Every package shown on Home, Tour Packages and the destination pages.",
    tags: ["trips", "destinations"],
    idType: "number",
    labelField: "title",
    imageField: "image",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL name", type: "text", half: true, hint: "Leave empty to generate from the title." },
      { name: "destinationSlugs", label: "Destinations", type: "multiselect", options: "destinations", half: true },
      { name: "image", label: "Main image", type: "image", folder: "trips" },
      { name: "excerpt", label: "Short summary", type: "textarea" },
      { name: "description", label: "Full description / itinerary", type: "textarea", hint: "Plain text. Blank line = new paragraph." },
      { name: "price", label: "Price", type: "number", half: true, hint: "Leave empty for “price on request”." },
      { name: "salePrice", label: "Sale price", type: "number", half: true },
      { name: "currency", label: "Currency", type: "text", half: true, placeholder: "PKR" },
      { name: "days", label: "Days", type: "number", half: true },
      { name: "nights", label: "Nights", type: "number", half: true },
      { name: "featured", label: "Featured (shown first on Home)", type: "checkbox", half: true },
      { name: "published", label: "Show on website", type: "checkbox", half: true },
    ],
  },
  destinations: {
    key: "destinations",
    title: "Destinations",
    singular: "destination",
    blurb: "Countries / regions shown on the Destinations page. Packages are linked to them from the package form.",
    tags: ["destinations", "trips"],
    idType: "number",
    labelField: "name",
    imageField: "image",
    orderable: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "slug", label: "URL name", type: "text", half: true, hint: "Leave empty to generate from the name." },
      { name: "tagline", label: "Tagline", type: "text", placeholder: "e.g. Istanbul to Cappadocia" },
      { name: "image", label: "Image", type: "image", folder: "destinations" },
      { name: "published", label: "Show on website", type: "checkbox" },
    ],
  },
  services: {
    key: "services",
    title: "Services",
    singular: "service",
    blurb: "The cards on the Services page.",
    tags: ["services"],
    idType: "string",
    orderable: true,
    labelField: "title",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, half: true },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "features", label: "Bullet points", type: "lines", hint: "One per line." },
      { name: "href", label: "Button link", type: "text", half: true, placeholder: "/contact?topic=visa" },
      { name: "published", label: "Show on website", type: "checkbox", half: true },
    ],
  },
  visas: {
    key: "visas",
    title: "Visa guides",
    singular: "visa guide",
    blurb: "Country-wise PDF guidelines on the Visas page.",
    tags: ["visas"],
    idType: "string",
    orderable: true,
    labelField: "country",
    fields: [
      { name: "country", label: "Country", type: "text", required: true, half: true },
      { name: "published", label: "Show on website", type: "checkbox", half: true },
      { name: "file", label: "Guideline PDF", type: "pdf", folder: "visas", required: true },
    ],
  },
};

const FAQS: EntityDef = {
  key: "faqs",
  title: "FAQs",
  singular: "question",
  blurb: "Questions & answers shown on the FAQ page and Home page. They are also published as structured data so Google and AI assistants can quote them directly.",
  tags: ["faqs"],
  idType: "string",
  orderable: true,
  labelField: "question",
  fields: [
    { name: "question", label: "Question", type: "text", required: true },
    { name: "answer", label: "Answer", type: "textarea", required: true, hint: "Write a clear, complete answer in 1–3 sentences — assistants quote the first lines." },
    { name: "published", label: "Show on website", type: "checkbox" },
  ],
};

export const ENTITIES: Record<EntityKey, EntityDef> = { ...BASE, faqs: FAQS };

export const MEDIA_TYPES: FieldType[] = ["image", "video", "pdf"];
