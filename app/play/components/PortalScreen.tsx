"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import InscriptionInput from "./InscriptionInput";

/** Deterministic ember field — avoids hydration mismatch from Math.random. */
const EMBERS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 53) % 100}%`,
  duration: 7 + ((i * 7) % 9),
  delay: (i * 0.9) % 8,
  drift: `${((i % 5) - 2) * 16}px`,
}));

/**
 * The /awaken portal. The Begin tap is the user gesture that unlocks
 * audible video for the whole session — so the griot intro can play
 * with sound the moment /play mounts.
 */
export default function PortalScreen({
  hasSave,
  onBegin,
  onContinue,
  onRestore,
  restoreBusy = false,
  restoreError = null,
}: {
  hasSave: boolean;
  onBegin: () => void;
  onContinue: () => void;
  onRestore: (email: string) => void;
  restoreBusy?: boolean;
  restoreError?: string | null;
}) {
  const [showRestore, setShowRestore] = useState(false);

  if (showRestore) {
    return (
      <div className="anthro-game">
        <InscriptionInput
          prompt={"Returning to the tale?\nEnter the email you left with the griot."}
          placeholder="you@example.com"
          type="email"
          submitLabel="Recall my tale"
          busy={restoreBusy}
          error={restoreError}
          onSubmit={onRestore}
          onSkip={() => setShowRestore(false)}
          optional
        />
      </div>
    );
  }

  return (
    <div className="anthro-game flex flex-col items-center justify-center px-6 text-center">
      {/* embers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className="ember"
            style={
              {
                left: e.left,
                animationDuration: `${e.duration}s`,
                animationDelay: `${e.delay}s`,
                "--drift": e.drift,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <p className="anthro-serif text-[1.05rem] italic text-[var(--cream-dim)]">
          Anthrovian presents
        </p>
        <h1 className="anthro-serif text-[2.6rem] leading-[1.05] text-[var(--gold)] md:text-[4rem]">
          Sundiata&rsquo;s Rise
        </h1>
        <p className="anthro-serif text-[1.15rem] tracking-[0.3em] text-[var(--cream)]">
          AWAKEN THE LION WITHIN
        </p>
        <p className="anthro-serif mt-1 max-w-sm text-[0.98rem] italic leading-relaxed text-[var(--cream-dim)]">
          &ldquo;The lion does not tell the hunter he is a lion.&rdquo;
        </p>

        <div className="mt-6 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={onBegin}
            className="carved-btn carved-btn--wood anthro-serif !w-auto text-center !text-[1.05rem]"
            style={{ padding: "1rem 2.4rem" }}
          >
            {hasSave ? "Begin Anew" : "Begin"}
          </button>
          {hasSave && (
            <button
              type="button"
              onClick={onContinue}
              className="text-[0.85rem] uppercase tracking-[0.24em] text-[var(--cream-dim)] underline-offset-4 hover:text-[var(--cream)] hover:underline"
            >
              Continue your journey
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowRestore(true)}
            className="text-[0.78rem] uppercase tracking-[0.2em] text-[var(--cream-dim)]/70 underline-offset-4 hover:text-[var(--cream)] hover:underline"
          >
            Returning on a new device?
          </button>
        </div>
      </motion.div>
    </div>
  );
}
