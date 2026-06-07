"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Brief gold-text overlay that names the act the player just entered.
 *
 * Renders OVER the scene's setup video without pausing it — the video
 * keeps playing underneath, the banner fades in for ~0.6s, holds for
 * ~2s, fades out over ~0.6s, then disappears. Total ~3.2s.
 *
 * Fired by PlayClient when `state.sceneIndex` enters the first scene
 * of an act the player hasn't seen yet (tracked via a useRef, so it
 * never fires twice in the same playthrough — REWATCH_SETUP and
 * dev-mode step-back don't retrigger it). Reduced-motion users get a
 * shorter, non-animated fade.
 */
const ACT_LABELS: Record<1 | 2 | 3, { label: string; title: string }> = {
  1: { label: "Act I", title: "The Child Who Could Not Walk" },
  2: { label: "Act II", title: "Exile and Becoming" },
  3: { label: "Act III", title: "The Lion Rises" },
};

export default function ActOpenerBanner({ act }: { act: 1 | 2 | 3 }) {
  const { label, title } = ACT_LABELS[act];
  const reduce = useReducedMotion();

  return (
    <motion.div
      // z-40 sits above the video (which is z-1 inside VideoStage) and
      // its scrim, but below the dev-mode bar (bottom-left) and the
      // SpeedControl/PauseMenu cluster (z-30). pointer-events-none so
      // taps still pass through to the always-on cinematic tap zone.
      className="anthro-serif pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-black/45 px-6 text-center"
      initial={{ opacity: 0 }}
      animate={
        reduce
          ? { opacity: [0, 1, 1, 0] }
          : { opacity: [0, 1, 1, 0] }
      }
      transition={{
        duration: reduce ? 1.4 : 3.2,
        times: [0, 0.2, 0.8, 1],
        ease: "easeInOut",
      }}
      aria-hidden
    >
      <p className="text-[0.78rem] uppercase tracking-[0.5em] text-[var(--gold)] [text-shadow:0_1px_8px_rgba(0,0,0,0.85)]">
        {label}
      </p>
      <h2 className="text-[1.4rem] leading-tight tracking-wide text-[var(--cream)] [text-shadow:0_2px_12px_rgba(0,0,0,0.9)] md:text-[2rem]">
        {title}
      </h2>
    </motion.div>
  );
}
