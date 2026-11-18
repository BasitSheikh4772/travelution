import { pageMeta } from "@/lib/seo";
import { getContent } from "@/lib/cms/queries";
import { PageHero } from "@/components/sections/page-hero";

export const generateMetadata = () => pageMeta("terms", "/terms-and-conditions");

export default async function TermsPage() {
  const c = await getContent();
  return (
    <>
      <PageHero eyebrow={c["terms.hero.eyebrow"]} title={c["terms.hero.title"]} body={c["terms.hero.body"]} />
      <section className="mx-auto max-w-3xl px-6 py-24">
        {c["terms.body"].split(/\n\s*\n/).map((p, i) => (
          <p key={i} className="mb-5 whitespace-pre-line leading-relaxed text-muted">{p}</p>
        ))}
      </section>
    </>
  );
}
