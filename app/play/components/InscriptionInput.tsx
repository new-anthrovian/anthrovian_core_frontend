"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Sacred-Grandeur text-capture screen. Reused for the griot name prompt
 * and the Amina email prompt. Poster backdrop + scrim + serif prompt +
 * carved input + carved submit + optional Skip. Soft validation only.
 */
export default function InscriptionInput({
  prompt,
  placeholder,
  type = "text",
  submitLabel = "Continue",
  optional = false,
  poster,
  onSubmit,
  onSkip,
  busy = false,
  error,
}: {
  prompt: string;
  placeholder?: string;
  type?: "text" | "email";
  submitLabel?: string;
  optional?: boolean;
  poster?: string;
  onSubmit: (value: string) => void;
  onSkip?: () => void;
  busy?: boolean;
  error?: string | null;
}) {
  const [value, setValue] = useState("");
  const reduce = useReducedMotion();

  const trimmed = value.trim();
  const emailish = type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const hasValue = trimmed.length > 0;
  const canSubmit = !busy && hasValue && emailish;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) onSubmit(trimmed);
  };

  return (
    <div className="absolute inset-0">
      {poster && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
          aria-hidden
        />
      )}
      <div className="anthro-scrim" />

      <motion.form
        onSubmit={submit}
        className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="anthro-serif max-w-md whitespace-pre-line text-[1.25rem] leading-snug text-[var(--cream)] md:text-[1.5rem]">
          {prompt}
        </p>

        <input
          type={type}
          inputMode={type === "email" ? "email" : "text"}
          autoComplete={type === "email" ? "email" : "name"}
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="carved-input anthro-serif"
          aria-label={prompt}
          maxLength={type === "email" ? 254 : 60}
        />

        {error && (
          <p className="text-[0.85rem] text-[var(--orange)]">{error}</p>
        )}
        {type === "email" && hasValue && !emailish && !error && (
          <p className="text-[0.82rem] text-[var(--cream-dim)]">
            That doesn&rsquo;t look like an email yet…
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          // !text-center forces the carved-btn's default left-align off —
          // base .carved-btn is text-align:left for multi-line choice prose;
          // the InscriptionInput submit is always a single word and needs
          // to be centered. The Tailwind important modifier ensures this
          // override wins regardless of CSS load order.
          className="carved-btn carved-btn--wood anthro-serif max-w-sm !text-center"
        >
          {busy ? "…" : submitLabel}
        </button>

        {optional && onSkip && (
          <button
            type="button"
            onClick={onSkip}
            disabled={busy}
            className="text-[0.85rem] uppercase tracking-[0.2em] text-[var(--cream-dim)] underline-offset-4 hover:text-[var(--cream)] hover:underline"
          >
            Skip
          </button>
        )}
      </motion.form>
    </div>
  );
}
