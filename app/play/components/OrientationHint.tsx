"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Touch device held in portrait, on a phone-sized viewport. */
function isMobilePortrait(): boolean {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const portrait = window.matchMedia("(orientation: portrait)").matches;
  const smallEdge = Math.min(window.innerWidth, window.innerHeight) <= 820;
  return coarse && portrait && smallEdge;
}

/**
 * On a phone held upright, the (landscape) videos letterbox heavily.
 * This nudge invites the player to rotate. It auto-hides the moment the
 * device turns landscape, and can be dismissed to play in portrait
 * anyway (the game handles portrait gracefully — it's just nicer wide).
 */
export default function OrientationHint() {
  const [portrait, setPortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const update = () => setPortrait(isMobilePortrait());
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  const show = portrait && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-[var(--night)] px-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: [0, -90, -90, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.6, times: [0, 0.4, 0.7, 1] }}
            aria-hidden
          >
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="12" y1="18" x2="12" y2="18" />
          </motion.svg>

          <p className="anthro-serif text-[1.25rem] leading-snug text-[var(--cream)]">
            Turn your device sideways
          </p>
          <p className="anthro-serif max-w-xs text-[0.95rem] italic leading-relaxed text-[var(--cream-dim)]">
            Sundiata&rsquo;s tale is told widescreen — landscape gives you the
            full frame.
          </p>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="mt-2 text-[0.8rem] uppercase tracking-[0.22em] text-[var(--cream-dim)] underline-offset-4 hover:text-[var(--cream)] hover:underline"
          >
            Continue in portrait
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
