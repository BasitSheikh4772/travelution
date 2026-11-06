import type { Metadata } from "next";
import { getServices } from "@/lib/wp/queries";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { Process } from "@/components/sections/process";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export const metadata: Metadata = {
  title: "Services",
  description: "Private trip design, Hajj & Umrah, visas, insurance and tour guides — everything for your journey from Travelution.",
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero eyebrow="What we do" title="Everything your journey needs, under one roof." body="From a private itinerary to visas and insurance — one team, one point of contact." />

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
