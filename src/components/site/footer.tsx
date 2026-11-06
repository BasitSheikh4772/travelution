import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./logo";
import { Year } from "./year";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Marquee } from "@/components/magicui/marquee";
import { getSiteInfo } from "@/lib/wp/queries";

export async function Footer() {
  const s = await getSiteInfo();
  const socials = [
    ["Facebook", s.social.facebook],
    ["Instagram", s.social.instagram],
    ["YouTube", s.social.youtube],
    ["X", s.social.x],
    ["LinkedIn", s.social.linkedin],
  ] as const;

  return (
    <footer className="relative overflow-hidden bg-brand-deep text-white grain">
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute -right-24 -top-24 size-96 animate-orb rounded-full bg-gold/20 blur-[100px]" />
        <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-6 py-16">
          <h2 className="max-w-2xl font-display text-4xl font-medium leading-[1.05] sm:text-6xl">
            Ready for your next <span className="text-gold-grad">journey?</span>
          </h2>
          <ShimmerButton href="/contact?topic=quote" variant="gold">Request a quote</ShimmerButton>
        </div>
        <div className="border-t border-white/10 py-3 text-white/25">
          <Marquee duration={60}>
            {["Turkey", "Dubai", "Maldives", "Azerbaijan", "Pakistan", "Umrah", "Hajj 2027", "Visas", "Insurance"].map((w) => (
              <span key={w} className="text-stroke px-6 font-display text-5xl font-semibold uppercase">{w}</span>
            ))}
          </Marquee>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Logo variant="light" className="w-56" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Your travel companion from Karachi — private tours, Hajj &amp; Umrah, visas and insurance, designed around you.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {socials.map(([n, h]) => (
              <a
                key={n}
                href={h}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/80 transition hover:border-gold hover:text-gold"
              >
                {n}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Explore</p>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li><Link className="hover:text-gold" href="/">Home</Link></li>
            <li><Link className="hover:text-gold" href="/services">Services</Link></li>
            <li><Link className="hover:text-gold" href="/contact">Contact</Link></li>
            <li><a className="hover:text-gold" href={`${s.wpUrl}/tour-packages/`}>Tour packages ↗</a></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Visit &amp; call</p>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-gold" /><a href={s.mapUrl} target="_blank" rel="noreferrer" className="hover:text-gold">{s.address}</a></li>
            <li className="flex gap-3"><Phone className="size-4 shrink-0 text-gold" /><a href={`tel:${s.phone.replace(/[^+\d]/g, "")}`} className="hover:text-gold">{s.phone}</a></li>
            <li className="flex gap-3"><Mail className="size-4 shrink-0 text-gold" /><a href={`mailto:${s.email}`} className="hover:text-gold">{s.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © <Year /> Travelution. All rights reserved.
      </div>
    </footer>
  );
}
