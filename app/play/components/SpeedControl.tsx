"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const PLAYBACK_RATES = [1, 1.5, 2, 2.5] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];

/** Speed-up pill for the griot's voice (videos have baked-in audio). */
export default function SpeedControl({
  rate,
  onChange,
}: {
  rate: number;
  onChange: (rate: PlaybackRate) => void;
}) {
  const [open, setOpen] = useState(false);
  const label = `${rate}×`;

  return (
    <div className="relative flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="mb-2 flex flex-col overflow-hidden rounded-md border border-[rgba(246,223,182,0.22)] bg-black/85 backdrop-blur-sm"
          >
            {PLAYBACK_RATES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  onChange(r);
                  setOpen(false);
                }}
                className={`anthro-serif px-4 py-2 text-[0.9rem] transition-colors ${
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
        aria-label={`Playback speed ${label}`}
        className="anthro-serif flex h-9 min-w-[3rem] items-center justify-center rounded-full border border-[rgba(246,223,182,0.28)] bg-black/55 px-3 text-[0.92rem] text-[var(--cream)] backdrop-blur-sm transition-colors hover:border-[rgba(244,108,57,0.6)] hover:text-[var(--gold)]"
      >
        {label}
      </button>
    </div>
  );
}
