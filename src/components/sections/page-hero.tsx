import { Meteors } from "@/components/magicui/meteors";
import { BlurFade } from "@/components/magicui/blur-fade";
import { FlightPath } from "@/components/magicui/flight-path";
import { LogoMark } from "@/components/site/logo";

export function PageHero({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-deep pb-24 pt-44 text-white grain">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_80%_0%,rgba(107,26,35,0.9),transparent_60%)]" />
      <div className="absolute -left-24 top-10 -z-10 size-96 animate-orb rounded-full bg-gold/25 blur-[100px]" />
      <div className="absolute -right-20 bottom-0 -z-10 size-96 animate-orb rounded-full bg-brand-soft/80 blur-[100px] [animation-delay:-5s]" />
      <FlightPath className="pointer-events-none absolute inset-0 -z-10 opacity-50" />
      <div className="absolute inset-0 -z-10 opacity-50">
        <Meteors number={8} />
      </div>
      <div className="pointer-events-none absolute -right-10 top-1/2 -z-10 hidden w-[26rem] -translate-y-1/2 opacity-[0.12] lg:block">
        <div className="animate-spin-slow absolute -inset-12 rounded-full border border-dashed border-gold" />
        <LogoMark variant="light" />
      </div>
      <div className="mx-auto max-w-6xl px-6">
        <BlurFade inView={false} delay={0.2}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">{eyebrow}</p>
        </BlurFade>
        <BlurFade inView={false} delay={0.3}>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl">{title}</h1>
        </BlurFade>
        <BlurFade inView={false} delay={0.45}>
          <p className="mt-6 max-w-xl text-lg text-white/75">{body}</p>
        </BlurFade>
      </div>
    </section>
  );
}
