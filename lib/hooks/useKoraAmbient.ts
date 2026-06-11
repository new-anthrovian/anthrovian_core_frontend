"use client";

import { useEffect, useRef } from "react";

/** localStorage key for the player's kora mute preference. Shared with
 *  the KoraMuteButton component that toggles it from the corner cluster. */
export const KORA_MUTE_KEY = "anthrovian-kora-muted";

/** Custom DOM event the mute button dispatches when the player toggles
 *  muted/unmuted. Any live `useKoraAmbient` instance listens and adjusts
 *  its volume on the fly — no React state plumbing needed across
 *  unrelated components. */
const KORA_MUTE_EVENT = "anthrovian:kora-mute-change";

/** Read the player's persisted mute preference. SSR-safe. */
export function readKoraMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KORA_MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Set + persist the mute preference and notify live listeners. */
export function setKoraMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KORA_MUTE_KEY, muted ? "1" : "0");
  } catch {
    /* private mode etc. — fall back to in-memory event only */
  }
  window.dispatchEvent(new CustomEvent(KORA_MUTE_EVENT, { detail: { muted } }));
}

/**
 * Mount-scoped looping kora playback. Drop into any component that
 * occupies the screen during a "silent" beat (text overlays, card
 * stages). The hook handles:
 *   - autoplay with a quiet ~1s volume fade-in on mount
 *   - ~0.6s fade-out on unmount (then pause)
 *   - respecting the player's localStorage mute preference
 *   - live-updating volume when the mute button is toggled mid-play
 *   - swallowing autoplay rejections silently (the player has already
 *     completed a user gesture by tapping Begin on /awaken before any
 *     text overlay can render, so this should never reject in practice)
 *
 * @param src URL of the audio asset (usually `KORA_AMBIENT` from story-data)
 * @param targetVolume Peak volume the fade-in approaches, 0..1. Default 0.35.
 */
export function useKoraAmbient(
  src: string | undefined,
  targetVolume: number = 0.35
): void {
  // Stash the latest targetVolume in a ref so the effect doesn't need to
  // re-run when the consumer accidentally passes a fresh number on every
  // render — only `src` should drive remount/restart behavior.
  const targetRef = useRef(targetVolume);
  targetRef.current = targetVolume;

  useEffect(() => {
    if (!src || typeof window === "undefined") return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;

    let fadeInId: ReturnType<typeof setInterval> | null = null;
    let fadeOutId: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const applyMutedState = () => {
      const muted = readKoraMuted();
      audio.muted = muted;
    };
    applyMutedState();

    const onMuteChange = () => applyMutedState();
    window.addEventListener(KORA_MUTE_EVENT, onMuteChange);

    // Try to start playback. If the browser blocks autoplay (shouldn't
    // happen in normal flow — /awaken's Begin tap counts as the gesture)
    // we silently give up; the silence is the same as before.
    audio.play().then(
      () => {
        if (cancelled) return;
        // Linear fade-in over ~1s (20 steps × 50ms).
        const peak = Math.max(0, Math.min(1, targetRef.current));
        let step = 0;
        const STEPS = 20;
        fadeInId = setInterval(() => {
          step++;
          audio.volume = (peak * step) / STEPS;
          if (step >= STEPS) {
            if (fadeInId) clearInterval(fadeInId);
            fadeInId = null;
          }
        }, 50);
      },
      () => {
        /* autoplay blocked — bail quietly */
      }
    );

    return () => {
      cancelled = true;
      window.removeEventListener(KORA_MUTE_EVENT, onMuteChange);
      if (fadeInId) clearInterval(fadeInId);

      // ~0.6s fade-out, then pause. If unmount fires before the fade-in
      // finishes, we begin from whatever volume the audio is currently at.
      const startVol = audio.volume;
      let step = 0;
      const STEPS = 12;
      fadeOutId = setInterval(() => {
        step++;
        audio.volume = startVol * (1 - step / STEPS);
        if (step >= STEPS) {
          if (fadeOutId) clearInterval(fadeOutId);
          audio.pause();
          audio.src = "";
        }
      }, 50);
    };
  }, [src]);
}
