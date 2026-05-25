"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Short black-screen handoff between scenes — "the portal".
 *
 * iOS Safari requires the next video's .play() to fire within a tight
 * window after the user's last tap, or autoplay-with-sound is blocked
 * and we have to fall back to a "Tap to continue" overlay. Keeping
 * this hold brief (was 2.5s) keeps the gesture fresh enough that the
 * next scene starts on its own. Reduced-motion users get a near-
 * instant cut.
 */
export default function PortalTransition({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const holdMs = reduce ? 200 : 700;

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
      transition={{ duration: reduce ? 0.08 : 0.28 }}
    >
      {!reduce && (
        <motion.div
          className="anthro-serif text-[var(--gold)]"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.92, 1, 1.04] }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
          aria-hidden
        >
          <span className="text-2xl tracking-[0.4em]">✦</span>
        </motion.div>
      )}
    </motion.div>
  );
}
