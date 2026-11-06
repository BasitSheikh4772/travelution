/** Single place that knows where WordPress lives. */
export const WP_URL = (process.env.WP_API_URL ?? "https://travelution.com.pk").replace(/\/$/, "");
export const WP_REST = `${WP_URL}/wp-json`;

/** Contact Form 7 form ID (WP Admin → Contact → the form's shortcode id) */
export const CF7_FORM_ID = process.env.WP_CF7_FORM_ID ?? "";

/** Cache tags — the WP webhook invalidates these via /api/revalidate */
export const TAGS = {
  trips: "wp:trips",
  destinations: "wp:destinations",
  services: "wp:services",
  settings: "wp:settings",
} as const;
