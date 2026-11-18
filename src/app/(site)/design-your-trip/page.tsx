import { pageMeta } from "@/lib/seo";
import { getContent, getSiteInfo } from "@/lib/cms/queries";
import { PageHero } from "@/components/sections/page-hero";
import { EnquiryForm, type EnquiryField } from "@/components/sections/enquiry-form";

export const generateMetadata = () => pageMeta("design", "/design-your-trip");

const fields: EnquiryField[] = [
  { name: "date", label: "Trip Start Date", type: "date", required: true, half: true },
  { name: "origin", label: "Starting City", type: "select", options: ["Karachi", "Lahore", "Islamabad", "Gilgit"], required: true, half: true },
  { name: "destination", label: "Destination", type: "select", options: ["Hunza", "Fairy Meadows", "Kashmir", "Naran", "Skardu", "Swat"], required: true, half: true },
  { name: "days", label: "Number of Days", type: "select", options: ["6 Days 5 Nights", "7 Days 6 Nights", "8 Days 7 Nights"], required: true, half: true },
  { name: "hotel", label: "Hotel Category", type: "select", options: ["Standard", "Deluxe", "Super Deluxe", "Executive"], required: true, half: true },
  { name: "transport", label: "Transport Type", type: "select", options: ["Car", "Hiace", "Coaster"], required: true, half: true },
  { name: "adults", label: "Adults", type: "number", required: true, half: true },
  { name: "children", label: "Children", type: "number", half: true },
  { name: "rooms", label: "Number of Rooms", type: "number", required: true, half: true },
  { name: "name", label: "Your Name", required: true, half: true },
  { name: "email", label: "Email", type: "email", required: true, half: true },
  { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true, half: true },
];

export default async function DesignYourTripPage() {
  const [s, c] = await Promise.all([getSiteInfo(), getContent()]);
  return (
    <>
      <PageHero eyebrow={c["design.hero.eyebrow"]} title={c["design.hero.title"]} body={c["design.hero.body"]} />
      <section className="mx-auto max-w-3xl px-6 py-24">
        <EnquiryForm topic="Design your trip" fields={fields} submitLabel="Request my itinerary" whatsapp={s.whatsapp} />
        <p className="mt-6 text-center text-sm text-muted">For any query contact us on {s.phone}</p>
      </section>
    </>
  );
}
