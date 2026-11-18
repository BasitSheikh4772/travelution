import type { FieldDef } from "@/lib/cms/admin-schema";
import { MediaInput } from "./media-input";
import { inputCls } from "./shell";

type Option = { value: string; label: string };

/** Renders one form control for a field definition. `value` is the current (or default) value. */
export function FieldInput({ f, value, destinations = [] }: { f: FieldDef; value: unknown; destinations?: Option[] }) {
  const opts: Option[] = f.options === "destinations" ? destinations : (f.options ?? []);
  const str = value === null || value === undefined ? "" : String(value);

  let control: React.ReactNode;
  switch (f.type) {
    case "textarea":
      control = <textarea name={f.name} defaultValue={str} required={f.required} rows={f.name === "description" ? 12 : 4} placeholder={f.placeholder} className={inputCls} />;
      break;
    case "lines":
      control = <textarea name={f.name} defaultValue={Array.isArray(value) ? value.join("\n") : str} rows={4} className={inputCls} />;
      break;
    case "number":
      control = <input name={f.name} type="number" step="any" min="0" defaultValue={str} className={inputCls} />;
      break;
    case "select":
      control = (
        <select name={f.name} defaultValue={str || opts[0]?.value} className={inputCls}>
          {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
      break;
    case "multiselect": {
      const chosen = new Set(Array.isArray(value) ? (value as string[]) : []);
      control = (
        <div className="mt-1 flex flex-wrap gap-2">
          {opts.map((o) => (
            <label key={o.value} className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand/5">
              <input type="checkbox" name={f.name} value={o.value} defaultChecked={chosen.has(o.value)} className="accent-[#460d13]" /> {o.label}
            </label>
          ))}
        </div>
      );
      break;
    }
    case "image":
    case "video":
    case "pdf":
      control = <MediaInput name={f.name} kind={f.type} folder={f.folder ?? "misc"} defaultValue={str} required={f.required} hint={f.hint} />;
      break;
    default:
      control = <input name={f.name} defaultValue={str} required={f.required} placeholder={f.placeholder} className={inputCls} />;
  }

  if (f.type === "checkbox") {
    return (
      <label className="flex cursor-pointer items-center gap-3 self-end rounded-lg border border-line bg-white px-4 py-3 text-sm font-medium">
        <input type="checkbox" name={f.name} defaultChecked={!!value} className="size-4 accent-[#460d13]" /> {f.label}
      </label>
    );
  }

  return (
    <div className={f.half ? "" : "sm:col-span-2"}>
      <span className="text-sm font-semibold text-brand">
        {f.label}
        {f.required && <span className="text-red-700"> *</span>}
      </span>
      {control}
      {f.hint && f.type !== "image" && f.type !== "video" && f.type !== "pdf" && <span className="mt-1 block text-xs text-muted">{f.hint}</span>}
    </div>
  );
}
