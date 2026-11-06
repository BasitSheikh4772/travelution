"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LogoMark } from "./logo";

/** Short branded intro on first load. */
export function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="pre"
          exit={{ clipPath: "circle(0% at 50% 50%)" }}
          initial={{ clipPath: "circle(150% at 50% 50%)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center bg-brand-deep"
        >
          <div className="relative flex flex-col items-center">
            <span className="absolute size-56 animate-pulse-ring rounded-full border border-gold/40" />
            <span className="absolute size-56 animate-pulse-ring rounded-full border border-gold/30 [animation-delay:0.8s]" />
            <motion.div
              initial={{ scale: 0.6, opacity: 0, filter: "blur(14px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="w-44"
            >
              <LogoMark variant="light" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.5em" }}
              transition={{ delay: 0.5, duration: 1.1 }}
              className="mt-8 text-sm font-semibold uppercase text-gold"
            >
              Travelution
            </motion.p>
            <motion.div className="mt-5 h-px w-40 origin-left bg-gold-grad" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 1.4 }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
