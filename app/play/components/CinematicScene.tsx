"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import VideoStage from "./VideoStage";

/**
 * Scene 4 (Uprooting the Baobab) — pure cinematic, no choice.
 * The video plays full-bleed; when it ends the whole screen becomes a
 * tap zone with a single gold pulse dot. The pacing contrast against
 * the choice scenes is the point — do not rush it.
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
  const [ended, setEnded] = useState(false);

  return (
    <div className="absolute inset-0">
      <VideoStage
        src={src}
        poster={poster}
        nextSrc={nextSrc}
        paused={paused}
        playbackRate={playbackRate}
        onEnded={() => setEnded(true)}
      />

      {ended && (
        <motion.button
          type="button"
          onClick={onAdvance}
          className="anthro-serif absolute inset-0 flex flex-col items-center justify-end gap-3 pb-20 text-[var(--cream-dim)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          aria-label="Continue"
        >
          <span className="tap-dot" />
          <span className="text-[0.95rem] italic tracking-wide [text-shadow:0_1px_8px_rgba(0,0,0,0.85)]">
            Tap to continue
          </span>
        </motion.button>
      )}
    </div>
  );
}
