"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AMINA } from "@/lib/story-data";
import VideoStage from "./VideoStage";
import GriotTextOverlay from "./GriotTextOverlay";
import InscriptionInput from "./InscriptionInput";

/**
 * The Queen Amina legacy teaser — unlocked after endings 1, 2, 3, 6.
 * Plays the teaser video, the griot's closing narration, then captures
 * the player's email for the Act II "waiting list" (this row in Postgres
 * IS the waitlist + the cross-device resume key).
 */
export default function AminaTeaser({
  onHome,
  onReplay,
  onCaptureEmail,
  savedEmail,
  playbackRate = 1,
}: {
  onHome: () => void;
  onReplay: () => void;
  onCaptureEmail?: (email: string) => void;
  savedEmail?: string | null;
  playbackRate?: number;
}) {
  const [stage, setStage] = useState<"video" | "narration" | "cta">("video");
  const [submitted, setSubmitted] = useState<boolean>(!!savedEmail);

  const exits = (
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
  );

  return (
    <div className="absolute inset-0">
      {stage === "video" && (
        <VideoStage
          src={AMINA.video}
          poster={AMINA.poster}
          playbackRate={playbackRate}
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

      {stage === "cta" && !submitted && (
        <InscriptionInput
          prompt={"Queen Amina's tale comes next.\nWhere shall the griot send word when Act II begins?"}
          placeholder="you@example.com"
          type="email"
          submitLabel="Summon me for Act II"
          poster={AMINA.poster}
          onSubmit={(email) => {
            onCaptureEmail?.(email);
            setSubmitted(true);
          }}
          onSkip={onHome}
          optional
        />
      )}

      {stage === "cta" && submitted && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${AMINA.poster})` }}
          />
          <div className="anthro-scrim" />
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <p className="anthro-serif text-[0.8rem] uppercase tracking-[0.32em] text-[var(--gold)]">
              Your roar echoes through time
            </p>
            <p className="anthro-serif max-w-md text-[1.2rem] leading-snug text-[var(--cream)]">
              The griot has your name. When Queen Amina rides, word will reach
              you.
            </p>
            {exits}
          </motion.div>
        </div>
      )}
    </div>
  );
}
