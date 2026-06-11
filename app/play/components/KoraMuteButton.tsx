"use client";

import { useEffect, useState } from "react";
import { readKoraMuted, setKoraMuted } from "@/lib/hooks/useKoraAmbient";

/**
 * Round Meet-style toggle that silences the looping kora ambience.
 * Sits in the corner cluster next to SpeedControl. State persists to
 * localStorage so the choice survives reloads. Any active useKoraAmbient
 * hook subscribes to mute changes and adjusts on the fly — no global
 * state plumbing needed.
 *
 * Visually: shows a small musical-note icon. Active (muted) state uses
 * the same gold accent border as SpeedControl when expanded — visually
 * communicates "this control is currently affecting playback."
 */
export default function KoraMuteButton() {
  // Initialize as `false` so SSR + first client render match. The real
  // value is read from localStorage in a layout effect, post-hydration.
  const [muted, setMutedState] = useState<boolean>(false);

  useEffect(() => {
    setMutedState(readKoraMuted());
  }, []);

  const toggle = () => {
    const next = !muted;
    setMutedState(next);
    setKoraMuted(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? "Unmute kora" : "Mute kora"}
      aria-pressed={muted}
      className={`game-ctrl ${muted ? "game-ctrl--active" : ""}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {/* musical note */}
        <path d="M6 12V3l7-1.5V10.5" />
        <ellipse cx="4.5" cy="12" rx="1.5" ry="1.3" />
        <ellipse cx="11.5" cy="10.5" rx="1.5" ry="1.3" />
        {muted && (
          // diagonal slash when muted
          <line x1="1.5" y1="14.5" x2="14.5" y2="1.5" stroke="currentColor" />
        )}
      </svg>
    </button>
  );
}
