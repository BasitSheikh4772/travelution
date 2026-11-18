import Link from "next/link";
import { connection } from "next/server";
import { CircleHelp, ExternalLink, FileText, Globe2, Inbox, LayoutDashboard, LogOut, MapPinned, Package, Settings, Sparkles, Video } from "lucide-react";
import { isAdmin } from "@/lib/cms/auth";
import { logout } from "@/lib/cms/actions";
import { LoginForm } from "./login-form";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reviews", label: "Reviews (videos)", icon: Video },
  { href: "/admin/trips", label: "Tour packages", icon: Package },
  { href: "/admin/destinations", label: "Destinations", icon: MapPinned },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/visas", label: "Visa guides", icon: FileText },
  { href: "/admin/faqs", label: "FAQs", icon: CircleHelp },
  { href: "/admin/pages", label: "Page content & SEO", icon: Globe2 },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
];

export async function AdminShell({ children }: { children: React.ReactNode }) {
  await connection(); // session check uses the clock → always request-time
  if (!(await isAdmin())) return <LoginForm />;
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[250px_1fr]">
      <aside className="bg-brand-deep text-white md:sticky md:top-0 md:h-dvh md:overflow-y-auto">
        <div className="flex items-center justify-between gap-3 px-5 py-5 md:block">
          <div>
            <p className="font-display text-2xl">Travelution</p>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Admin portal</p>
          </div>
          <a href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-gold md:mt-4">
            <ExternalLink className="size-3.5" /> View website
          </a>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-6">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white">
              <n.icon className="size-4 text-gold" /> {n.label}
            </Link>
          ))}
          <form action={logout} className="md:mt-6">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white">
              <LogOut className="size-4" /> Sign out
            </button>
          </form>
        </nav>
      </aside>
      <main className="min-w-0 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}

export function PageTitle({ title, children, sub }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-4xl font-medium text-brand">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-sm text-muted">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
      {children}
    </p>
  );
}

export const btn = "inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-soft";
export const btnGhost = "inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-brand transition hover:border-brand";
export const inputCls = "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm";
