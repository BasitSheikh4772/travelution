import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDestinationBySlug, getDestinations, getTripsByDestination } from "@/lib/wp/queries";
import { PageHero } from "@/components/sections/page-hero";
import { Packages } from "@/components/sections/packages";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const all = await getDestinations();
  return all.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDestinationBySlug(slug);
  if (!d) return {};
  return { title: d.name, description: `${d.name} tour packages by Travelution — ${d.tagline}.` };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const dest = await getDestinationBySlug(slug);
  if (!dest) notFound();
  const trips = await getTripsByDestination(slug);

  return (
    <>
      <PageHero eyebrow="Destination" title={dest.name} body={`${dest.tagline}. Every ${dest.name} package we run, in one place.`} />
      {trips.length ? (
        <Packages trips={trips} limit={60} heading={false} />
      ) : (
        <section className="mx-auto max-w-3xl px-6 py-28 text-center">
          <h2 className="font-display text-4xl font-medium text-brand">No fixed packages yet</h2>
          <p className="mt-4 text-muted">We design {dest.name} trips on request — tell us your dates and we’ll send an itinerary.</p>
          <div className="mt-8">
            <ShimmerButton href={`/contact?topic=quote`}>Request a quote</ShimmerButton>
          </div>
        </section>
      )}
    </>
  );
}
