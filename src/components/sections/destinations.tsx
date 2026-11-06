"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Destination } from "@/lib/wp/types";
import { Tilt } from "@/components/magicui/tilt";
import { SectionHeading } from "./section-heading";

export function Destinations({ items, wpUrl }: { items: Destination[]; wpUrl: string }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        watermark="Places"
        eyebrow="Top destinations"
        title="Where will you wake up next?"
        body="From Cappadocia skies to the Karakoram, pick a place — we handle the rest."
      />
      <div className="mt-12 grid auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 6).map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 50, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""} ${i === 3 || i >= 4 ? "lg:col-span-2" : ""}`}
          >
            <Tilt max={5} className="h-full">
              <motion.a
                href={`${wpUrl}/destinations/${d.slug}/`}
                whileHover="hover"
                className="glow-border shine group relative isolate block h-full overflow-hidden rounded-3xl bg-brand"
              >
                <motion.div variants={{ hover: { scale: 1.1 } }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 -z-10">
                  <Image src={d.image} alt={d.name} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
                </motion.div>
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-deep/90 via-brand-deep/10 to-transparent transition-opacity group-hover:opacity-90" />
                <div className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-t from-gold/30 to-transparent transition-transform duration-500 group-hover:translate-y-0" />
                <div className="flex h-full flex-col justify-end p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold">{d.tagline}</p>
                  <div className="mt-1 flex items-end justify-between">
                    <h3 className={`font-display font-medium ${i === 0 ? "text-5xl" : "text-3xl"}`}>{d.name}</h3>
                    <span className="grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur transition duration-300 group-hover:rotate-45 group-hover:bg-gold-light group-hover:text-brand-deep">
                      <ArrowUpRight className="size-5" />
                    </span>
                  </div>
                  {d.tripCount > 0 && <p className="mt-1 text-sm text-white/70">{d.tripCount} {d.tripCount === 1 ? "tour" : "tours"}</p>}
                </div>
              </motion.a>
            </Tilt>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
