"use client";

import type { ReactNode } from "react";

/** Shared carved / mud-cloth border used by panels, choice groups, cards. */
export default function CarvedFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`carved-frame ${className}`}>{children}</div>;
}
