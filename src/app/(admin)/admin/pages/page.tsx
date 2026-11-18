import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CONTENT_GROUPS } from "@/lib/cms/content-schema";
import { PageTitle } from "@/components/admin/shell";

// Per-request admin screen: skip instant-navigation validation (dev overlay insight)
export const instant = false;

export default function PagesIndex() {
  return (
    <>
      <PageTitle title="Page content" sub="Edit the headings, paragraphs, buttons and images on each page of the website." />
      <div className="grid max-w-3xl gap-3">
        {CONTENT_GROUPS.map((g) => (
          <Link key={g.id} href={`/admin/pages/${g.id}`} className="flex items-center justify-between rounded-2xl border border-line bg-white px-5 py-4 transition hover:border-brand">
            <span>
              <span className="block font-semibold text-brand">{g.title}</span>
              <span className="block text-xs text-muted">{g.description ?? `${g.fields.length} editable fields`}</span>
            </span>
            <ChevronRight className="size-5 text-gold-dark" />
          </Link>
        ))}
      </div>
    </>
  );
}
