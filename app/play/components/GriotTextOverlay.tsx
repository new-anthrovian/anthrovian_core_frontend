"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { KORA_AMBIENT } from "@/lib/story-data";
import { useKoraAmbient } from "@/lib/hooks/useKoraAmbient";

/**
 * Renders griot narration (paragraphs split on \n\n) over a still poster.
 * Used for branch narration when a branch has no dedicated video, AND for
 * text-only scene setups (Iron Rod, Scene 9 Final Moral). Paragraphs fade
 * in one-by-one; once settled, a quiet "Continue" appears.
 *
 * Audio: this is where the looping kora ambience plays. Video scenes
 * have their own baked-in audio (griot VO + kora + SFX in the mp4);
 * text-only scenes would be silent without this. The kora rides under
 * the prose at low volume and respects the player's mute toggle.
 */
export default function GriotTextOverlay({
  text,
  poster,
  onAdvance,
  advanceLabel = "Continue",
  paragraphDelayMs = 1400,
}: {
  text: string;
  poster?: string;
  onAdvance: () => void;
  advanceLabel?: string;
  paragraphDelayMs?: number;
}) {
  const paragraphs = text.split("\n\n").filter(Boolean);
  const [settled, setSettled] = useState(false);

  // Layer the kora bed under the text. Hook handles fade in/out, mute
  // state, and silent autoplay-block fallback.
  useKoraAmbient(KORA_AMBIENT);

  useEffect(() => {
    const total = paragraphs.length * paragraphDelayMs + 600;
    const t = setTimeout(() => setSettled(true), total);
    return () => clearTimeout(t);
  }, [paragraphs.length, paragraphDelayMs]);

  return (
    <div className="absolute inset-0">
      {poster && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
      <div className="anthro-scrim" />
      <div className="absolute inset-0 overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-end gap-4 px-6 pb-28 pt-24">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="anthro-serif griot-line text-[1.15rem] leading-relaxed text-[var(--cream)] md:text-[1.3rem]"
              style={{ animationDelay: `${i * paragraphDelayMs}ms` }}
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-8">
        <motion.button
          type="button"
          onClick={onAdvance}
          initial={false}
          animate={{ opacity: settled ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="anthro-serif rounded-full border border-[rgba(246,223,182,0.3)] px-8 py-3 text-[0.95rem] tracking-wide text-[var(--cream)] transition-colors hover:bg-[rgba(246,223,182,0.1)]"
          style={{ pointerEvents: settled ? "auto" : "none" }}
        >
          {advanceLabel}
        </motion.button>
      </div>
    </div>
  );
}
