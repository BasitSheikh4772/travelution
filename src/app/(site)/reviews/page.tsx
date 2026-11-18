import { pageMeta } from "@/lib/seo";
import { getContent, getReviews } from "@/lib/cms/queries";
import { PageHero } from "@/components/sections/page-hero";
import { ReviewsGallery } from "@/components/sections/reviews-gallery";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL, abs } from "@/lib/seo";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export const generateMetadata = () => pageMeta("reviews", "/reviews");

export default async function ReviewsPage() {
  const [reviews, c] = await Promise.all([getReviews(), getContent()]);
  return (
    <>
      <PageHero eyebrow={c["reviews.hero.eyebrow"]} title={c["reviews.hero.title"]} body={c["reviews.hero.body"]} />
      {reviews.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Travelution client video reviews",
            itemListElement: reviews.map((r, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "VideoObject",
                name: r.title,
                description: r.quote || `Video review${r.name ? ` by ${r.name}` : ""} of a Travelution trip.`,
                thumbnailUrl: abs(r.poster || "/logo.png"),
                contentUrl: abs(r.video),
                uploadDate: r.createdAt,
                publisher: { "@id": `${SITE_URL}/#organization` },
              },
            })),
          }}
        />
      )}
      <section className="mx-auto max-w-6xl px-6 py-20">
        {reviews.length ? (
          <ReviewsGallery reviews={reviews} />
        ) : (
          <p className="text-center text-muted">Client reviews are coming soon.</p>
        )}
        <div className="mt-16 text-center">
          <p className="text-muted">Planning your own trip?</p>
          <div className="mt-5"><ShimmerButton href="/contact?topic=quote">Talk to us</ShimmerButton></div>
        </div>
      </section>
    </>
  );
}
