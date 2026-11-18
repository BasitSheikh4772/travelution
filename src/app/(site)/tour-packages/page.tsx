import { pageMeta } from "@/lib/seo";
import { getAllTrips, getContent } from "@/lib/cms/queries";
import { PageHero } from "@/components/sections/page-hero";
import { Packages } from "@/components/sections/packages";

export const generateMetadata = () => pageMeta("tours", "/tour-packages");

export default async function TourPackagesPage() {
  const [trips, c] = await Promise.all([getAllTrips(), getContent()]);
  return (
    <>
      <PageHero eyebrow={c["tours.hero.eyebrow"]} title={c["tours.hero.title"]} body={c["tours.hero.body"]} />
      <Packages trips={trips} limit={60} heading={false} />
    </>
  );
}
