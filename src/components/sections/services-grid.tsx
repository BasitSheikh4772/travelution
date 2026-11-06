import Link from "next/link";
import { ArrowRight, BadgeCheck, Compass, FileText, Landmark, Moon, ShieldPlus, UserRoundCheck, type LucideIcon } from "lucide-react";
import type { Service } from "@/lib/wp/types";
import { BlurFade } from "@/components/magicui/blur-fade";
import { MagicCard } from "@/components/magicui/magic-card";
import { BorderBeam } from "@/components/magicui/border-beam";

const icons: Record<Service["icon"], LucideIcon> = {
  private: Compass,
  hajj: Landmark,
  umrah: Moon,
  visa: FileText,
  insurance: ShieldPlus,
  guide: UserRoundCheck,
  hotel: BadgeCheck,
  flight: BadgeCheck,
};

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => {
        const Icon = icons[s.icon] ?? Compass;
        return (
          <BlurFade key={s.slug} delay={(i % 3) * 0.1}>
            <MagicCard dark className="h-full">
              <div className="relative flex h-full flex-col p-8">
                <span aria-hidden className="text-stroke pointer-events-none absolute right-5 top-3 font-display text-8xl font-semibold leading-none text-gold/25 transition-all duration-500 group-hover:text-gold/60">
                  0{i + 1}
                </span>
                <span className="relative grid size-16 place-items-center rounded-2xl bg-gold-grad text-brand-deep shadow-[0_12px_30px_-10px_rgba(247,208,0,0.6)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon className="size-8" />
                  <span className="absolute inset-0 animate-pulse-ring rounded-2xl border border-gold/60" />
                </span>
                <h3 className="mt-7 font-display text-2xl font-medium text-white">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{s.summary}</p>
                <ul className="mt-6 space-y-2.5 text-sm text-white/85">
                  {s.features.map((f, j) => (
                    <li key={f} className="flex items-center gap-3 transition-transform duration-500 group-hover:translate-x-1" style={{ transitionDelay: `${j * 60}ms` }}>
                      <span className="grid size-5 place-items-center rounded-full bg-gold/20 text-gold-light">
                        <BadgeCheck className="size-3.5" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8"><Link
                  href={s.href}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold-light transition-all duration-300 group-hover:border-transparent group-hover:bg-gold-grad group-hover:text-brand-deep"
                >
                  Enquire <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link></div>
              </div>
              {i === 0 && <BorderBeam size={220} duration={9} />}
            </MagicCard>
          </BlurFade>
        );
      })}
    </div>
  );
}
