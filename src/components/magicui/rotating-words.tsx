"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/** Magic UI Word Rotate. Reserves the width of the longest word so the layout never jumps. */
export function RotatingWords({ words, interval = 2400, className }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  return (
    <span className={`relative inline-grid overflow-hidden align-bottom pb-[0.15em] ${className ?? ""}`}>
      <span className="invisible col-start-1 row-start-1" aria-hidden>{longest}</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={words[i]}
          initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1 text-gold-grad"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
