"use client";

import { motion } from "motion/react";
import { Plane } from "lucide-react";

const PATH = "M -50 520 C 250 520, 300 120, 640 220 S 1000 420, 1250 80";

/** Dashed route that draws itself while a plane flies along it, on a loop. */
export function FlightPath({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <motion.path
          d={PATH}
          fill="none"
          stroke="url(#fp)"
          strokeWidth={2}
          strokeDasharray="4 10"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3.2, delay: 1.2, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="fp" x1="0" x2="1">
            <stop offset="0" stopColor="#e1b90a" stopOpacity="0" />
            <stop offset="0.5" stopColor="#f7d000" />
            <stop offset="1" stopColor="#e1b90a" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
      <motion.div
        className="absolute left-0 top-0 size-0"
        style={{ offsetPath: `path("${PATH}")`, offsetRotate: "auto", scale: 1 }}
        initial={{ offsetDistance: "0%", opacity: 0 }}
        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 9, delay: 1.6, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
      >
        <Plane className="-ml-3 -mt-3 size-6 fill-gold-light text-gold-light drop-shadow-[0_0_12px_rgba(247,208,0,0.8)]" />
      </motion.div>
    </div>
  );
}
