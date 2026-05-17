"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Ending, Variable } from "@/lib/types";
import VideoStage from "./VideoStage";
import VariableVisualizer from "./VariableVisualizer";
import ReflectionCard from "./ReflectionCard";

/**
 * Ending video -> gold title -> revealed variable symbols -> reflection
 * card -> (conditional) Amina button + Replay/Home.
 * The secret ending (mothers_hidden_lion) gets NO banner — the
 * discovery itself is the reward.
 */
export default function EndingScreen({
  ending,
  lastIncreasedVar,
  pulseKey,
  onShowAmina,
  onReplay,
  onHome,
}: {
  ending: Ending;
  lastIncreasedVar: Variable | null;
  pulseKey: number;
  onShowAmina: () => void;
  onReplay: () => void;
  onHome: () => void;
}) {
  const [stage, setStage] = useState<"video" | "card">("video");

  if (stage === "video") {
    return (
      <VideoStage
        src={ending.endingVideo}
        poster={ending.poster}
        onEnded={() => setStage("card")}
      />
    );
  }

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ending.poster})` }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="absolute inset-0 overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-xl flex-col items-center justify-center gap-7 px-6 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="anthro-serif text-[2rem] leading-tight text-[var(--gold)] md:text-[2.6rem]">
              {ending.title}
            </h1>
            <p className="anthro-serif mt-2 text-[0.95rem] uppercase tracking-[0.3em] text-[var(--cream-dim)]">
              {ending.subtitle}
            </p>
          </motion.div>

          <VariableVisualizer
            lastIncreasedVar={lastIncreasedVar}
            pulseKey={pulseKey}
            revealed
          />

          <motion.p
            className="anthro-serif whitespace-pre-line text-center text-[1.05rem] leading-relaxed text-[var(--cream)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {ending.narration}
          </motion.p>

          <ReflectionCard reflection={ending.reflection} />

          <div className="flex flex-col items-center gap-4 pt-2">
            {ending.unlocksAmina && (
              <button
                type="button"
                onClick={onShowAmina}
                className="carved-btn carved-btn--wood anthro-serif !w-auto text-center !text-[0.98rem]"
                style={{ padding: "0.95rem 1.6rem" }}
              >
                Your roar echoes through time… See who heard it ➜
              </button>
            )}
            <div className="flex gap-5">
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
          </div>
        </div>
      </div>
    </div>
  );
}
