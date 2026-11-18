import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getDestinationBySlug, getDestinations, getTripsByDestination } from "@/lib/cms/queries";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL, abs, breadcrumb } from "@/lib/seo";
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
  const description = `${d.name} tour packages by Travelution — ${d.tagline}.`;
  return {
    title: `${d.name} Tour Packages`,
    description,
    alternates: { canonical: `/destinations/${d.slug}` },
    openGraph: { title: `${d.name} Tour Packages | Travelution`, description, url: `/destinations/${d.slug}`, images: [{ url: abs(d.image) }] },
    twitter: { card: "summary_large_image", title: `${d.name} Tour Packages`, description, images: [abs(d.image)] },
  };
}

export default function DestinationPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-[70vh] bg-brand-deep" />}>
      <DestinationContent params={params} />
    </Suspense>
  );
}

async function DestinationContent({ params }: Props) {
  const { slug } = await params;
  const dest = await getDestinationBySlug(slug);
  if (!dest) notFound();
  const trips = await getTripsByDestination(slug);

  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "TouristDestination", name: dest.name, description: dest.tagline, image: abs(dest.image), url: `${SITE_URL}/destinations/${dest.slug}` },
          breadcrumb([["Home", "/"], ["Destinations", "/destinations"], [dest.name, `/destinations/${dest.slug}`]]),
        ]}
      />
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
