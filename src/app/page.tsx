import { getDestinations, getSiteInfo, getTrips } from "@/lib/wp/queries";
import { hajjImage, heroImage } from "@/lib/wp/fallback";
import { Hero } from "@/components/sections/hero";
import { Destinations } from "@/components/sections/destinations";
import { Packages } from "@/components/sections/packages";
import { WhyUs } from "@/components/sections/why-us";
import { HajjBanner, PrivateTour, WordBand } from "@/components/sections/feature-bands";

export default async function Home() {
  const [destinations, trips, site] = await Promise.all([getDestinations(), getTrips({ limit: 9 }), getSiteInfo()]);

  return (
    <>
      <Hero image={heroImage} />
      <WordBand words={["Turkey", "Dubai", "Maldives", "Azerbaijan", "Pakistan", "Umrah", "Hajj 2027", "Visas"]} />
      <Destinations items={destinations} wpUrl={site.wpUrl} />
      <PrivateTour />
      <Packages trips={trips} />
      <WhyUs />
      <HajjBanner image={hajjImage} />
    </>
  );
}
