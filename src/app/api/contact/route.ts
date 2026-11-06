import { NextRequest, NextResponse } from "next/server";
import { CF7_FORM_ID, WP_REST } from "@/lib/wp/config";

/**
 * Proxies the enquiry form to WordPress Contact Form 7 so submissions land in
 * the same inbox / CF7 flamingo log as before — and the browser never needs CORS.
 *
 * CF7 form must have these fields: your-name, your-email, your-phone, your-subject, your-message
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, string> | null;
  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ ok: false, message: "Please fill in your name, email and message." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot

  // Client-review demo: pretend success (nothing is sent). Remove DEMO_MODE once CF7 is wired.
  if (!CF7_FORM_ID && process.env.DEMO_MODE === "true") return NextResponse.json({ ok: true, demo: true });

  if (!CF7_FORM_ID) {
    return NextResponse.json(
      { ok: false, message: "Form isn't connected to WordPress yet. Please WhatsApp or call us." },
      { status: 503 },
    );
  }

  const fd = new FormData();
  fd.set("_wpcf7_unit_tag", `wpcf7-f${CF7_FORM_ID}-p0-o1`);
  fd.set("your-name", body.name);
  fd.set("your-email", body.email);
  fd.set("your-phone", body.phone ?? "");
  fd.set("your-subject", body.topic ? `Website enquiry — ${body.topic}` : "Website enquiry");
  fd.set("your-message", body.message);

  try {
    const res = await fetch(`${WP_REST}/contact-form-7/v1/contact-forms/${CF7_FORM_ID}/feedback`, {
      method: "POST",
      body: fd,
      signal: AbortSignal.timeout(15000),
    });
    const json = (await res.json()) as { status?: string; message?: string };
    if (json.status === "mail_sent") return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, message: json.message ?? "Couldn't send. Please try again." }, { status: 422 });
  } catch {
    return NextResponse.json({ ok: false, message: "Couldn't reach the server. Please try again." }, { status: 502 });
  }
}
