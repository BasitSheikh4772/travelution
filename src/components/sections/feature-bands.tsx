import Image from "next/image";
import { ArrowRight, Landmark, Route } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Marquee } from "@/components/magicui/marquee";
import { Globe } from "@/components/magicui/globe";

export function PrivateTour() {
  const steps = ["Share your budget & style", "We design the itinerary", "Confirm and travel stress-free"];
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <BlurFade>
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-deep p-8 text-white sm:p-14 grain">
          <div className="absolute -right-24 -top-24 size-96 animate-orb rounded-full bg-gold/20 blur-[100px]" />
          <div className="absolute -bottom-32 -left-10 size-96 animate-orb rounded-full bg-brand-soft/70 blur-[100px] [animation-delay:-7s]" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                <Route className="size-4" /> Private trip designer
              </p>
              <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] sm:text-6xl">
                Design your <span className="text-gold-grad">private tour.</span>
              </h2>
              <p className="mt-5 max-w-xl text-white/75">
                Planning the perfect trip can feel overwhelming. We handle destinations, transport, hotels and experiences — a fully personalised
                plan based on your preferences, budget and travel style.
              </p>
              <ol className="mt-8 space-y-3">
                {steps.map((s, i) => (
                  <BlurFade key={s} delay={0.1 * i}>
                    <li className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur transition hover:border-gold/40 hover:bg-white/10">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold-grad font-display text-base font-semibold text-brand-deep">{i + 1}</span>
                      <span className="text-sm font-medium">{s}</span>
                    </li>
                  </BlurFade>
                ))}
              </ol>
              <div className="mt-8">
                <ShimmerButton href="/contact?topic=private-trip" variant="gold">
                  Design your trip <ArrowRight className="size-4" />
                </ShimmerButton>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md">
              <Globe className="relative" />
              <p className="mt-2 text-center text-xs uppercase tracking-[0.25em] text-white/50">Flights from Karachi · drag to spin</p>
            </div>
          </div>
          <BorderBeam size={300} duration={10} />
        </div>
      </BlurFade>
    </section>
  );
}

export function HajjBanner({ image }: { image: string }) {
  return (
    <section className="relative isolate overflow-hidden py-32 text-white">
      <Image src={image} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(42,7,11,0.95),rgba(70,13,19,0.75)_55%,rgba(42,7,11,0.45))]" />
      <div className="pointer-events-none absolute -right-40 top-1/2 -z-10 size-[34rem] -translate-y-1/2">
        <div className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-gold/40" />
        <div className="absolute inset-12 animate-spin-slow rounded-full border border-gold/25 [animation-direction:reverse]" />
        <div className="absolute inset-28 rounded-full border border-gold/20" />
      </div>
      <div className="mx-auto max-w-6xl px-6">
        <BlurFade>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            <Landmark className="size-4" /> Hajj 2027 registration
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.05] sm:text-6xl">
            Your Hajj journey <span className="text-gold-grad">begins here.</span>
          </h2>
          <p className="mt-5 max-w-xl text-white/75">
            Experience a well-organised Hajj with trusted guidance, premium services and complete peace of mind.
          </p>
          <div className="mt-8">
            <ShimmerButton href="/contact?topic=hajj-2027" variant="gold">
              Start your Hajj journey <ArrowRight className="size-4" />
            </ShimmerButton>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

export function WordBand({ words }: { words: string[] }) {
  const row = (rev?: boolean) => (
    <Marquee duration={55} reverse={rev}>
      {words.map((w) => (
        <span key={w} className="inline-flex items-center gap-8 px-4 font-display text-3xl font-medium text-brand/80 sm:text-4xl">
          {w} <span className="text-gold">✦</span>
        </span>
      ))}
    </Marquee>
  );
  return (
    <div className="overflow-hidden border-y border-gold/30 bg-white py-3">
      {row()}
      {row(true)}
    </div>
  );
}
