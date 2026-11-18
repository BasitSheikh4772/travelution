import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { readDb } from "@/lib/cms/db";
import { ENTITIES, type EntityKey } from "@/lib/cms/admin-schema";
import { deleteEntity, saveEntity } from "@/lib/cms/actions";
import { PageTitle, btn } from "@/components/admin/shell";
import { FieldInput } from "@/components/admin/fields";
import { ConfirmButton } from "@/components/admin/confirm-button";

// Per-request admin screen: skip instant-navigation validation (dev overlay insight)
export const instant = false;

export default async function EntityEdit({ params }: { params: Promise<{ entity: string; id: string }> }) {
  await connection(); // admin screens always render per request
  const { entity, id } = await params;
  if (!(entity in ENTITIES)) notFound();
  const key = entity as EntityKey;
  const def = ENTITIES[key];
  const db = await readDb();
  const isNew = id === "new";
  const item = isNew ? undefined : (db[key] as unknown as Record<string, unknown>[]).find((x) => String(x.id) === id);
  if (!isNew && !item) notFound();

  const destinations = db.destinations.map((d) => ({ value: d.slug, label: d.name }));
  const initial: Record<string, unknown> = item ?? { published: true, currency: "PKR", icon: "private" };

  return (
    <>
      <Link href={`/admin/${key}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"><ArrowLeft className="size-4" /> {def.title}</Link>
      <PageTitle title={isNew ? `New ${def.singular}` : `Edit ${def.singular}`} />

      <form action={saveEntity.bind(null, key, isNew ? null : id)} className="grid max-w-3xl gap-5 rounded-3xl border border-line bg-white p-6 sm:grid-cols-2 sm:p-8">
        {def.fields.map((f) => (
          <FieldInput key={f.name} f={f} value={initial[f.name]} destinations={destinations} />
        ))}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 sm:col-span-2">
          <button className={btn}>{isNew ? `Add ${def.singular}` : "Save changes"}</button>
          <Link href={`/admin/${key}`} className="text-sm font-semibold text-muted hover:text-brand">Cancel</Link>
        </div>
      </form>

      {!isNew && (
        <form action={deleteEntity.bind(null, key, id)} className="mt-6 max-w-3xl">
          <ConfirmButton message={`Delete this ${def.singular}? Its uploaded files are removed too. This cannot be undone.`} className="text-sm font-semibold text-red-700 hover:underline">
            Delete this {def.singular}
          </ConfirmButton>
        </form>
      )}
    </>
  );
}
