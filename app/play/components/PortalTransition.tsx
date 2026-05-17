"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The ~2.5s black-screen handoff between scenes — "the portal".
 * Holds black while the next scene's video buffers behind it, then
 * fires onDone. Reduced-motion users get a near-instant cut.
 */
export default function PortalTransition({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const holdMs = reduce ? 250 : 2500;

  useEffect(() => {
    const t = setTimeout(onDone, holdMs);
    return () => clearTimeout(t);
  }, [onDone, holdMs]);

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.1 : 0.6 }}
    >
      {!reduce && (
        <motion.div
          className="anthro-serif text-[var(--gold)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: [0, 0.85, 0], scale: [0.9, 1, 1.04] }}
          transition={{ duration: 2.4, ease: "easeInOut" }}
          aria-hidden
        >
          <span className="text-3xl tracking-[0.4em]">✦</span>
        </motion.div>
      )}
    </motion.div>
  );
}
