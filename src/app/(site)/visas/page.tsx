import { pageMeta } from "@/lib/seo";
import { Download } from "lucide-react";
import { getContent, getVisaGuides } from "@/lib/cms/queries";
import { PageHero } from "@/components/sections/page-hero";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export const generateMetadata = () => pageMeta("visas", "/visas");

export default async function VisasPage() {
  const [guides, c] = await Promise.all([getVisaGuides(), getContent()]);
  return (
    <>
      <PageHero eyebrow={c["visas.hero.eyebrow"]} title={c["visas.hero.title"]} body={c["visas.hero.body"]} />
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <a
              key={g.id}
              href={g.file}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-line bg-white px-5 py-4 transition hover:border-brand"
            >
              <span className="font-display text-xl text-brand">{g.country}</span>
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
