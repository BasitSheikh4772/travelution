import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { readDb } from "@/lib/cms/db";
import { CONTENT_GROUPS } from "@/lib/cms/content-schema";
import { saveContent } from "@/lib/cms/actions";
import { Notice, PageTitle, btn } from "@/components/admin/shell";
import { FieldInput } from "@/components/admin/fields";

// Per-request admin screen: skip instant-navigation validation (dev overlay insight)
export const instant = false;

export default async function GroupEdit({ params, searchParams }: { params: Promise<{ group: string }>; searchParams: Promise<{ saved?: string }> }) {
  await connection(); // admin screens always render per request
  const { group } = await params;
  const g = CONTENT_GROUPS.find((x) => x.id === group);
  if (!g) notFound();
  const { saved } = await searchParams;
  const stored = (await readDb()).content;

  return (
    <>
      <Link href="/admin/pages" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"><ArrowLeft className="size-4" /> Page content</Link>
      <PageTitle title={g.title} sub={g.description} />
      {saved && <Notice>Saved. The website is updated.</Notice>}
      <form action={saveContent.bind(null, g.id)} className="grid max-w-3xl gap-5 rounded-3xl border border-line bg-white p-6 sm:grid-cols-2 sm:p-8">
        {g.fields.map((f) => (
          <FieldInput
            key={f.key}
            f={{ name: f.key, label: f.label, type: f.type === "image" ? "image" : f.type === "textarea" ? "textarea" : "text", hint: f.hint, folder: "pages", half: false }}
            value={stored[f.key] ?? f.default}
          />
        ))}
        <div className="flex items-center gap-4 border-t border-line pt-6 sm:col-span-2">
          <button className={btn}>Save changes</button>
          <p className="text-xs text-muted">Clearing a field restores the original text.</p>
        </div>
      </form>
    </>
  );
}
