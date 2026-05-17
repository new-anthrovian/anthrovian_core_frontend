/* =============================================================
   Progress / decision sync abstraction.

   FRONTEND-ONLY FOR NOW. These functions are intentionally
   fire-and-forget no-ops (they only mirror to localStorage). When
   the NestJS + Postgres + Prisma backend lands, swap the bodies for
   API calls and add an auth gate at /awaken — no game code changes.

   The game NEVER awaits these. A failed/absent backend must never
   block play (offline-first / 3G-resilient design goal).
   ============================================================= */

import type { DecisionRecord, GameState } from "./types";

const DECISIONS_KEY = "anthrovian-sundiata-decisions";

/** Append-only local log of every decision — backend-ready shape. */
function appendLocalDecision(decision: DecisionRecord): void {
  try {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(DECISIONS_KEY);
    const list: DecisionRecord[] = raw ? JSON.parse(raw) : [];
    list.push(decision);
    localStorage.setItem(DECISIONS_KEY, JSON.stringify(list));
  } catch {
    // Silently fail
  }
}

/**
 * Record a single decision. Fire-and-forget — call without awaiting.
 * Later: POST /playthrough/decisions.
 */
export function recordDecision(decision: DecisionRecord): void {
  appendLocalDecision(decision);
  // Backend hook (later):
  //   void fetch("/api/playthrough/decisions", { method: "POST", body: ... })
  //     .catch(() => { /* never block the game */ });
}

/**
 * Mirror the full game state. Fire-and-forget — call without awaiting.
 * Later: PATCH /playthrough.
 */
export function syncProgress(_state: GameState): void {
  // No-op today; persistence.ts already owns the localStorage save.
  // Backend hook (later):
  //   void fetch("/api/playthrough", { method: "PATCH", body: ... })
  //     .catch(() => { /* never block the game */ });
}

/** Read the local decision log (useful for later acts / debugging). */
export function getRecordedDecisions(): DecisionRecord[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(DECISIONS_KEY);
    return raw ? (JSON.parse(raw) as DecisionRecord[]) : [];
  } catch {
    return [];
  }
}

/** Clear the local decision log (on RESTART). */
export function clearRecordedDecisions(): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(DECISIONS_KEY);
  } catch {
    // Silently fail
  }
}
