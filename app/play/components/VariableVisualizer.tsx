"use client";

import { useEffect, useRef, useState } from "react";
import type { Variable } from "@/lib/types";

/* Mandé symbols — leaf = Badenya, fist = Fadenya, spiral = Nyama. */

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
      <path
        d="M12 2C6 6 4 12 5 20c8 1 14-3 17-11C16 8 13 5 12 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M6 19C9 14 13 10 19 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FistIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
      <path
        d="M6 11V8.5a1.5 1.5 0 0 1 3 0V10m0 0V7a1.5 1.5 0 0 1 3 0v3m0 0V7.5a1.5 1.5 0 0 1 3 0V11m0 0a1.5 1.5 0 0 1 3 0v3.5A6.5 6.5 0 0 1 11.5 21H10a6 6 0 0 1-6-6v-1.5a1.5 1.5 0 0 1 2-1.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpiralIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
      <path
        d="M12 12a2 2 0 1 1 2 2c-2.2 0-4-1.8-4-4a5 5 0 0 1 5-5c3.3 0 6 2.7 6 6a8 8 0 0 1-8 8c-4.4 0-8-3.6-8-8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

const SYMBOLS: {
  key: Variable;
  label: string;
  color: string;
  Icon: () => React.ReactElement;
}[] = [
  { key: "badenya", label: "Badenya", color: "var(--cream)", Icon: LeafIcon },
  { key: "fadenya", label: "Fadenya", color: "var(--orange)", Icon: FistIcon },
  { key: "nyama", label: "Nyama", color: "var(--nyama)", Icon: SpiralIcon },
];

/**
 * Three Mandé symbols. Unlit during play; the symbol matching the most
 * recent score increase pulses once. Fully lit only when `revealed`.
 * NEVER shows numbers.
 */
export default function VariableVisualizer({
  lastIncreasedVar,
  pulseKey,
  revealed = false,
  className = "",
}: {
  lastIncreasedVar: Variable | null;
  /** Changes each choice — re-triggers the pulse animation. */
  pulseKey: number;
  revealed?: boolean;
  className?: string;
}) {
  const [pulsing, setPulsing] = useState<Variable | null>(null);
  const lastSeen = useRef<number>(pulseKey);

  useEffect(() => {
    if (pulseKey === lastSeen.current) return;
    lastSeen.current = pulseKey;
    if (!lastIncreasedVar) return;
    setPulsing(lastIncreasedVar);
    const t = setTimeout(() => setPulsing(null), 1400);
    return () => clearTimeout(t);
  }, [pulseKey, lastIncreasedVar]);

  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      aria-hidden={!revealed}
    >
      {SYMBOLS.map(({ key, label, color, Icon }) => {
        // Unlit during play; fully lit only on the ending screen.
        const lit = revealed;
        const isPulsing = pulsing === key;
        return (
          <div
            key={key}
            className={`var-symbol ${lit ? "var-symbol--lit" : ""} ${
              isPulsing ? "var-symbol--pulse" : ""
            }`}
            style={{ color, width: revealed ? 34 : 22, height: revealed ? 34 : 22 }}
            title={revealed ? label : undefined}
          >
            <Icon />
          </div>
        );
      })}
    </div>
  );
}
