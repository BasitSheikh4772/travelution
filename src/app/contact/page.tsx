import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getSiteInfo } from "@/lib/wp/queries";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/sections/contact-form";
import { BlurFade } from "@/components/magicui/blur-fade";
import { MagicCard } from "@/components/magicui/magic-card";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a quote or talk to a Travelution travel consultant — Karachi office, phone, email and WhatsApp.",
};

export default async function ContactPage() {
  const s = await getSiteInfo();
  const cards = [
    { icon: Phone, label: "Call us", value: s.phone, href: `tel:${s.phone.replace(/[^+\d]/g, "")}` },
    { icon: Phone, label: "Landline", value: s.phoneAlt, href: `tel:${s.phoneAlt.replace(/[^+\d]/g, "")}` },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat with a consultant", href: `https://wa.me/${s.whatsapp}` },
    { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    { icon: MapPin, label: "Visit us", value: s.address, href: s.mapUrl },
  ];

  return (
    <>
      <PageHero eyebrow="Contact" title="Let’s plan your next journey." body="Tell us where you want to go. A consultant replies with ideas, not a sales script." />
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.4fr_1fr]">
        <BlurFade>
          <Suspense fallback={<div className="h-[560px] rounded-[2rem] border border-line bg-white" />}>
            <ContactForm whatsapp={s.whatsapp} />
          </Suspense>
        </BlurFade>
        <div className="space-y-4">
          {cards.map((c, i) => (
            <BlurFade key={c.label} delay={0.08 * i}>
              <MagicCard dark>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex items-start gap-4 p-5"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold-grad text-brand-deep transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <c.icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-gold">{c.label}</span>
                    <span className="mt-1 block text-sm font-medium leading-snug text-white">{c.value}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-white/40 transition group-hover:rotate-45 group-hover:text-gold-light" />
                </a>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      </section>
    </>
  );
}
