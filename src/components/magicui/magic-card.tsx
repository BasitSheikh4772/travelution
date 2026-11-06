"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";

/** Magic UI Magic Card: cursor-following spotlight + gradient border. `dark` = maroon card with a gold spotlight. */
export function MagicCard({
  children,
  className,
  dark,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const fill = dark ? "rgba(247,208,0,0.16)" : "rgba(225,185,10,0.2)";
  const edge = dark ? "rgba(247,208,0,0.75)" : "rgba(70,13,19,0.55)";
  const bg = useMotionTemplate`radial-gradient(340px circle at ${x}px ${y}px, ${fill}, transparent 70%)`;
  const border = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, ${edge}, transparent 70%)`;

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onMouseLeave={() => {
        x.set(-300);
        y.set(-300);
      }}
      className={cn("group relative rounded-3xl p-px", dark ? "bg-white/10" : "bg-line", className)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: border }}
      />
      <div className={cn("relative h-full overflow-hidden rounded-[calc(1.5rem-1px)]", dark ? "bg-brand-deep text-white" : "bg-white")}>
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: bg }}
        />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  );
}
