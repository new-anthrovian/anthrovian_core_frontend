"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { KORA_AMBIENT } from "@/lib/story-data";
import { useKoraAmbient } from "@/lib/hooks/useKoraAmbient";

/** Paragraphs per page. Two keeps each screen scannable on mobile
 *  without scrolling for typical griot-prose paragraph lengths. */
const PARAGRAPHS_PER_PAGE = 2;

/**
 * Renders griot narration (paragraphs split on \n\n) over a still poster.
 *
 * Used for any text-only beat — Iron Rod setup, Scene 9 setup, branch
 * responses where no video was delivered, the Amina teaser narration
 * stage. The text is paginated into short pages so the player isn't
 * looking at a long scroll on mobile: each page shows up to
 * PARAGRAPHS_PER_PAGE paragraphs that fade in one-by-one, then the
 * "Continue" button appears and advances either to the next page or,
 * on the final page, to the next phase.
 *
 * Audio: this is where the looping kora ambience plays. Video scenes
 * have their own baked-in audio (griot VO + kora + SFX in the mp4);
 * text-only scenes would be silent without this. The kora rides under
 * the prose at low volume, keeps playing across page advances (this
 * component stays mounted), and respects the player's mute toggle.
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
  // Split the narration into pages of N paragraphs. Recomputed only when
  // text changes — different scenes / branches mount fresh instances.
  const pages = useMemo(() => {
    const all = text.split("\n\n").filter(Boolean);
    const grouped: string[][] = [];
    for (let i = 0; i < all.length; i += PARAGRAPHS_PER_PAGE) {
      grouped.push(all.slice(i, i + PARAGRAPHS_PER_PAGE));
    }
    return grouped.length > 0 ? grouped : [[]];
  }, [text]);

  const [pageIdx, setPageIdx] = useState(0);
  const [settled, setSettled] = useState(false);

  const currentPage = pages[Math.min(pageIdx, pages.length - 1)];
  const isLastPage = pageIdx >= pages.length - 1;

  // Layer the kora bed under the text. Hook handles fade in/out, mute
  // state, and silent autoplay-block fallback. Mount-scoped so it
  // continues across page advances within this component.
  useKoraAmbient(KORA_AMBIENT);

  // Reset the "settled" gate every time the page changes so the button
  // stays hidden until the new page's paragraphs have all animated in.
  useEffect(() => {
    setSettled(false);
    const total = currentPage.length * paragraphDelayMs + 600;
    const t = setTimeout(() => setSettled(true), total);
    return () => clearTimeout(t);
  }, [pageIdx, currentPage.length, paragraphDelayMs]);

  const handleAdvance = () => {
    if (isLastPage) {
      onAdvance();
    } else {
      setPageIdx((i) => i + 1);
    }
  };

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
        {/* justify-center vertically centers the paragraphs in the viewport
            now that pagination keeps each page short — `justify-end` (the
            previous value) was correct when the whole narration rendered
            at once and filled the screen, but with 2 paragraphs per page
            it left a large empty band at the top, especially on desktop.
            `pb-32` keeps clearance for the page dots + Continue button
            sitting absolutely at the bottom; `pt-24` keeps clearance for
            corner controls. */}
        <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-center gap-4 px-6 pb-32 pt-24">
          {currentPage.map((p, i) => (
            <p
              // `pageIdx` in the key forces a remount on page change so
              // the griot-line fade-in animation re-runs cleanly.
              key={`${pageIdx}-${i}`}
              className="anthro-serif griot-line text-[1.15rem] leading-relaxed text-[var(--cream)] md:text-[1.3rem]"
              style={{ animationDelay: `${i * paragraphDelayMs}ms` }}
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-8">
        {/* Subtle page-position indicator. Only renders for multi-page
            narration so single-page beats stay visually clean. */}
        {pages.length > 1 && (
          <div
            className="flex gap-1.5"
            aria-label={`Page ${pageIdx + 1} of ${pages.length}`}
          >
            {pages.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  i <= pageIdx
                    ? "bg-[var(--cream)]"
                    : "bg-[rgba(246,223,182,0.25)]"
                }`}
              />
            ))}
          </div>
        )}
        <motion.button
          type="button"
          onClick={handleAdvance}
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
