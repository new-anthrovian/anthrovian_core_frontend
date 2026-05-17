"use client";

import { motion } from "framer-motion";
import { PORTAL_POSTER } from "@/lib/story-data";

/**
 * Shown on /play mount when a save is restored at a phase that will
 * immediately try to play audible video (griot intro, scene video,
 * cinematic, branch video, ending, amina, portal transition leading
 * into one of those). A page refresh strips the user-activation that
 * was captured by the /awaken Begin tap, so the browser blocks any
 * .play() with audio. Capturing one explicit tap here re-establishes
 * activation before VideoStage mounts and tries to play.
 *
 * Skipped on choice / personalization / interlude / reflection /
 * legacy phases — the user's natural next tap on those screens is
 * already a fresh gesture.
 */
export default function ResumePrompt({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${PORTAL_POSTER})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/82" aria-hidden />

      <motion.div
        className="absolute inset-0 flex items-center justify-center px-6 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex w-full max-w-md flex-col items-center gap-5">
          <p className="anthro-serif text-[0.78rem] uppercase tracking-[0.34em] text-[var(--gold)]">
            Welcome back, young lion
          </p>
          <p className="anthro-serif text-[1.35rem] leading-snug text-[var(--cream)] md:text-[1.55rem]">
            The story holds its breath.
          </p>
          <p className="anthro-serif max-w-xs text-[0.92rem] italic leading-relaxed text-[var(--cream-dim)]">
            Tap to continue your journey — the griot is waiting.
          </p>
          <button
            type="button"
            onClick={onContinue}
            className="carved-btn carved-btn--wood anthro-serif mt-1 max-w-sm text-center"
          >
            Continue your journey
          </button>
        </div>
      </motion.div>
    </div>
  );
}
