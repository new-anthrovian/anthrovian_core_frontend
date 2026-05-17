"use client";

import { motion } from "framer-motion";
import type { ReflectionCard as ReflectionCardData } from "@/lib/types";
import CarvedFrame from "./CarvedFrame";

/** The proverb + "Soul's Mirror" question shown after an ending. */
export default function ReflectionCard({
  reflection,
}: {
  reflection: ReflectionCardData;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <CarvedFrame className="px-7 py-7">
        <p className="anthro-serif text-center text-[0.78rem] uppercase tracking-[0.32em] text-[var(--gold)]">
          Reflection
        </p>
        <p className="anthro-serif mt-4 text-center text-[1.15rem] italic leading-relaxed text-[var(--cream)] md:text-[1.3rem]">
          &ldquo;{reflection.proverb}&rdquo;
        </p>
        <div className="mx-auto my-5 h-px w-16 bg-[rgba(246,223,182,0.3)]" />
        <p className="text-center text-[0.7rem] uppercase tracking-[0.28em] text-[var(--cream-dim)]">
          Soul&rsquo;s Mirror
        </p>
        <p className="mt-3 text-center text-[0.98rem] leading-relaxed text-[var(--cream-dim)]">
          {reflection.soulsMirror}
        </p>
      </CarvedFrame>
    </motion.div>
  );
}
