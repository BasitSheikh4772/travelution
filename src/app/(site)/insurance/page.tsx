import { pageMeta } from "@/lib/seo";
import { getContent } from "@/lib/cms/queries";
import { PageHero } from "@/components/sections/page-hero";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export const generateMetadata = () => pageMeta("insurance", "/insurance");

export default async function InsurancePage() {
  const c = await getContent();
  return (
    <>
      <PageHero eyebrow={c["insurance.hero.eyebrow"]} title={c["insurance.hero.title"]} body={c["insurance.hero.body"]} />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-muted">{c["insurance.body"]}</p>
        <div className="mt-8"><ShimmerButton href="/contact?topic=insurance">Ask about insurance</ShimmerButton></div>
      </section>
    </>
  );
}
