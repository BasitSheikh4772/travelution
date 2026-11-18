import { getAllTrips, getContent, getDestinations, getFaqs, getServices, getSiteInfo } from "@/lib/cms/queries";
import { SITE_URL } from "@/lib/seo";

/** /llms.txt — a plain-text brief of the business for AI assistants (generated from the admin data). */
export async function GET() {
  const [s, c, trips, dests, services, faqs] = await Promise.all([getSiteInfo(), getContent(), getAllTrips(), getDestinations(), getServices(), getFaqs()]);
  const price = (t: (typeof trips)[number]) => {
    const p = t.salePrice ?? t.price;
    return p ? `, from ${t.currency} ${p.toLocaleString("en-US")}` : "";
  };
  const out = [
    `# ${s.name}`,
    "",
    `> ${c["seo.about"]}`,
    "",
    "## Contact",
    `- Address: ${s.address}`,
    `- Phone: ${s.phone}${s.phoneAlt ? ` / ${s.phoneAlt}` : ""}`,
    `- WhatsApp: https://wa.me/${s.whatsapp}`,
    `- Email: ${s.email}`,
    ...s.socials.map((l) => `- ${l.platform}: ${l.url}`),
    "",
    "## Main pages",
    `- [Tour packages](${SITE_URL}/tour-packages)`,
    `- [Destinations](${SITE_URL}/destinations)`,
    `- [Services](${SITE_URL}/services)`,
    `- [Hajj 2027 registration](${SITE_URL}/hajj-registration-2027)`,
    `- [Visa requirements](${SITE_URL}/visas)`,
    `- [Client video reviews](${SITE_URL}/reviews)`,
    `- [FAQ](${SITE_URL}/faq)`,
    `- [Contact](${SITE_URL}/contact)`,
    "",
    "## Services",
    ...services.map((x) => `- ${x.title}: ${x.summary}`),
    "",
    "## Destinations",
    ...dests.map((d) => `- [${d.name}](${SITE_URL}/destinations/${d.slug}): ${d.tagline}`),
    "",
    "## Tour packages",
    ...trips.map((t) => `- [${t.title}](${SITE_URL}/trip/${t.slug})${t.days ? ` — ${t.days} days` : ""}${price(t)}`),
    "",
    "## FAQ",
    ...faqs.flatMap((f) => [`### ${f.question}`, f.answer, ""]),
  ];
  return new Response(out.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
