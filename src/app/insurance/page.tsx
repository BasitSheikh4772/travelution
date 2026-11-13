import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export const metadata: Metadata = {
  title: "Travel Insurance",
  description: "Travel insurance arranged by Travelution for your trip.",
};

// NOTE: the live /insurance/ page had no extractable content — fill in plans/copy once the client supplies them.
export default function InsurancePage() {
  return (
    <>
      <PageHero eyebrow="Services" title="Travel insurance." body="Travel with cover for the unexpected. Tell us your destination and dates and we’ll arrange a policy." />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-muted">Insurance is arranged per trip. Contact a consultant for plans and pricing.</p>
        <div className="mt-8"><ShimmerButton href="/contact?topic=insurance">Ask about insurance</ShimmerButton></div>
      </section>
    </>
  );
}
