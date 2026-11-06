import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { TAGS } from "@/lib/wp/config";

/**
 * WordPress → Next webhook.
 * In WP (e.g. WP Webhooks / a 6-line mu-plugin on save_post) call:
 *   POST https://<site>/api/revalidate   header: x-revalidate-secret: <REVALIDATE_SECRET>
 *   body: { "tag": "trips" | "destinations" | "services" | "settings" | "all" }
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { tag = "all" } = (await req.json().catch(() => ({}))) as { tag?: keyof typeof TAGS | "all" };
  const tags = tag === "all" ? Object.values(TAGS) : TAGS[tag] ? [TAGS[tag]] : [];
  if (!tags.length) return NextResponse.json({ ok: false, error: "unknown tag" }, { status: 400 });
  tags.forEach((t) => revalidateTag(t, "max"));
  return NextResponse.json({ ok: true, revalidated: tags });
}
