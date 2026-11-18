"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SOCIAL_PLATFORMS } from "@/lib/cms/social-platforms";
import type { SocialLink } from "@/lib/cms/types";
import { MediaInput } from "./media-input";

type Row = SocialLink & { key: number };

export function SocialEditor({ initial }: { initial: SocialLink[] }) {
  const [rows, setRows] = useState<Row[]>(() => initial.map((l, i) => ({ ...l, key: i })));
  const [next, setNext] = useState(initial.length + 1);

  return (
    <div className="space-y-4 sm:col-span-2">
      <p className="text-sm text-muted">
        Each link shows its brand icon in the website footer. To use your own icon instead, upload an image in “Custom icon” (square PNG/SVG works best).
      </p>
      {rows.map((r) => (
        <div key={r.key} className="rounded-2xl border border-line bg-background p-4">
          <div className="grid gap-3 sm:grid-cols-[180px_1fr_auto]">
            <select name="social_platform" defaultValue={r.platform} className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm">
              {SOCIAL_PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <input name="social_url" defaultValue={r.url} placeholder="https://…" required className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm" />
            <button type="button" onClick={() => setRows((x) => x.filter((y) => y.key !== r.key))} aria-label="Remove link" className="grid size-10 place-items-center rounded-lg border border-line text-muted hover:text-red-700">
              <Trash2 className="size-4" />
            </button>
          </div>
          <div className="mt-3">
            <p className="mb-1 text-xs font-semibold text-brand">Custom icon (optional)</p>
            <MediaInput name="social_icon" kind="image" folder="misc" defaultValue={r.icon ?? ""} />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => { setRows((x) => [...x, { id: `new-${next}`, platform: "facebook", url: "", icon: null, key: next }]); setNext(next + 1); }}
        className="inline-flex items-center gap-2 rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/5"
      >
        <Plus className="size-4" /> Add social link
      </button>
    </div>
  );
}
