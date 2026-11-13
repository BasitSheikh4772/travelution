"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export type EnquiryField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "number" | "select" | "textarea" | "radio";
  options?: string[];
  required?: boolean;
  /** half-width on desktop */
  half?: boolean;
};

const input =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10";

/**
 * Structured enquiry form. Name/email/phone map to the CF7 fields; every other
 * field is composed into the message so it lands in the same inbox via /api/contact.
 */
export function EnquiryForm({
  topic,
  fields,
  submitLabel,
  whatsapp,
  consent,
}: {
  topic: string;
  fields: EnquiryField[];
  submitLabel: string;
  whatsapp: string;
  consent?: string;
}) {
  const [state, setState] = useState<{ status: "idle" | "sending" | "sent" | "error"; message?: string }>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const details = fields
      .filter((f) => !["name", "email", "phone"].includes(f.name) && data[f.name])
      .map((f) => `${f.label}: ${data[f.name]}`)
      .join("\n");
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, phone: data.phone, website: data.website, topic, message: details || topic }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      setState(json.ok ? { status: "sent" } : { status: "error", message: json.message });
    } catch {
      setState({ status: "error", message: "Network error. Please try again." });
    }
  }

  if (state.status === "sent") {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-[2rem] border border-line bg-white p-10 text-center">
        <CheckCircle2 className="size-14 text-gold-dark" />
        <h3 className="mt-4 font-display text-3xl text-brand">Thank you — we’ve got it.</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">One of our travel consultants will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-[2rem] border border-line bg-white p-6 shadow-[0_30px_80px_-40px_rgba(70,13,19,0.45)] sm:grid-cols-2 sm:p-10">
      {fields.map((f) => (
        <div key={f.name} className={cn(!f.half && "sm:col-span-2")}>
          <label htmlFor={f.name} className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-gold-dark">
            {f.label}
            {f.required && " *"}
          </label>
          {f.type === "select" ? (
            <select id={f.name} name={f.name} required={f.required} defaultValue="" className={input}>
              <option value="" disabled>Select…</option>
              {f.options?.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : f.type === "textarea" ? (
            <textarea id={f.name} name={f.name} required={f.required} rows={4} className={cn(input, "resize-none")} />
          ) : f.type === "radio" ? (
            <div className="flex gap-6 py-2 text-sm">
              {f.options?.map((o) => (
                <label key={o} className="inline-flex items-center gap-2">
                  <input type="radio" name={f.name} value={o} required={f.required} /> {o}
                </label>
              ))}
            </div>
          ) : (
            <input id={f.name} name={f.name} type={f.type ?? "text"} min={f.type === "number" ? 0 : undefined} required={f.required} className={input} />
          )}
        </div>
      ))}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {consent && (
        <label className="flex items-start gap-3 text-sm text-muted sm:col-span-2">
          <input type="checkbox" required className="mt-1" /> {consent}
        </label>
      )}

      {state.status === "error" && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
          {state.message} <a className="font-semibold underline" href={`https://wa.me/${whatsapp}`}>WhatsApp us instead</a>
        </p>
      )}

      <button
        disabled={state.status === "sending"}
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold-grad animate-gradient px-8 py-4 text-sm font-semibold text-brand-deep transition hover:-translate-y-0.5 disabled:opacity-70 sm:col-span-2 sm:w-fit"
      >
        {state.status === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {state.status === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
