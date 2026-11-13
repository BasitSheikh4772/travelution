import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDestinations } from "@/lib/wp/queries";
import { PageHero } from "@/components/sections/page-hero";
import { BlurFade } from "@/components/magicui/blur-fade";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore Travelution destinations — Pakistan, Turkey, Azerbaijan, Saudi Arabia, Europe, Singapore, USA and more.",
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  return (
    <>
      <PageHero eyebrow="Destinations" title="Where to next?" body="Pick a destination to see every package we run there." />
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <BlurFade key={d.slug} delay={0.06 * (i % 3)}>
              <Link
                href={`/destinations/${d.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-[0_20px_50px_-30px_rgba(70,13,19,0.5)]"
              >
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover transition duration-[900ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/90 via-brand-deep/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
                  <div>
                    <h2 className="font-display text-3xl font-medium">{d.name}</h2>
                    <p className="mt-1 text-sm text-white/75">{d.tagline}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-gold-light">
                      {d.tripCount} {d.tripCount === 1 ? "package" : "packages"}
                    </p>
                  </div>
                  <span className="grid size-10 place-items-center rounded-full bg-gold-grad text-brand-deep transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>
      </section>
    </>
  );
}
