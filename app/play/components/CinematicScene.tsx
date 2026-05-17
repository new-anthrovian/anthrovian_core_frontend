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
}: {
  src: string;
  poster?: string;
  nextSrc?: string;
  onAdvance: () => void;
  paused?: boolean;
}) {
  const [ended, setEnded] = useState(false);

  return (
    <div className="absolute inset-0">
      <VideoStage
        src={src}
        poster={poster}
        nextSrc={nextSrc}
        paused={paused}
        onEnded={() => setEnded(true)}
      />

      {ended && (
        <motion.button
          type="button"
          onClick={onAdvance}
          className="absolute inset-0 flex items-end justify-center pb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          aria-label="Continue"
        >
          <span className="tap-dot" />
        </motion.button>
      )}
    </div>
  );
}
