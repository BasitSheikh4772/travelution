import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getSiteInfo } from "@/lib/wp/queries";
import { PageHero } from "@/components/sections/page-hero";
import { EnquiryForm, type EnquiryField } from "@/components/sections/enquiry-form";
import { SectionHeading } from "@/components/sections/section-heading";

export const metadata: Metadata = {
  title: "Hajj 2027 Registration",
  description: "Register for Hajj 2027 with Travelution — visa assistance, group travel support and a dedicated team.",
};

const steps = [
  ["Submit Inquiry", "Share your details with our team to begin."],
  ["Package Details", "Receive information on packages, pricing and requirements."],
  ["Document / Payment", "Complete registration with consultant guidance."],
  ["Prepare For Your Journey", "Attend briefings and get ready."],
];

const included = ["Accommodation", "Transportation", "Visa Assistance", "Documentation Support", "Group Coordination", "Airport Assistance", "Pre-Departure Briefing", "Dedicated Support Team"];

const fields: EnquiryField[] = [
  { name: "name", label: "Full Name", required: true, half: true },
  { name: "email", label: "Email Address", type: "email", required: true, half: true },
  { name: "phone", label: "Phone Number", type: "tel", required: true, half: true },
  { name: "dob", label: "Date of Birth", type: "date", half: true },
  { name: "gender", label: "Gender", type: "radio", options: ["Male", "Female"] },
  { name: "adults", label: "Adults", type: "number", half: true },
  { name: "children", label: "Children", type: "number", half: true },
  { name: "infants", label: "Infants", type: "number", half: true },
  { name: "address", label: "Address", half: true },
  { name: "notes", label: "Special Instructions", type: "textarea" },
];

export default async function HajjPage() {
  const s = await getSiteInfo();
  return (
    <>
      <PageHero eyebrow="Hajj 2027" title="Begin your blessed journey." body="Trusted guidance, premium accommodation and peace of mind — visa and documentation handled by our team." />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading watermark="Steps" eyebrow="How it works" title="Your spiritual journey in four steps" body="" />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-3xl border border-line bg-white p-6">
              <span className="font-display text-4xl text-gold-dark">0{i + 1}</span>
              <h3 className="mt-2 font-display text-xl text-brand">{t}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="package" className="scroll-mt-24 bg-[#f4ecdf] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-4xl font-medium text-brand">Package details</h2>
          <div className="mt-8 rounded-3xl border border-line bg-white p-8 sm:max-w-md">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-dark">16 days · 5 star hotels</p>
            <p className="mt-2 font-display text-2xl text-brand">Maktab A – Zone 1</p>
            <p className="mt-3 text-sm text-muted">PKR 2,750,000/- · USD 8,600 (without ticket)</p>
          </div>
          <h3 className="mt-14 font-display text-3xl text-brand">Everything included</h3>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {included.map((i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-foreground/80"><Check className="size-4 text-gold-dark" /> {i}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="mb-8 font-display text-4xl font-medium text-brand">Registration form</h2>
        <EnquiryForm topic="Hajj 2027 registration" fields={fields} submitLabel="Register now" whatsapp={s.whatsapp} consent="I agree to the Terms & Conditions" />
      </section>
    </>
  );
}
