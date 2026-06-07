"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PORTAL_POSTER } from "@/lib/story-data";
import InscriptionInput from "./InscriptionInput";

/**
 * Per-act copy. Each entry covers the interlude shown AFTER `act` is
 * finished. The act-3 entry is currently a PARTIAL beat because Scene 9
 * (Final Moral) and the endings haven't been delivered yet — the copy
 * names the krina battle as the latest landed beat. When the rest of
 * Act III ships, this becomes the proper finale interlude. The email-
 * capture moment is shared across acts (waitlist + cross-device key).
 */
const ACT_COPY = {
  1: {
    label: "End of Act I",
    title: "The Child Who Could Not Walk",
    summary:
      "You uprooted the baobab and laid it at your mother’s door. You are no longer a story someone else told about you. You are your own legend now — walking.",
    awaitLine: "Act II — Exile and Becoming — awaits",
    summoned: "The griot will summon you for Act II",
    capturePrompt:
      "End of Act I.\nAct II — Exile and Becoming — awaits.\nWhere shall the griot send word when it begins?",
    submitLabel: "Summon me for Act II",
  },
  2: {
    label: "End of Act II",
    title: "Exile and Becoming",
    summary:
      "The grief was a river. But Sundiata — rivers are also roads. Sogolon is at peace, the twelve kings are listening, and the road bends home.",
    awaitLine: "Act III — The Lion Rises — awaits",
    summoned: "The griot will summon you for Act III",
    capturePrompt:
      "End of Act II.\nAct III — The Lion Rises — awaits.\nWhere shall the griot send word when it begins?",
    submitLabel: "Summon me for Act III",
  },
  3: {
    // Partial — Scene 9 + endings not yet delivered. When they land,
    // ACTIVE_SCENE_COUNT bumps past 8 and the player flows into Choice 9
    // / the legacy moment / their ending instead of this interlude.
    label: "Act III — In Progress",
    title: "The Lion Rises",
    summary:
      "The cock’s spur has flown. Soumaoro Kanté’s invincibility cracks on the plains of Krina. But the smoking city of Sosso still stands before you — and the moral choice that will define the Maghan has not yet been made.",
    awaitLine: "The Final Moral Choice awaits",
    summoned: "The griot will summon you when the rest is sung",
    capturePrompt:
      "The battle of Krina is decided.\nThe moral fulcrum of Mali has not yet been crossed.\nWhere shall the griot send word when the rest is ready?",
    submitLabel: "Summon me when the tale resumes",
  },
} as const;

/**
 * End-of-Act interlude. Shown after the last currently-playable scene
 * of an act (controlled by ACTIVE_SCENE_COUNT). Covers email capture
 * (Act-N+1 waitlist + cross-device resume key) and the act recap.
 */
export default function ActInterlude({
  act = 1,
  onReplay,
  onHome,
  onCaptureEmail,
  savedEmail,
}: {
  /** Which act just ended. Defaults to 1 for backward compatibility. */
  act?: 1 | 2 | 3;
  onReplay: () => void;
  onHome: () => void;
  onCaptureEmail?: (email: string) => void;
  savedEmail?: string | null;
}) {
  const copy = ACT_COPY[act];
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
          prompt={copy.capturePrompt}
          placeholder="you@example.com"
          type="email"
          submitLabel={copy.submitLabel}
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
          {copy.label}
        </p>
        <h1 className="anthro-serif text-[2rem] leading-tight text-[var(--cream)] md:text-[2.6rem]">
          {copy.title}
        </h1>
        <p className="anthro-serif max-w-md text-[1.05rem] italic leading-relaxed text-[var(--cream-dim)]">
          {copy.summary}
        </p>
        <div className="mx-auto my-1 h-px w-16 bg-[rgba(246,223,182,0.3)]" />
        <p className="text-[0.82rem] uppercase tracking-[0.26em] text-[var(--cream-dim)]">
          {savedEmail || submitted ? copy.summoned : copy.awaitLine}
        </p>

        {exits}
      </motion.div>
    </div>
  );
}
