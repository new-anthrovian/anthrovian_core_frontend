"use client";

import { useEffect, useRef, useState } from "react";

/** How long the video may sit buffering before we offer a manual skip. */
const STALL_TIMEOUT_MS = 14000;

/**
 * NetworkInformation API — only Chromium implements it broadly. Always
 * optional, always read defensively. Safari/Firefox return undefined.
 */
type NetConn = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g" | string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

/**
 * True when the user is on a constrained connection — Save-Data mode
 * is on, or the effective network is 2g/3g. On those we (a) use the
 * lighter `preload="metadata"` for the main <video> and (b) skip the
 * hidden next-scene preload entirely. Browsers without NetInfo API
 * return false (treat as unconstrained — best guess).
 */
function isConstrainedConnection(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: NetConn }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  const t = conn.effectiveType;
  return t === "slow-2g" || t === "2g" || t === "3g";
}

/**
 * Full-bleed video player. Videos have baked-in audio (griot VO + kora +
 * SFX) so they are NEVER muted. Audible autoplay is unlocked by the
 * /awaken Begin tap; if a .play() still rejects, a tap-to-continue
 * overlay recovers.
 *
 * Robustness: if the video errors (404 / decode failure) or stalls for
 * too long, a "tap to continue" overlay calls onEnded so a broken asset
 * degrades to a skip instead of hard-stalling the whole game.
 *
 * Mobile friendliness: on Save-Data or slow connections we drop
 * preload to "metadata" and skip preloading the next scene.
 */
export default function VideoStage({
  src,
  poster,
  onEnded,
  nextSrc,
  showBuffering = true,
  paused = false,
  playbackRate = 1,
}: {
  src: string;
  poster?: string;
  onEnded: () => void;
  nextSrc?: string;
  showBuffering?: boolean;
  /** When true (e.g. the pause menu is open) the video holds. */
  paused?: boolean;
  /** Speeds up the griot's baked-in voice. Pitch is preserved. */
  playbackRate?: number;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [needsTap, setNeedsTap] = useState(false);
  const [buffering, setBuffering] = useState(true);
  // The asset errored, or stalled past STALL_TIMEOUT_MS — offer a skip.
  const [faulted, setFaulted] = useState(false);
  // Save-Data / 2g / 3g — kept in state so it can react to connection changes.
  const [constrained, setConstrained] = useState(false);

  // Detect (and re-detect) Save-Data + effective connection type. Runs
  // once on mount with a `change` listener for live updates. SSR-safe.
  useEffect(() => {
    setConstrained(isConstrainedConnection());
    const conn = (navigator as Navigator & { connection?: NetConn }).connection;
    if (!conn?.addEventListener) return;
    const onChange = () => setConstrained(isConstrainedConnection());
    conn.addEventListener("change", onChange);
    return () => conn.removeEventListener?.("change", onChange);
  }, []);

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

  // Apply playback speed (a src change resets it, so depend on src too).
  // preservesPitch keeps the griot's voice intelligible when sped up.
  useEffect(() => {
    const el = videoRef.current as
      | (HTMLVideoElement & { preservesPitch?: boolean; webkitPreservesPitch?: boolean })
      | null;
    if (!el) return;
    el.preservesPitch = true;
    el.webkitPreservesPitch = true;
    el.playbackRate = playbackRate;
  }, [playbackRate, src]);

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
      {/* Cinematic letterbox backdrop — blurred/dim poster fills the
          area outside the video frame on mismatched aspect ratios
          (landscape video on a portrait phone, etc.). */}
      {poster && (
        <div
          className="anthro-video-backdrop"
          style={{ backgroundImage: `url("${poster}")` }}
          aria-hidden
        />
      )}
      <video
        key={src}
        ref={videoRef}
        className="anthro-video"
        src={src}
        poster={poster}
        playsInline
        preload={constrained ? "metadata" : "auto"}
        controls={false}
        onEnded={onEnded}
        onError={() => setFaulted(true)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onLoadedMetadata={(e) => {
          // A fresh src can reset playbackRate — re-assert it.
          e.currentTarget.playbackRate = playbackRate;
        }}
        onCanPlay={(e) => {
          setBuffering(false);
          e.currentTarget.playbackRate = playbackRate;
        }}
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

      {/* Warm the buffer for the next scene — skipped on Save-Data /
          slow networks to spare metered mobile data. */}
      {nextSrc && !constrained && (
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
