"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * The in-game pause menu. Opened by the corner glyph or the browser
 * back button. Resume / Replay this scene / Begin Again / Return Home.
 * No per-choice undo — choices stay weighty by design.
 */
export default function PauseMenu({
  open,
  canReplay,
  onResume,
  onReplayScene,
  onRestart,
  onHome,
}: {
  open: boolean;
  canReplay: boolean;
  onResume: () => void;
  onReplayScene: () => void;
  onRestart: () => void;
  onHome: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="flex w-[min(86vw,340px)] flex-col items-center gap-3 px-2"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="anthro-serif mb-2 text-[0.78rem] uppercase tracking-[0.34em] text-[var(--gold)]">
              The story pauses
            </p>

            <button
              type="button"
              onClick={onResume}
              className="carved-btn carved-btn--wood anthro-serif text-center"
            >
              Resume
            </button>
            <button
              type="button"
              onClick={onReplayScene}
              disabled={!canReplay}
              className="carved-btn carved-btn--wood anthro-serif text-center"
            >
              Replay this scene
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="carved-btn carved-btn--wood anthro-serif text-center"
            >
              Begin Again
            </button>
            <button
              type="button"
              onClick={onHome}
              className="carved-btn carved-btn--wood anthro-serif text-center"
            >
              Return Home
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
