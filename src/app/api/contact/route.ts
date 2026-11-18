import { NextRequest, NextResponse } from "next/server";
import { mutateDb } from "@/lib/cms/db";


const hits = new Map<string, number[]>();

/** Stores website enquiries in the admin portal (Enquiries). */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, string> | null;
  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ ok: false, message: "Please fill in your name, email and message." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 8) return NextResponse.json({ ok: false, message: "Too many messages — please WhatsApp or call us." }, { status: 429 });
  hits.set(ip, [...recent, now]);

  const clip = (v: unknown, n: number) => String(v ?? "").slice(0, n);
  await mutateDb((db) => {
    db.leads.unshift({
      id: crypto.randomUUID().slice(0, 8),
      createdAt: new Date().toISOString(),
      topic: clip(body.topic, 120),
      name: clip(body.name, 120),
      email: clip(body.email, 160),
      phone: clip(body.phone, 60),
      message: clip(body.message, 6000),
      read: false,
    });
    db.leads = db.leads.slice(0, 2000);
  }, ["leads"]);
  return NextResponse.json({ ok: true });
}
