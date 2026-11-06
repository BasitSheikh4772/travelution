import { WP_REST } from "./config";

/**
 * Minimal, failure-tolerant WP REST client.
 * Returns null on any network/HTTP/JSON problem so callers can fall back to
 * bundled content instead of crashing the page.
 */
export async function wpGet<T>(path: string, params: Record<string, string | number> = {}): Promise<T | null> {
  const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
  const url = `${WP_REST}${path}${qs.size ? `?${qs}` : ""}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("json")) return null; // e.g. a bot-protection HTML page
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const entities: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#039;": "'", "&nbsp;": " " };

export function cleanText(html: string, max = 160): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;|&#039;/gi, (m) => entities[m] ?? m)
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, "") + "…" : text;
}
