"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/tour-packages", label: "Tour Packages" },
  { href: "/destinations", label: "Destinations" },
  { href: "/services", label: "Services" },
  { href: "/about-us", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/hajj-registration-2027", label: "Hajj 2027" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // every page opens with a dark hero, so the bar is light-on-dark until the user scrolls
  const onDark = !scrolled;

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-full border px-3 py-2 pl-5 backdrop-blur-xl transition-all duration-500",
          scrolled
            ? "border-line bg-white/95 shadow-[0_10px_40px_-15px_rgba(70,13,19,0.35)]"
            : onDark
              ? "border-gold/30 bg-brand-deep/40"
              : "border-line bg-white/60",
        )}
      >
        <Link href="/" aria-label="Travelution home" className="block w-36 sm:w-44">
          <Logo variant={onDark ? "light" : "color"} priority className="w-full" />
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {links.map((l) => {
            const active = l.href === "/" ? path === "/" : path === l.href || path.startsWith(`${l.href}/`);
            return (
              <li key={l.href} className="relative">
                <Link
                  href={l.href}
                  className={cn(
                    "relative z-10 block rounded-full px-3 py-2 text-[13px] font-medium transition-colors",
                    onDark ? "text-white/85 hover:text-white" : "text-foreground/70 hover:text-brand",
                    active && (onDark ? "text-white" : "text-brand"),
                  )}
                >
                  {l.label}
                </Link>
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className={cn("absolute inset-0 rounded-full", onDark ? "bg-white/15" : "bg-brand/8")}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/contact?topic=quote"
            className="hidden items-center gap-2 rounded-full bg-gold-grad animate-gradient px-5 py-2.5 text-sm font-semibold text-brand-deep transition hover:scale-105 xl:inline-flex"
          >
            <Phone className="size-4" /> Request a quote
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cn("grid size-10 place-items-center rounded-full lg:hidden", onDark ? "text-white" : "text-brand")}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="absolute inset-x-4 top-20 rounded-3xl border border-line bg-white/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-lg font-medium text-brand hover:bg-brand/5">
                {l.label}
              </Link>
            ))}
            <Link href="/contact?topic=quote" onClick={() => setOpen(false)} className="mt-2 block rounded-2xl bg-brand px-4 py-3 text-center font-semibold text-white">
              Request a quote
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
