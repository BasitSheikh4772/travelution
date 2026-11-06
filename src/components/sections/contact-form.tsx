"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const topics = [
  ["quote", "Request a quote"],
  ["private-trip", "Private trip design"],
  ["hajj-2027", "Hajj 2027"],
  ["umrah", "Umrah"],
  ["visa", "Visa"],
  ["insurance", "Insurance"],
  ["guide", "Tour guide / transport"],
] as const;

type State = { status: "idle" | "sending" | "sent" | "error"; message?: string };

const field =
  "peer w-full rounded-2xl border border-line bg-white px-4 pb-2 pt-6 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10";
const label =
  "pointer-events-none absolute left-4 top-4 origin-left text-sm text-muted transition-all peer-focus:top-2 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-75";

export function ContactForm({ whatsapp }: { whatsapp: string }) {
  const params = useSearchParams();
  const initial = topics.find(([v]) => v === params.get("topic"))?.[0] ?? "quote";
  const [topic, setTopic] = useState<string>(initial);
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, topic: topics.find(([v]) => v === topic)?.[1] }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      setState(json.ok ? { status: "sent" } : { status: "error", message: json.message });
    } catch {
      setState({ status: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-line bg-white p-6 shadow-[0_30px_80px_-40px_rgba(70,13,19,0.45)] sm:p-10">
      <AnimatePresence mode="wait">
        {state.status === "sent" ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-80 flex-col items-center justify-center text-center">
            <CheckCircle2 className="size-14 text-gold-dark" />
            <h3 className="mt-4 font-display text-3xl text-brand">Thank you — we’ve got it.</h3>
            <p className="mt-2 max-w-sm text-sm text-muted">One of our travel consultants will get back to you shortly.</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0 }} className="space-y-5">
            <fieldset>
              <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">I’m interested in</legend>
              <div className="flex flex-wrap gap-2">
                {topics.map(([v, l]) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setTopic(v)}
                    aria-pressed={topic === v}
                    className="relative rounded-full px-4 py-2 text-sm font-medium transition"
                  >
                    {topic === v && <motion.span layoutId="topic-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                    <span className={cn("relative", topic === v ? "text-white" : "text-brand")}>{l}</span>
                    {topic !== v && <span className="absolute inset-0 rounded-full border border-line" />}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="relative"><input name="name" required placeholder=" " autoComplete="name" className={field} /><label className={label}>Full name</label></div>
              <div className="relative"><input name="phone" type="tel" placeholder=" " autoComplete="tel" className={field} /><label className={label}>Phone / WhatsApp</label></div>
            </div>
            <div className="relative"><input name="email" type="email" required placeholder=" " autoComplete="email" className={field} /><label className={label}>Email</label></div>
            <div className="relative"><textarea name="message" required rows={5} placeholder=" " className={cn(field, "resize-none")} /><label className={label}>Tell us about your trip — dates, group size, budget</label></div>
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

            {state.status === "error" && (
              <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {state.message}{" "}
                <a className="font-semibold underline" href={`https://wa.me/${whatsapp}`}>WhatsApp us instead</a>
              </p>
            )}

            <button
              disabled={state.status === "sending"}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-grad animate-gradient px-8 py-4 text-sm font-semibold text-brand-deep shadow-[0_12px_30px_-10px_rgba(225,185,10,0.8)] transition hover:-translate-y-0.5 disabled:opacity-70 sm:w-auto"
            >
              {state.status === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />}
              {state.status === "sending" ? "Sending…" : "Send enquiry"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
