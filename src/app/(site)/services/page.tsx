import { pageMeta } from "@/lib/seo";
import { getContent, getServices } from "@/lib/cms/queries";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { Process } from "@/components/sections/process";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export const generateMetadata = () => pageMeta("services", "/services");

export default async function ServicesPage() {
  const [services, c] = await Promise.all([getServices(), getContent()]);
  return (
    <>
      <PageHero eyebrow={c["services.hero.eyebrow"]} title={c["services.hero.title"]} body={c["services.hero.body"]} />

      <section className="mx-auto max-w-6xl px-6 py-28">
        <ServicesGrid services={services} />
      </section>

      <Process />
      <section className="relative overflow-hidden bg-brand-deep py-24 text-white grain">
        <div className="absolute -left-20 top-0 size-96 animate-orb rounded-full bg-gold/20 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-medium sm:text-6xl">
            Ready when <span className="text-gold-grad">you are.</span>
          </h2>
          <p className="mt-4 text-white/70">Tell us where you want to go — we’ll take it from there.</p>
          <div className="mt-8">
            <ShimmerButton href="/contact?topic=quote" variant="gold">Request a quote</ShimmerButton>
          </div>
        </div>
      </section>
    </>
  );
}
