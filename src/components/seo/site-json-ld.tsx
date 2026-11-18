import { getContent, getSiteInfo } from "@/lib/cms/queries";
import { SITE_NAME, SITE_URL, abs } from "@/lib/seo";
import { JsonLd } from "./json-ld";

/** Organisation + WebSite entities, included on every page. */
export async function SiteJsonLd() {
  const [s, c] = await Promise.all([getSiteInfo(), getContent()]);
  const tel = (v: string) => v.replace(/[^+\d]/g, "");
  return (
    <JsonLd
      data={[
        {
          "@context": "https://schema.org",
          "@type": ["TravelAgency", "LocalBusiness"],
          "@id": `${SITE_URL}/#organization`,
          name: s.name || SITE_NAME,
          url: SITE_URL,
          logo: abs("/logo.png"),
          image: abs(c["seo.ogImage"] || c["home.hero.image"]),
          description: c["seo.about"],
          foundingDate: "2016",
          telephone: tel(s.phone),
          email: s.email,
          address: { "@type": "PostalAddress", streetAddress: s.address, addressLocality: "Karachi", addressCountry: "PK" },
          areaServed: "Worldwide",
          priceRange: "$$",
          hasMap: s.mapUrl,
          contactPoint: [
            { "@type": "ContactPoint", contactType: "customer service", telephone: tel(s.phone), email: s.email, availableLanguage: ["English", "Urdu"] },
            ...(s.phoneAlt ? [{ "@type": "ContactPoint", contactType: "sales", telephone: tel(s.phoneAlt) }] : []),
          ],
          sameAs: s.socials.map((l) => l.url),
        },
        { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, inLanguage: "en", publisher: { "@id": `${SITE_URL}/#organization` } },
      ]}
    />
  );
}
