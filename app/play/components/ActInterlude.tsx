"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PORTAL_POSTER } from "@/lib/story-data";
import InscriptionInput from "./InscriptionInput";

/**
 * End-of-Act interlude. Act I ("The Child Who Could Not Walk") is the
 * full playable arc for now; Acts II-III follow once their videos land.
 * This is also the live game's email-capture moment (Act II waitlist +
 * cross-device key) — the post-ending Amina teaser isn't reached while
 * ACTIVE_SCENE_COUNT is Act-I-only.
 */
export default function ActInterlude({
  onReplay,
  onHome,
  onCaptureEmail,
  savedEmail,
}: {
  onReplay: () => void;
  onHome: () => void;
  onCaptureEmail?: (email: string) => void;
  savedEmail?: string | null;
}) {
  const [submitted, setSubmitted] = useState<boolean>(!!savedEmail);

  const exits = (
    <div className="mt-4 flex gap-5">
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

  // Once an email is captured (or was already), show the waitlist email form.
  if (onCaptureEmail && !submitted) {
    return (
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${PORTAL_POSTER})` }}
        />
        <div className="absolute inset-0 bg-black/80" />
        <InscriptionInput
          prompt={"End of Act I.\nAct II — Exile and Becoming — awaits.\nWhere shall the griot send word when it begins?"}
          placeholder="you@example.com"
          type="email"
          submitLabel="Summon me for Act II"
          poster={PORTAL_POSTER}
          onSubmit={(email) => {
            onCaptureEmail(email);
            setSubmitted(true);
          }}
          onSkip={() => setSubmitted(true)}
          optional
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${PORTAL_POSTER})` }}
      />
      <div className="absolute inset-0 bg-black/78" />

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="anthro-serif text-[0.8rem] uppercase tracking-[0.34em] text-[var(--gold)]">
          End of Act I
        </p>
        <h1 className="anthro-serif text-[2rem] leading-tight text-[var(--cream)] md:text-[2.6rem]">
          The Child Who Could Not Walk
        </h1>
        <p className="anthro-serif max-w-md text-[1.05rem] italic leading-relaxed text-[var(--cream-dim)]">
          You uprooted the baobab and laid it at your mother&rsquo;s door. You
          are no longer a story someone else told about you. You are your own
          legend now — walking.
        </p>
        <div className="mx-auto my-1 h-px w-16 bg-[rgba(246,223,182,0.3)]" />
        <p className="text-[0.82rem] uppercase tracking-[0.26em] text-[var(--cream-dim)]">
          {savedEmail || submitted
            ? "The griot will summon you for Act II"
            : "Act II — Exile and Becoming — awaits"}
        </p>

        {exits}
      </motion.div>
    </div>
  );
}
