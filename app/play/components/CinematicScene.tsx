"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import VideoStage from "./VideoStage";

/** When (in ms) to start showing the tap-to-continue hint. Long enough that
 *  the cinematic isn't broken by an immediate skip prompt, short enough
 *  that the player is never stuck wondering how to advance. */
const HINT_DELAY_MS = 6000;

/**
 * Scene 4 (Uprooting the Baobab) — pure cinematic, no choice.
 *
 * The whole screen is a tap zone the WHOLE time the cinematic is on
 * screen. The previous version only revealed an affordance after the
 * video fired `onEnded` — but in practice the `ended` event isn't always
 * fired reliably (some browsers pause mid-frame at duration boundary,
 * Chromium occasionally rounds currentTime short of duration on
 * playbackRate > 1, mobile Safari sometimes loses the event entirely).
 * Players got stuck with no way out.
 *
 * Behavior now:
 *   1. Tap anywhere → onAdvance. Works from second 0 to end.
 *   2. A subtle "Tap to continue" hint fades in after HINT_DELAY_MS so
 *      the affordance is discoverable without breaking the cinematic
 *      moment on the first few seconds.
 *   3. After the video ends naturally, the hint stays. Same control.
 */
export default function CinematicScene({
  src,
  poster,
  nextSrc,
  onAdvance,
  paused = false,
  playbackRate = 1,
}: {
  src: string;
  poster?: string;
  nextSrc?: string;
  onAdvance: () => void;
  paused?: boolean;
  playbackRate?: number;
}) {
  const [showHint, setShowHint] = useState(false);

  // Reveal the hint after a brief delay. Re-mount on src change resets it.
  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), HINT_DELAY_MS);
    return () => clearTimeout(t);
  }, [src]);

  return (
    <div className="absolute inset-0">
      <VideoStage
        src={src}
        poster={poster}
        nextSrc={nextSrc}
        paused={paused}
        playbackRate={playbackRate}
        // We don't depend on this firing anymore — the always-on tap zone
        // handles the case where the browser drops the event. The hint
        // bumps to visible anyway when this fires, just in case the user
        // sat through with no taps.
        onEnded={() => setShowHint(true)}
      />

      {/* Always-on full-screen tap target. Renders above the video but
          below the SpeedControl / PauseMenu cluster (which is z-30 in
          PlayClient). pointer-events allows the corner controls to keep
          working. */}
      <button
        type="button"
        onClick={onAdvance}
        className="absolute inset-0 z-10 cursor-pointer"
        aria-label="Continue to next scene"
      />

      {/* The hint — pointer-events-none so taps still pass through to the
          underlying always-on button. Fades in after HINT_DELAY_MS. */}
      {showHint && (
        <motion.div
          className="anthro-serif pointer-events-none absolute inset-x-0 bottom-20 z-20 flex flex-col items-center gap-3 text-[var(--cream-dim)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          aria-hidden
        >
          <span className="tap-dot" />
          <span className="text-[0.95rem] italic tracking-wide [text-shadow:0_1px_8px_rgba(0,0,0,0.85)]">
            Tap to continue
          </span>
        </motion.div>
      )}
    </div>
  );
}
