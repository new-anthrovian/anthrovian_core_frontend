"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CarvedChoiceButton, { type CarvedVariant } from "./CarvedChoiceButton";

export interface ChoiceLayerOption {
  key: string;
  label: string;
}

/**
 * Griot prompt + carved choice buttons. Options appear ONE AT A TIME
 * with a beat between them; Scene 3 and Scene 9 also use a 2s pre-delay
 * before the first option (script requirement).
 */
export default function ChoiceLayer({
  prompt,
  options,
  variant = "wood",
  onChoose,
  preDelayMs = 900,
  revealStaggerMs = 900,
  poster,
}: {
  prompt?: string;
  options: ChoiceLayerOption[];
  variant?: CarvedVariant;
  onChoose: (key: string) => void;
  preDelayMs?: number;
  revealStaggerMs?: number;
  poster?: string;
}) {
  const reduce = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (reduce) {
      setVisibleCount(options.length);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < options.length; i++) {
      timers.push(
        setTimeout(
          () => setVisibleCount((c) => Math.max(c, i + 1)),
          preDelayMs + i * revealStaggerMs
        )
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [options.length, preDelayMs, revealStaggerMs, reduce]);

  const handleChoose = (key: string) => {
    if (locked) return;
    setLocked(true);
    onChoose(key);
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
        <div className="mx-auto flex min-h-full max-w-xl flex-col justify-end gap-5 px-6 pb-10 pt-24">
          {prompt && (
            <motion.p
              className="anthro-serif whitespace-pre-line text-[1.15rem] leading-relaxed text-[var(--cream)] md:text-[1.3rem]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {prompt}
            </motion.p>
          )}

          <div className="flex flex-col gap-3">
            {options.map((opt, i) =>
              i < visibleCount ? (
                <CarvedChoiceButton
                  key={opt.key}
                  index={i}
                  label={opt.label}
                  variant={variant}
                  disabled={locked}
                  onClick={() => handleChoose(opt.key)}
                />
              ) : (
                <div key={opt.key} className="h-[58px]" aria-hidden />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
