import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export const metadata: Metadata = {
  title: "Reviews",
  description: "What Travelution clients say about their trips.",
};

// NOTE: the live /reviews/ page loads its reviews dynamically and none could be extracted —
// wire a reviews source (Google reviews embed / WP CPT) here before launch.
export default function ReviewsPage() {
  return (
    <>
      <PageHero eyebrow="Reviews" title="Our clients, in their words." body="Hear from travellers who’ve journeyed with us." />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-muted">Client reviews are coming to this page soon.</p>
        <div className="mt-8"><ShimmerButton href="/contact">Talk to us</ShimmerButton></div>
      </section>
    </>
  );
}
