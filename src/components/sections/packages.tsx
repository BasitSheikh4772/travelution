"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import type { Trip } from "@/lib/wp/types";
import { formatPrice } from "@/lib/wp/format";
import { Tilt } from "@/components/magicui/tilt";
import { SectionHeading } from "./section-heading";

const pretty = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function Packages({
  trips,
  limit = 6,
  heading = true,
}: {
  trips: Trip[];
  limit?: number;
  /** false on the archive page, where PageHero already carries the title */
  heading?: boolean;
}) {
  const [filter, setFilter] = useState("all");
  const groups = useMemo(() => {
    const set = new Set<string>();
    trips.forEach((t) => t.destinationSlugs.forEach((d) => set.add(d)));
    return ["all", ...set];
  }, [trips]);
  const shown = trips.filter((t) => filter === "all" || t.destinationSlugs.includes(filter)).slice(0, limit);

  return (
    <section id="packages" className="relative scroll-mt-24 overflow-hidden bg-[#f4ecdf] py-28">
      <div className="absolute -right-40 top-20 size-[30rem] animate-orb rounded-full bg-gold/20 blur-[110px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-8">
          {heading ? (
            <SectionHeading
              watermark="Tours"
              eyebrow="Best recommended"
              title="Popular packages, crafted for every traveller"
              body="Live from our booking system — always the latest itineraries."
            />
          ) : (
            <div />
          )}
          {groups.length > 2 && (
            <div className="flex flex-wrap gap-2 rounded-full border border-line bg-white/70 p-1.5 backdrop-blur">
              {groups.map((g) => (
                <button key={g} onClick={() => setFilter(g)} className="relative rounded-full px-4 py-2 text-sm font-semibold">
                  {filter === g && (
                    <motion.span layoutId="pkg-filter" className="absolute inset-0 rounded-full bg-brand" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
                  )}
                  <span className={`relative ${filter === g ? "text-gold-light" : "text-brand"}`}>{g === "all" ? "All" : pretty(g)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <motion.div layout className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((t, i) => {
              const price = formatPrice(t);
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: (i % 3) * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Tilt max={6} className="h-full">
                    <Link
                      href={`/trip/${t.slug}`}
                      className="glow-border shine group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_50px_-30px_rgba(70,13,19,0.5)] transition-shadow duration-500 hover:shadow-[0_35px_70px_-25px_rgba(70,13,19,0.6)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {t.image && (
                          <Image
                            src={t.image}
                            alt={t.title}
                            fill
                            unoptimized /* WP host blocks server-side fetches; let the browser load it directly */
                            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                            className="object-cover transition duration-[900ms] ease-out group-hover:scale-110"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/85 via-brand-deep/10 to-transparent" />
                        <span className="absolute left-4 top-4 font-display text-5xl font-semibold leading-none text-white/25">0{i + 1}</span>
                        {t.days && (
                          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                            <Clock className="size-3.5 text-gold-light" /> {t.days} days
                          </span>
                        )}
                        {t.destinationSlugs[0] && (
                          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-gold-grad px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-deep">
                            <MapPin className="size-3.5" /> {pretty(t.destinationSlugs[0])}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="font-display text-[1.35rem] font-medium leading-snug text-brand transition-colors group-hover:text-brand-soft">{t.title}</h3>
                        {t.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{t.excerpt}</p>}
                        <div className="mt-auto flex items-center justify-between border-t border-dashed border-brand/15 pt-5 mt-6">
                          <p className="text-sm">
                            {price ? (
                              <>
                                <span className="block text-[11px] uppercase tracking-widest text-muted">From</span>
                                <span className="font-display text-xl font-semibold text-brand">{price}</span>
                              </>
                            ) : (
                              <>
                                <span className="block text-[11px] uppercase tracking-widest text-muted">Pricing</span>
                                <span className="font-semibold text-brand">On request</span>
                              </>
                            )}
                          </p>
                          <span className="inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand py-2.5 pl-2.5 pr-2.5 text-sm font-semibold text-white transition-all duration-500 group-hover:bg-brand-soft group-hover:pl-5">
                            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-500 group-hover:max-w-24 group-hover:opacity-100">View trip</span>
                            <span className="grid size-7 place-items-center rounded-full bg-gold-grad text-brand-deep transition-transform duration-500 group-hover:rotate-45">
                              <ArrowUpRight className="size-4" />
                            </span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Tilt>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
