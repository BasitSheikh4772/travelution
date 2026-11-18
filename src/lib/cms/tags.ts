/** Cache tags — admin actions invalidate these so edits show up on the site immediately. */
export const TAGS = {
  trips: "cms:trips",
  destinations: "cms:destinations",
  services: "cms:services",
  settings: "cms:settings",
  content: "cms:content",
  reviews: "cms:reviews",
  visas: "cms:visas",
  faqs: "cms:faqs",
} as const;
export type TagKey = keyof typeof TAGS;
