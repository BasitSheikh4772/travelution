"use client";

import { useEffect, useState } from "react";

/** Current year, resolved on the client so the static prerender never freezes a date. */
export function Year() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setYear(new Date().getFullYear()), 0);
    return () => clearTimeout(t);
  }, []);
  return <span className="inline-block min-w-[2.2em]">{year ?? ""}</span>;
}
