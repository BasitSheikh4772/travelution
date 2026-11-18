import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUp, Eye, EyeOff, ImageOff, Pencil, Plus, Video } from "lucide-react";
import { readDb } from "@/lib/cms/db";
import { ENTITIES, type EntityKey } from "@/lib/cms/admin-schema";
import { moveEntity, togglePublished } from "@/lib/cms/actions";
import { Notice, PageTitle, btn, btnGhost } from "@/components/admin/shell";

type Item = Record<string, unknown> & { id: string | number; published?: boolean };

// Per-request admin screen: skip instant-navigation validation (dev overlay insight)
export const instant = false;

export default async function EntityList({ params, searchParams }: { params: Promise<{ entity: string }>; searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  await connection(); // admin screens always render per request
  const { entity } = await params;
  if (!(entity in ENTITIES)) notFound();
  const key = entity as EntityKey;
  const def = ENTITIES[key];
  const sp = await searchParams;
  const db = await readDb();
  let items = db[key] as unknown as Item[];
  if (key === "reviews") items = [...items].sort((a, b) => Number(a.order) - Number(b.order));

  return (
    <>
      <PageTitle title={def.title} sub={def.blurb}>
        <Link href={`/admin/${key}/new`} className={btn}><Plus className="size-4" /> Add {def.singular}</Link>
      </PageTitle>
      {sp.saved !== undefined && <Notice>Saved{sp.saved ? ` “${sp.saved}”` : ""}. It’s live on the website.</Notice>}
      {sp.deleted && <Notice>Deleted.</Notice>}

      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {items.map((it, i) => {
          const img = def.imageField ? (it[def.imageField] as string | null) : null;
          const sub =
            key === "trips" ? [it.days ? `${it.days} days` : "", (it.destinationSlugs as string[] | undefined)?.join(", ")].filter(Boolean).join(" · ")
            : key === "reviews" ? String(it.name || it.video).split("/").pop()
            : key === "destinations" ? String(it.tagline || "")
            : key === "services" ? String(it.summary ?? "").slice(0, 90)
            : key === "faqs" ? String(it.answer ?? "").slice(0, 90)
            : String(it.file).split("/").pop();
          return (
            <div key={String(it.id)} className="flex flex-wrap items-center gap-4 px-4 py-3 sm:flex-nowrap">
              {def.imageField && (
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand/5 text-muted">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" loading="lazy" className="size-full object-cover" />
                  ) : key === "reviews" ? <Video className="size-6" /> : <ImageOff className="size-6" />}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-brand">{String(it[def.labelField])}</p>
                <p className="truncate text-xs text-muted">{sub}</p>
              </div>
              {!it.published && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-900">Hidden</span>}
              <div className="flex shrink-0 items-center gap-1.5">
                {def.orderable && (
                  <>
                    <form action={moveEntity.bind(null, key, String(it.id), "up")}><button disabled={i === 0} aria-label="Move up" className={`${btnGhost} disabled:opacity-30`}><ArrowUp className="size-3.5" /></button></form>
                    <form action={moveEntity.bind(null, key, String(it.id), "down")}><button disabled={i === items.length - 1} aria-label="Move down" className={`${btnGhost} disabled:opacity-30`}><ArrowDown className="size-3.5" /></button></form>
                  </>
                )}
                <form action={togglePublished.bind(null, key, String(it.id))}>
                  <button aria-label={it.published ? "Hide from website" : "Show on website"} title={it.published ? "Hide from website" : "Show on website"} className={btnGhost}>
                    {it.published ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                  </button>
                </form>
                <Link href={`/admin/${key}/${it.id}`} className={btnGhost}><Pencil className="size-3.5" /> Edit</Link>
              </div>
            </div>
          );
        })}
        {!items.length && <p className="px-5 py-10 text-center text-sm text-muted">Nothing here yet — add the first {def.singular}.</p>}
      </div>
    </>
  );
}
