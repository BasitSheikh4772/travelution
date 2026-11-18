"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import type { Review } from "@/lib/cms/types";

export function ReviewsGallery({ reviews }: { reviews: Review[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + reviews.length) % reviews.length)), [reviews.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, go]);

  const current = open === null ? null : reviews[open];

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {reviews.map((r, i) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[1.5rem] bg-brand-deep text-left shadow-[0_20px_50px_-30px_rgba(70,13,19,0.55)] outline-none ring-gold transition duration-500 hover:-translate-y-1 hover:shadow-[0_35px_70px_-25px_rgba(70,13,19,0.65)] focus-visible:ring-2"
              aria-label={`Play review: ${r.title}`}
            >
              {r.poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.poster} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
              ) : (
                <video src={`${r.video}#t=0.6`} preload="metadata" muted playsInline className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-brand-deep/90 via-transparent to-brand-deep/20" />
              <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold-grad text-brand-deep shadow-xl transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-0.5 size-6 fill-current" />
              </span>
              <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                <span className="block font-display text-lg leading-tight">{r.name || r.title}</span>
                {r.name && <span className="mt-0.5 block text-xs text-white/70">{r.title}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div role="dialog" aria-modal="true" aria-label={current.title} className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-4 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <div className="relative flex max-h-full w-full max-w-md flex-col" onClick={(e) => e.stopPropagation()}>
            <video
              ref={videoRef}
              key={current.id}
              src={current.video}
              poster={current.poster ?? undefined}
              controls
              autoPlay
              playsInline
              className="max-h-[82vh] w-full rounded-2xl bg-black object-contain"
            />
            <div className="mt-3 text-center text-white">
              <p className="font-display text-xl">{current.name || current.title}</p>
              {current.name && <p className="text-sm text-white/70">{current.title}</p>}
              {current.quote && <p className="mx-auto mt-2 max-w-sm text-sm italic text-white/80">“{current.quote}”</p>}
            </div>
            {reviews.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="Previous review" className="absolute -left-2 top-1/2 grid size-11 -translate-x-full -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 max-sm:hidden">
                  <ChevronLeft className="size-6" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next review" className="absolute -right-2 top-1/2 grid size-11 translate-x-full -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 max-sm:hidden">
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>
          <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
            <X className="size-6" />
          </button>
        </div>
      )}
    </>
  );
}
