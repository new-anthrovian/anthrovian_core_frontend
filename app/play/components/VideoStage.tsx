"use client";

import { useEffect, useRef, useState } from "react";

/** How long the video may sit buffering before we offer a manual skip. */
const STALL_TIMEOUT_MS = 14000;

/**
 * Full-bleed video player. Videos have baked-in audio (griot VO + kora +
 * SFX) so they are NEVER muted. Audible autoplay is unlocked by the
 * /awaken Begin tap; if a .play() still rejects, a tap-to-continue
 * overlay recovers.
 *
 * Robustness: if the video errors (404 / decode failure) or stalls for
 * too long, a "tap to continue" overlay calls onEnded so a broken asset
 * degrades to a skip instead of hard-stalling the whole game.
 */
export default function VideoStage({
  src,
  poster,
  onEnded,
  nextSrc,
  showBuffering = true,
  paused = false,
}: {
  src: string;
  poster?: string;
  onEnded: () => void;
  nextSrc?: string;
  showBuffering?: boolean;
  /** When true (e.g. the pause menu is open) the video holds. */
  paused?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [needsTap, setNeedsTap] = useState(false);
  const [buffering, setBuffering] = useState(true);
  // The asset errored, or stalled past STALL_TIMEOUT_MS — offer a skip.
  const [faulted, setFaulted] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    setNeedsTap(false);
    setBuffering(true);
    setFaulted(false);
    const tryPlay = async () => {
      try {
        await el.play();
      } catch {
        // Autoplay-with-sound blocked — fall back to an explicit tap.
        setNeedsTap(true);
      }
    };
    void tryPlay();
  }, [src]);

  // Pause / resume when the pause menu opens or closes.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (paused) {
      el.pause();
    } else if (!needsTap && !faulted) {
      void el.play().catch(() => {});
    }
  }, [paused, needsTap, faulted]);

  // Stall watchdog: if we're buffering too long (and not just waiting on a
  // tap or the pause menu), surface a manual skip so the game can't hang.
  useEffect(() => {
    if (!buffering || needsTap || faulted || paused) return;
    const t = setTimeout(() => setFaulted(true), STALL_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [buffering, needsTap, faulted, paused]);

  const handleTap = async () => {
    const el = videoRef.current;
    if (!el) return;
    try {
      await el.play();
      setNeedsTap(false);
    } catch {
      // keep the overlay up
    }
  };

  return (
    <div className="absolute inset-0 bg-black">
      <video
        key={src}
        ref={videoRef}
        className="anthro-video"
        src={src}
        poster={poster}
        playsInline
        preload="auto"
        controls={false}
        onEnded={onEnded}
        onError={() => setFaulted(true)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
      />

      {showBuffering && buffering && !needsTap && !faulted && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[rgba(246,223,182,0.25)] border-t-[var(--gold)]" />
        </div>
      )}

      {/* Autoplay blocked — tapping retries playback. */}
      {needsTap && !faulted && (
        <button
          type="button"
          onClick={handleTap}
          className="anthro-serif absolute inset-0 flex items-center justify-center bg-black/70 text-[1.1rem] tracking-wide text-[var(--cream)]"
        >
          Tap to continue
        </button>
      )}

      {/* Asset errored or stalled — tapping skips past it. */}
      {faulted && (
        <button
          type="button"
          onClick={onEnded}
          className="anthro-serif absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 text-[var(--cream)]"
        >
          <span className="text-[1.05rem] tracking-wide">
            The vision falters
          </span>
          <span className="text-[0.85rem] text-[var(--cream-dim)]">
            Tap to continue
          </span>
        </button>
      )}

      {/* Warm the buffer for the next scene. */}
      {nextSrc && (
        <video
          key={`preload-${nextSrc}`}
          src={nextSrc}
          preload="auto"
          muted
          playsInline
          className="hidden"
          aria-hidden
        />
      )}
    </div>
  );
}
