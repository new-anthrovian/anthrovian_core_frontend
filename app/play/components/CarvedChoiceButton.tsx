"use client";

import { motion } from "framer-motion";

export type CarvedVariant = "wood" | "iron";

/**
 * A single carved choice button. "wood" is the default; "iron" is used
 * only for Scene 3 (the iron-rod test of royal strength).
 */
export default function CarvedChoiceButton({
  label,
  onClick,
  variant = "wood",
  disabled = false,
  index = 0,
}: {
  label: string;
  onClick: () => void;
  variant?: CarvedVariant;
  disabled?: boolean;
  index?: number;
}) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`carved-btn carved-btn--${variant}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      aria-label={label}
      data-choice-index={index}
    >
      {label}
    </motion.button>
  );
}
