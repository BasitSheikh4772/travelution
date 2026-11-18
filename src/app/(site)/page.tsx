import type { Metadata } from "next";
import { getContent, getDestinations, getFaqs, getTrips } from "@/lib/cms/queries";
import { pageMeta } from "@/lib/seo";
import { FaqList } from "@/components/sections/faq-list";
import { SectionHeading } from "@/components/sections/section-heading";
import { lines } from "@/lib/cms/content-schema";
import { Hero } from "@/components/sections/hero";
import { Destinations } from "@/components/sections/destinations";
import { Packages } from "@/components/sections/packages";
import { WhyUs } from "@/components/sections/why-us";
import { HajjBanner, PrivateTour, WordBand } from "@/components/sections/feature-bands";

export const generateMetadata = (): Promise<Metadata> => pageMeta("home", "/");

export default async function Home() {
  const [destinations, trips, c, faqs] = await Promise.all([getDestinations(), getTrips({ limit: 9 }), getContent(), getFaqs()]);

  return (
    <>
      <Hero image={c["home.hero.image"]} c={c} />
      <WordBand words={lines(c["home.band.words"])} />
      <Destinations items={destinations} />
      <PrivateTour c={c} />
      <Packages trips={trips} />
      <WhyUs />
      {faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-24">
          <SectionHeading watermark="FAQ" eyebrow="Good to know" title="Frequently asked questions" body="" />
          <div className="mt-12"><FaqList faqs={faqs.slice(0, 6)} /></div>
        </section>
      )}
      <HajjBanner image={c["home.hajj.image"]} c={c} />
    </>
  );
}
