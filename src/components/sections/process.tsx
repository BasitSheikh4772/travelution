"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { CheckCircle2, MessageCircle, PenTool, Plane } from "lucide-react";
import { SectionHeading } from "./section-heading";

const steps = [
  { icon: MessageCircle, title: "Tell us", body: "Share your destination, dates, group size and budget — by form, call or WhatsApp." },
  { icon: PenTool, title: "We design", body: "A consultant builds your itinerary: flights, stays, transport, experiences and paperwork." },
  { icon: CheckCircle2, title: "You confirm", body: "Review, tweak and approve. We handle bookings and every document." },
  { icon: Plane, title: "Travel", body: "Fly with confidence; we’re reachable throughout your trip." },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const line = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const plane = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative overflow-hidden bg-[#f4ecdf] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading watermark="Steps" eyebrow="How it works" title="Four steps from idea to boarding pass." />
        <div ref={ref} className="relative mt-20">
          {/* connecting route (desktop) */}
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-brand/15 md:block">
            <motion.div style={{ width: line }} className="h-full bg-gold-grad" />
            <motion.span style={{ left: plane }} className="absolute -top-3 -translate-x-1/2 text-gold-dark">
              <Plane className="size-6 fill-gold-light text-gold-dark" />
            </motion.span>
          </div>
          <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                <span className="relative z-10 grid size-16 place-items-center rounded-full bg-brand-deep text-gold-light shadow-[0_12px_30px_-10px_rgba(42,7,11,0.8)] ring-4 ring-[#f4ecdf] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <s.icon className="size-7" />
                </span>
                <div className="glow-border mt-6 rounded-3xl border border-line bg-white p-6 shadow-[0_20px_40px_-30px_rgba(70,13,19,0.5)] transition-transform duration-500 group-hover:-translate-y-1.5">
                  <span className="text-stroke font-display text-5xl font-semibold text-brand/30">0{i + 1}</span>
                  <h3 className="mt-1 font-display text-2xl text-brand">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
