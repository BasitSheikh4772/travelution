import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Travelution terms and conditions.",
};

// NOTE: the live /terms-and-conditions/ body could not be extracted — paste the approved legal text here.
export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" body="The terms that apply to bookings made with Travelution." />
      <section className="mx-auto max-w-3xl px-6 py-24">
        <p className="text-muted">The full terms are being migrated. Until then please contact our team for the current terms of your booking.</p>
      </section>
    </>
  );
}
