import { getContent, getFaqs } from "@/lib/cms/queries";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/sections/page-hero";
import { FaqList } from "@/components/sections/faq-list";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export const generateMetadata = () => pageMeta("faq", "/faq");

export default async function FaqPage() {
  const [faqs, c] = await Promise.all([getFaqs(), getContent()]);
  return (
    <>
      <PageHero eyebrow={c["faq.hero.eyebrow"]} title={c["faq.hero.title"]} body={c["faq.hero.body"]} />
      <section className="mx-auto max-w-3xl px-6 py-20">
        {faqs.length ? <FaqList faqs={faqs} /> : <p className="text-center text-muted">No questions yet.</p>}
        <div className="mt-14 text-center">
          <p className="text-muted">Still have a question?</p>
          <div className="mt-5"><ShimmerButton href="/contact">Ask our team</ShimmerButton></div>
        </div>
      </section>
    </>
  );
}
