import { connection } from "next/server";
import Link from "next/link";
import { ALL_KEYS, readDb } from "@/lib/cms/db";
import { PageTitle, btn } from "@/components/admin/shell";

// Per-request admin screen: skip instant-navigation validation (dev overlay insight)
export const instant = false;

export default async function Dashboard() {
  await connection(); // admin screens always render per request
  const db = await readDb(ALL_KEYS);
  const unread = db.leads.filter((l) => !l.read).length;
  const stats = [
    { href: "/admin/reviews", label: "Video reviews", n: db.reviews.length, sub: `${db.reviews.filter((r) => r.published).length} visible` },
    { href: "/admin/trips", label: "Tour packages", n: db.trips.length, sub: `${db.trips.filter((r) => r.published).length} visible` },
    { href: "/admin/destinations", label: "Destinations", n: db.destinations.length, sub: `${db.destinations.filter((r) => r.published).length} visible` },
    { href: "/admin/visas", label: "Visa guides", n: db.visas.length, sub: "PDF downloads" },
    { href: "/admin/enquiries", label: "Enquiries", n: db.leads.length, sub: unread ? `${unread} new` : "none new" },
  ];
  return (
    <>
      <PageTitle title="Dashboard" sub="Everything on the website is edited from here. Changes go live immediately." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.href} href={s.href} className="rounded-2xl border border-line bg-white p-5 transition hover:border-brand">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-dark">{s.label}</p>
            <p className="mt-2 font-display text-4xl text-brand">{s.n}</p>
            <p className="text-sm text-muted">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link className={btn} href="/admin/reviews/new">+ Add review video</Link>
        <Link className={btn} href="/admin/trips/new">+ Add tour package</Link>
        <Link className={btn} href="/admin/pages">Edit page text</Link>
      </div>

      <h2 className="mt-12 font-display text-2xl text-brand">Latest enquiries</h2>
      <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {db.leads.slice(0, 5).map((l) => (
          <Link key={l.id} href="/admin/enquiries" className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm hover:bg-brand/5">
            <span className="min-w-0"><b className={l.read ? "font-medium" : "font-bold text-brand"}>{l.name}</b> <span className="text-muted">— {l.topic || "General"}</span></span>
            <time className="shrink-0 text-xs text-muted">{new Date(l.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</time>
          </Link>
        ))}
        {!db.leads.length && <p className="px-5 py-6 text-sm text-muted">No enquiries yet. Messages sent from the website contact and enquiry forms appear here.</p>}
      </div>
    </>
  );
}
