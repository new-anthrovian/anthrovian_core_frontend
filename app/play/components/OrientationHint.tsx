"use client";

import { useEffect, useRef, useState } from "react";
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
 *
 * Orientation-lock reality: there's no browser API to *detect* whether
 * the OS rotation lock is on. We do two things to help:
 *   1. Best-effort: try `screen.orientation.lock('landscape')` once per
 *      mount. Works on Android Chrome (in fullscreen). iOS Safari throws
 *      — we swallow it. Free win for the subset that supports it.
 *   2. Always show the cross-platform rotation-lock icon + a plain-
 *      English line so users whose phones won't rotate know *why* and
 *      where to fix it (iOS Control Center / Android Quick Settings).
 */
export default function OrientationHint() {
  const [portrait, setPortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  // Programmatic landscape lock is a one-shot per mount — repeating
  // wastes calls and some browsers warn on it.
  const triedLock = useRef(false);

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

  // When we first detect mobile-portrait, try the Screen Orientation API
  // (Android Chrome supports it; iOS Safari does not — silent failure).
  useEffect(() => {
    if (!portrait || triedLock.current) return;
    triedLock.current = true;
    // lock() is editor's-draft and missing from lib.dom's ScreenOrientation.
    // @ts-expect-error — runtime-checked via optional chaining.
    const p = screen.orientation?.lock?.("landscape");
    if (p && typeof p.then === "function") {
      p.catch(() => {
        /* iOS Safari throws "NotSupportedError" — expected. */
      });
    }
  }, [portrait]);

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

          {/* Orientation-lock guidance. The padlock-with-circular-arrow
              icon below is the same symbol iOS uses in Control Center
              and Android in Quick Settings — recognizable across both
              platforms. Always shown so users whose phones won't rotate
              know immediately why, without waiting on a delayed hint. */}
          <div className="mt-2 flex max-w-xs flex-col items-center gap-2 border-t border-[rgba(246,223,182,0.16)] pt-4">
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--cream-dim)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {/* circular rotation arrow wrapping the lock */}
              <path d="M19 11a7 7 0 0 0-12.6-3.5" />
              <polyline points="6.4 3.5 6.4 7.5 10.4 7.5" />
              <path d="M5 13a7 7 0 0 0 12.6 3.5" />
              <polyline points="17.6 20.5 17.6 16.5 13.6 16.5" />
              {/* central padlock */}
              <rect x="9.5" y="10" width="5" height="4" rx="0.6" />
              <path d="M10.5 10v-1a1.5 1.5 0 0 1 3 0v1" />
            </svg>
            <p className="anthro-serif text-[0.82rem] italic leading-relaxed text-[var(--cream-dim)]">
              If your screen won&rsquo;t turn, rotation lock is on — disable it
              in Control Center (iOS) or Quick Settings (Android).
            </p>
          </div>

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
