"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const PLAYBACK_RATES = [1, 1.5, 2, 2.5] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];

/**
 * Round Meet-style control for the griot's voice speed (videos have
 * baked-in audio). Tap to expand the rate options upward.
 */
export default function SpeedControl({
  rate,
  onChange,
}: {
  rate: number;
  onChange: (rate: PlaybackRate) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full right-0 mb-2 flex flex-col overflow-hidden rounded-xl border border-[rgba(246,223,182,0.22)] bg-black/85 backdrop-blur-md"
          >
            {PLAYBACK_RATES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  onChange(r);
                  setOpen(false);
                }}
                className={`anthro-serif px-5 py-2 text-[0.92rem] transition-colors ${
                  r === rate
                    ? "bg-[rgba(244,108,57,0.22)] text-[var(--gold)]"
                    : "text-[var(--cream-dim)] hover:bg-white/5 hover:text-[var(--cream)]"
                }`}
              >
                {r}&times;
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Playback speed ${rate}×`}
        className={`game-ctrl anthro-serif text-[0.82rem] font-semibold ${
          rate !== 1 || open ? "game-ctrl--active" : ""
        }`}
      >
        {rate}&times;
      </button>
    </div>
  );
}
