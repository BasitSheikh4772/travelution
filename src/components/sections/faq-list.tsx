import { Plus } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import type { Faq } from "@/lib/cms/types";

/** Accessible accordion (native <details>, no JS) + FAQPage structured data for search/AI answers. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <>
      <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white">
        {faqs.map((f) => (
          <details key={f.id} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-xl text-brand">
              <h3 className="font-display text-xl font-medium">{f.question}</h3>
              <Plus className="size-5 shrink-0 text-gold-dark transition-transform group-open:rotate-45" />
            </summary>
            <p className="px-6 pb-6 leading-relaxed text-muted">{f.answer}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
        }}
      />
    </>
  );
}
