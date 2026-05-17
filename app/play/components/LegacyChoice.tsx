"use client";

import type { ChoiceKey } from "@/lib/types";
import { LEGACY_CHOICE } from "@/lib/story-data";
import ChoiceLayer from "./ChoiceLayer";

/**
 * Choice 10 — the optional Legacy moment. Shown only when Act III is
 * finished in under 18 minutes. No score impact; sets a LEGACY_* tag
 * that adds one line to the ending. Intimate, quiet pacing.
 */
export default function LegacyChoice({
  onChoose,
}: {
  onChoose: (key: ChoiceKey) => void;
}) {
  return (
    <ChoiceLayer
      prompt={LEGACY_CHOICE.prompt}
      options={LEGACY_CHOICE.options.map((o) => ({
        key: o.key,
        label: o.text,
      }))}
      variant="wood"
      preDelayMs={1400}
      revealStaggerMs={1000}
      onChoose={(key) => onChoose(key as ChoiceKey)}
    />
  );
}
