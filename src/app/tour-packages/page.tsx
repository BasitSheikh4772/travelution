import type { Metadata } from "next";
import { getAllTrips } from "@/lib/wp/queries";
import { PageHero } from "@/components/sections/page-hero";
import { Packages } from "@/components/sections/packages";

export const metadata: Metadata = {
  title: "Tour Packages",
  description: "Browse every Travelution tour — Pakistan northern valleys, Turkey, Azerbaijan, Europe, Singapore and Umrah packages.",
};

export default async function TourPackagesPage() {
  const trips = await getAllTrips();
  return (
    <>
      <PageHero
        eyebrow="Tour packages"
        title="Every itinerary, in one place."
        body="From weekend escapes to two-week journeys — pick a package or ask us to tailor one."
      />
      <Packages trips={trips} limit={60} heading={false} />
    </>
  );
}
