"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AMINA } from "@/lib/story-data";
import VideoStage from "./VideoStage";
import GriotTextOverlay from "./GriotTextOverlay";

/**
 * The Queen Amina legacy teaser — unlocked after endings 1, 2, 3, 6.
 * Plays the teaser video, then the griot's closing narration, then the
 * waiting-list CTA. (The waitlist POST is a frontend stub for now — it
 * will move to the backend later.)
 */
export default function AminaTeaser({
  onHome,
  onReplay,
}: {
  onHome: () => void;
  onReplay: () => void;
}) {
  const [stage, setStage] = useState<"video" | "narration" | "cta">("video");

  return (
    <div className="absolute inset-0">
      {stage === "video" && (
        <VideoStage
          src={AMINA.video}
          poster={AMINA.poster}
          onEnded={() => setStage("narration")}
        />
      )}

      {stage === "narration" && (
        <GriotTextOverlay
          text={AMINA.narration}
          poster={AMINA.poster}
          advanceLabel="Her story comes next"
          onAdvance={() => setStage("cta")}
        />
      )}

      {stage === "cta" && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${AMINA.poster})` }}
          />
          <div className="anthro-scrim" />
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-end gap-6 px-6 pb-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="anthro-serif max-w-md text-center text-[1.05rem] leading-relaxed text-[var(--cream)]">
              Your roar echoes through time.
            </p>
            <a
              href="https://anthrovian.com"
              target="_blank"
              rel="noreferrer"
              className="carved-btn carved-btn--wood anthro-serif !w-auto text-center !text-[0.98rem]"
              style={{ padding: "0.95rem 1.6rem" }}
            >
              {AMINA.ctaText}
            </a>
            <div className="flex gap-5 pt-1">
              <button
                type="button"
                onClick={onReplay}
                className="text-[0.85rem] uppercase tracking-[0.2em] text-[var(--cream-dim)] underline-offset-4 hover:text-[var(--cream)] hover:underline"
              >
                Begin Again
              </button>
              <button
                type="button"
                onClick={onHome}
                className="text-[0.85rem] uppercase tracking-[0.2em] text-[var(--cream-dim)] underline-offset-4 hover:text-[var(--cream)] hover:underline"
              >
                Return Home
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
