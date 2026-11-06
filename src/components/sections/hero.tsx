"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from "motion/react";
import { ArrowRight, Compass, FileCheck2, Landmark, Route } from "lucide-react";
import { TextReveal } from "@/components/magicui/text-reveal";
import { RotatingWords } from "@/components/magicui/rotating-words";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { FlightPath } from "@/components/magicui/flight-path";
import { Tilt } from "@/components/magicui/tilt";
import { LogoMark } from "@/components/site/logo";

const stats = [
  { value: 12, suffix: "+", label: "Years experience" },
  { value: 8000, suffix: "+", label: "Tours completed" },
  { value: 19000, suffix: "+", label: "Happy travellers" },
  { value: 97, suffix: "%", label: "Retention rate" },
];

const cards = [
  { icon: Landmark, title: "Hajj 2027", sub: "Registration open", cls: "lg:top-[14%] lg:right-8", delay: "0s" },
  { icon: Route, title: "Private trips", sub: "Designed around you", cls: "lg:top-[64%] lg:left-0", delay: "1.2s" },
  { icon: FileCheck2, title: "Visas & insurance", sub: "Handled end-to-end", cls: "lg:top-[76%] lg:right-2", delay: "2.4s" },
];

export function Hero({ image }: { image: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(247,208,0,0.16), transparent 70%)`;

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (r) { mx.set(e.clientX - r.left); my.set(e.clientY - r.top); }
      }}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-brand-deep text-white grain"
    >
      <motion.div style={{ y }} className="absolute inset-0 -z-30">
        <motion.div initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(105deg,rgba(42,7,11,0.94)_6%,rgba(70,13,19,0.7)_45%,rgba(42,7,11,0.3)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-20 h-1/2 bg-gradient-to-t from-brand-deep to-transparent" />

      {/* drifting brand-colour orbs */}
      <div className="absolute -left-32 top-20 -z-10 size-[28rem] animate-orb rounded-full bg-gold/25 blur-[110px]" />
      <div className="absolute -right-24 bottom-10 -z-10 size-[30rem] animate-orb rounded-full bg-brand-soft/70 blur-[120px] [animation-delay:-6s]" />
      <motion.div className="pointer-events-none absolute inset-0 -z-10" style={{ background: glow }} />
      <FlightPath className="pointer-events-none absolute inset-0 -z-10 opacity-90" />

      <motion.div style={{ opacity: fade }} className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-10 pt-36">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-gold" />
            <span className="relative size-2 rounded-full bg-gold-light" />
          </span>
          The Future of Travel · Karachi
        </motion.p>

        <div className="max-w-3xl font-display text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.4rem]">
          <TextReveal text="Wake up in" as="h1" delay={2.1} className="" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}>
            <RotatingWords words={["Istanbul.", "Dubai.", "the Maldives.", "Hunza.", "Baku.", "Makkah."]} />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.7 }}
          className="mt-7 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
        >
          Destinations, transport, hotels and experiences — handled for you. Tell us your budget and travel style; we design a trip that’s exclusively yours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.7 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <ShimmerButton href="/contact?topic=private-trip" variant="gold">
            Design your private tour <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </ShimmerButton>
          <a href="#packages" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold backdrop-blur transition hover:border-gold hover:text-gold">
            <Compass className="size-4" /> Explore packages
          </a>
        </motion.div>

        {/* floating glass cards (desktop) */}
        <div className="pointer-events-none absolute inset-y-0 right-6 hidden w-[28rem] lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
            animate={{ opacity: 0.9, scale: 1, rotate: 0 }}
            transition={{ delay: 3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-24 top-[40%] w-40 -translate-y-1/2"
          >
            <div className="animate-spin-slow absolute -inset-10 rounded-full border border-dashed border-gold/30" />
            <LogoMark variant="light" />
          </motion.div>
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2 + i * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`pointer-events-auto absolute ${c.cls}`}
            >
              <Tilt max={14}>
                <div className="animate-float flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl" style={{ animationDelay: c.delay }}>
                  <span className="grid size-10 place-items-center rounded-xl bg-gold-grad text-brand-deep"><c.icon className="size-5" /></span>
                  <span>
                    <span className="block text-sm font-semibold">{c.title}</span>
                    <span className="block text-xs text-white/65">{c.sub}</span>
                  </span>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="relative border-t border-white/10 bg-black/25 backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 h-px bg-gold-grad opacity-70" />
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 px-6 py-7 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="md:border-l md:border-white/15 md:pl-8 first:md:border-0 first:md:pl-0">
              <dt className="order-2 text-xs uppercase tracking-[0.18em] text-white/60">{s.label}</dt>
              <dd className="font-display text-4xl font-medium text-gold-grad">
                <NumberTicker value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
