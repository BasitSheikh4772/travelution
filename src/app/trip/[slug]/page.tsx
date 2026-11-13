import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, MapPin } from "lucide-react";
import { getAllTrips, getTripBySlug, getSiteInfo } from "@/lib/wp/queries";
import { formatPrice } from "@/lib/wp/format";
import { PageHero } from "@/components/sections/page-hero";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const trips = await getAllTrips();
  return trips.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTripBySlug(slug);
  if (!t) return {};
  return { title: t.title, description: t.excerpt || undefined };
}

const pretty = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default async function TripPage({ params }: Props) {
  const { slug } = await params;
  const [trip, site] = await Promise.all([getTripBySlug(slug), getSiteInfo()]);
  if (!trip) notFound();
  const price = formatPrice(trip);
  const waText = encodeURIComponent(`Hi Travelution, I'd like to book: ${trip.title}`);

  return (
    <>
      <PageHero eyebrow={trip.destinationSlugs.map(pretty).join(" · ") || "Tour package"} title={trip.title} body={trip.excerpt || "Contact us for the full itinerary."} />
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.6fr_1fr]">
        <div>
          {trip.image && (
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem]">
              <Image src={trip.image} alt={trip.title} fill unoptimized priority sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
            </div>
          )}
          {trip.description && (
            <div className="mt-10">
              <h2 className="font-display text-3xl font-medium text-brand">Overview</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">{trip.description}</p>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-[2rem] border border-line bg-white p-7 shadow-[0_20px_50px_-30px_rgba(70,13,19,0.5)] lg:sticky lg:top-28">
          <p className="text-[11px] uppercase tracking-widest text-muted">{price ? "From" : "Pricing"}</p>
          <p className="font-display text-4xl font-semibold text-brand">{price ?? "On request"}</p>
          <ul className="mt-5 space-y-2 text-sm text-foreground/80">
            {trip.days && (
              <li className="flex items-center gap-2"><Clock className="size-4 text-gold" /> {trip.days} days{trip.nights ? ` / ${trip.nights} nights` : ""}</li>
            )}
            {trip.destinationSlugs[0] && (
              <li className="flex items-center gap-2"><MapPin className="size-4 text-gold" /> {pretty(trip.destinationSlugs[0])}</li>
            )}
          </ul>
          <div className="mt-6 grid gap-3">
            <ShimmerButton href={`/contact?topic=quote&trip=${encodeURIComponent(trip.title)}`}>Enquire / Book</ShimmerButton>
            <a
              href={`https://wa.me/${site.whatsapp}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brand/20 px-5 py-3 text-center text-sm font-semibold text-brand transition hover:bg-brand/5"
            >
              Chat on WhatsApp
            </a>
          </div>
          <p className="mt-4 text-xs text-muted">Online checkout is still handled on our main site; for now bookings are confirmed by a consultant.</p>
        </aside>
      </section>
    </>
  );
}
