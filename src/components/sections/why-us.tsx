"use client";

import { motion } from "motion/react";
import { Compass, FileCheck2, Landmark, ShieldCheck, Sparkles } from "lucide-react";
import { Tilt } from "@/components/magicui/tilt";
import { LogoMark } from "@/components/site/logo";
import { SectionHeading } from "./section-heading";

const tiles = [
  {
    title: "Exclusive trips",
    body: "Discover unmatched luxury and adventure with trips built exclusively around you.",
    icon: Sparkles,
    cls: "lg:col-span-2 lg:row-span-2",
    tone: "bg-brand-deep text-white",
    big: true,
  },
  { title: "Professional guides", body: "Expert guidance every step of the way.", icon: Compass, cls: "", tone: "bg-white text-brand" },
  { title: "Visas & insurance", body: "Paperwork and cover handled end-to-end.", icon: FileCheck2, cls: "", tone: "bg-gold-grad text-brand-deep" },
  { title: "Hajj & Umrah", body: "Well-organised journeys with trusted guidance and complete peace of mind.", icon: Landmark, cls: "lg:col-span-2", tone: "bg-brand text-white" },
];

export function WhyUs() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading watermark="Why us" eyebrow="Let’s go together" title="Plan your trip with Travelution." body="One team for the trip, the paperwork and the peace of mind." />
      <div className="mt-14 grid auto-rows-[235px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={t.cls}
          >
            <Tilt max={5} className="h-full">
              <div className={`glow-border shine group relative flex h-full flex-col justify-end overflow-hidden rounded-[1.75rem] border border-line p-7 ${t.tone}`}>
                {t.big && (
                  <>
                    <div className="absolute -right-16 -top-16 size-72 animate-orb rounded-full bg-gold/25 blur-[80px]" />
                    <div className="pointer-events-none absolute right-6 top-6 w-40 opacity-30 transition-opacity duration-500 group-hover:opacity-60">
                      <div className="animate-spin-slow absolute -inset-6 rounded-full border border-dashed border-gold/60" />
                      <LogoMark variant="light" />
                    </div>
                  </>
                )}
                <t.icon className={`absolute left-7 top-7 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12 ${t.big ? "size-10 text-gold-light" : "size-8 opacity-90"}`} />
                <h3 className={`relative font-display font-medium ${t.big ? "text-4xl" : "text-2xl"}`}>{t.title}</h3>
                <p className={`relative mt-2 text-sm leading-relaxed ${t.big ? "max-w-xs text-white/70" : "opacity-75"}`}>{t.body}</p>
                {t.big && (
                  <span className="relative mt-5 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                    <ShieldCheck className="size-4" /> Karachi · Worldwide
                  </span>
                )}
              </div>
            </Tilt>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
