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
 * Mount-scoped looping kora playback via a hidden <video> element.
 *
 * Why <video> and not <audio>: iOS WebKit (Safari + every iOS Chrome /
 * Firefox / Edge, all forced to WebKit by Apple) silences <audio>
 * elements when the physical silent switch on the side of the phone is
 * on. <video> elements with audio are treated as media playback and
 * play through speakers regardless. The source asset is an mp4
 * (kora-ambient.mp4 — AAC audio + a 1x1 still frame) so iOS WebKit
 * unambiguously accepts it as video. Volume writes are still ignored
 * on iOS (the element plays at hardware volume), so the JS fade-in is
 * a desktop-only nicety — on iOS the kora just starts at full bed
 * volume the moment play() succeeds. Acceptable.
 *
 * The hook handles:
 *   - autoplay with a quiet ~1s volume fade-in on mount (desktop only)
 *   - ~0.6s fade-out on unmount, then pause + detach
 *   - respecting the player's localStorage mute preference
 *   - live-updating muted state when the toolbar toggle flips it
 *   - gesture-unlock retry: if the browser blocks autoplay (typical
 *     after a page refresh), arms a one-time pointerdown/keydown
 *     listener and retries play() on the next user gesture
 *
 * @param src URL of the kora mp4 (usually `KORA_AMBIENT` from story-data)
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

    // Hidden <video> element. iOS requires `playsInline` (without it,
    // play() on iPhone tries to take over the screen in fullscreen
    // mode). The element must be in the DOM for iOS to play it
    // reliably; we place it offscreen rather than `display:none` since
    // some WebKit builds refuse to play `display:none` media.
    const video = document.createElement("video");
    video.src = src;
    video.loop = true;
    video.preload = "auto";
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.crossOrigin = "anonymous";
    video.volume = 0;
    video.style.cssText =
      "position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;";
    document.body.appendChild(video);

    let fadeInId: ReturnType<typeof setInterval> | null = null;
    let fadeOutId: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;
    let unlockListener: (() => void) | null = null;

    const applyMutedState = () => {
      const muted = readKoraMuted();
      video.muted = muted;
    };
    applyMutedState();

    const onMuteChange = () => applyMutedState();
    window.addEventListener(KORA_MUTE_EVENT, onMuteChange);

    const startFadeIn = () => {
      const peak = Math.max(0, Math.min(1, targetRef.current));
      let step = 0;
      const STEPS = 20;
      fadeInId = setInterval(() => {
        step++;
        // iOS Safari silently ignores volume writes, so this loop is
        // effectively a no-op there (the element plays at hardware
        // volume from frame 1). On desktop / Android the fade still
        // swells in normally.
        video.volume = (peak * step) / STEPS;
        if (step >= STEPS) {
          if (fadeInId) clearInterval(fadeInId);
          fadeInId = null;
        }
      }, 50);
    };

    const removeUnlockListener = () => {
      if (!unlockListener) return;
      document.removeEventListener("pointerdown", unlockListener);
      document.removeEventListener("keydown", unlockListener);
      document.removeEventListener("touchend", unlockListener);
      unlockListener = null;
    };

    const tryPlay = () => {
      video.play().then(
        () => {
          if (cancelled) return;
          removeUnlockListener();
          startFadeIn();
        },
        () => {
          // Autoplay blocked — wait for the first user gesture. This is
          // the path a page refresh takes: hydration runs without any
          // recent gesture so the browser rejects play(). The next tap
          // (Continue button, anywhere on the screen, or a key press)
          // counts as the gesture, after which play() succeeds. The
          // listener removes itself on success. touchend is registered
          // alongside pointerdown for older iOS WebKit builds that
          // don't fire pointer events on tap.
          if (cancelled || unlockListener) return;
          unlockListener = () => {
            removeUnlockListener();
            if (!cancelled) tryPlay();
          };
          document.addEventListener("pointerdown", unlockListener, { once: true });
          document.addEventListener("touchend", unlockListener, { once: true });
          document.addEventListener("keydown", unlockListener, { once: true });
        }
      );
    };

    tryPlay();

    return () => {
      cancelled = true;
      removeUnlockListener();
      window.removeEventListener(KORA_MUTE_EVENT, onMuteChange);
      if (fadeInId) clearInterval(fadeInId);

      // ~0.6s fade-out, then pause and detach. If unmount fires before
      // the fade-in finishes, we begin from whatever volume the element
      // is currently at. iOS ignores volume writes — there the pause
      // happens at the end of the timer with no audible fade.
      const startVol = video.volume;
      let step = 0;
      const STEPS = 12;
      const detach = () => {
        try { video.pause(); } catch { /* ignore */ }
        video.removeAttribute("src");
        try { video.load(); } catch { /* ignore */ }
        if (video.parentNode) video.parentNode.removeChild(video);
      };
      fadeOutId = setInterval(() => {
        step++;
        video.volume = startVol * (1 - step / STEPS);
        if (step >= STEPS) {
          if (fadeOutId) clearInterval(fadeOutId);
          detach();
        }
      }, 50);
    };
  }, [src]);
}
