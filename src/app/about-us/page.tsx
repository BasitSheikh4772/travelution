import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export const metadata: Metadata = {
  title: "About Us",
  description: "Travelution is a Karachi travel agency founded in 2016 — leisure, corporate, religious tourism, visas and insurance.",
};

const values = [
  ["Integrity", "Honesty, ethics and accountability in everything we do."],
  ["Ingenuity", "Creative, practical problem solving for every itinerary."],
  ["Partnership", "Collaborative, trusting relationships with partners, customers and communities."],
  ["Diversity", "Respect for cultures and individuals."],
  ["Trust", "Trust and support among colleagues and partners."],
];

const vision = ["Provide services at the doorstep", "Provide value-added services", "Value customer comfort", "Try to give the best", "Meet the expectations of clients"];

const services = [
  "Air tickets to any destination",
  "Hotel or accommodation booking",
  "Transfers, airport meet & greet, car rental",
  "Visa assistance for many countries",
  "Travel insurance",
  "Religious tourism",
  "Meeting venue booking and event attendance",
  "Honeymoon packages, cruise booking",
  "Interpreters and translators",
  "Tour packages to the Middle East, Asia and Europe",
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="Travel that’s fast, easy and affordable." body="We sell globally but price locally — a Karachi team of travel consultants since 2016." />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-4xl font-medium text-brand">Why choose us?</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map(([t, d], i) => (
            <BlurFade key={t} delay={0.05 * i}>
              <div className="h-full rounded-3xl border border-line bg-white p-7">
                <h3 className="font-display text-2xl text-brand">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      <section className="bg-[#f4ecdf] py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-medium text-brand">Our history</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Founded in 2016 with a small team and about ten years of combined industry experience, Travelution is a licensed travel agency offering personal, comprehensive travel services as a private limited company.
            </p>
            <div className="mt-6"><ShimmerButton href="/tour-packages">Explore packages</ShimmerButton></div>
          </div>
          <div>
            <h2 className="font-display text-4xl font-medium text-brand">Our vision</h2>
            <p className="mt-4 text-muted">High-class services at reasonable prices, delivered ethically and responsibly.</p>
            <ul className="mt-5 space-y-3">
              {vision.map((v) => <li key={v} className="flex items-center gap-2 text-sm"><Check className="size-4 text-gold-dark" /> {v}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-4xl font-medium text-brand">Our services</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {services.map((s) => <li key={s} className="flex items-center gap-2 text-sm text-foreground/80"><Check className="size-4 text-gold-dark" /> {s}</li>)}
        </ul>
        <p className="mt-8 text-sm text-muted">
          Need something specific? <Link href="/contact?topic=quote" className="font-semibold text-brand underline">Request a quote</Link>.
        </p>
      </section>
    </>
  );
}
