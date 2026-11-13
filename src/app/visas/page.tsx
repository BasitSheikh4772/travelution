import type { Metadata } from "next";
import { Download } from "lucide-react";
import { getSiteInfo } from "@/lib/wp/queries";
import { PageHero } from "@/components/sections/page-hero";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export const metadata: Metadata = {
  title: "Visas",
  description: "Download visa requirement guidelines for 26 countries, or let Travelution handle your visa application.",
};

// [label, pdf file name] — PDFs are hosted on the existing WordPress media library
const countries: [string, string][] = [
  ["Algeria", "Algeria"], ["Australia", "Australia"], ["Austria", "Austria"], ["Canada", "Canada"], ["Bahrain", "Bahrain"],
  ["Belgium", "Belgium"], ["Brazil", "Brazil"], ["Brunei", "Brunei"], ["Bulgaria", "Bulgaria"], ["China", "China"],
  ["Dubai", "Dubai"], ["Egypt", "Egypt"], ["Malaysia", "Malaysia"], ["France", "France"], ["Germany", "Germany"],
  ["Indonesia", "Indonesia"], ["Italy", "Italy"], ["Kenya", "Kenya"], ["Singapore", "Singapore"], ["South Africa", "SouthAfrica"],
  ["Spain", "Spain"], ["Thailand", "Thailand"], ["Turkey", "Turkey"], ["UK", "UK"], ["USA", "USA"], ["Ukraine", "Ukraine"],
];

export default async function VisasPage() {
  const s = await getSiteInfo();
  return (
    <>
      <PageHero eyebrow="Services" title="Visa requirements, country by country." body="Download the guidelines for your destination — then let our team handle the application." />
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map(([label, file]) => (
            <a
              key={file}
              href={`${s.wpUrl}/storage/2024/10/${file}.pdf`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-line bg-white px-5 py-4 transition hover:border-brand"
            >
              <span className="font-display text-xl text-brand">{label}</span>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-dark">
                Guidelines <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
              </span>
            </a>
          ))}
        </div>
        <div className="mt-14 text-center">
          <p className="text-muted">Don’t see your country? We assist with visas for many more destinations.</p>
          <div className="mt-6"><ShimmerButton href="/contact?topic=visa">Ask about a visa</ShimmerButton></div>
        </div>
      </section>
    </>
  );
}
