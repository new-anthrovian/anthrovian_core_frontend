/* =============================================================
   Progress / identity sync — best-effort server mirror.

   OFFLINE-FIRST: every call here is fire-and-forget. The game NEVER
   awaits these and they NEVER throw into game code. localStorage
   (persistence.ts) remains the source of truth; a failed/absent/slow
   server has zero effect on gameplay. Each sync sends the FULL state,
   so the server self-heals to latest on the next success — no retry
   queue needed.
   ============================================================= */

import type { DecisionRecord, GameState } from "./types";
import { getDeviceToken } from "./device-token";

const DECISIONS_KEY = "anthrovian-sundiata-decisions";

/* ---------- local decision log (unchanged) ---------- */

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

export function recordDecision(decision: DecisionRecord): void {
  // Logged locally; flushed to the server with the next syncProgress().
  appendLocalDecision(decision);
}

export function getRecordedDecisions(): DecisionRecord[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(DECISIONS_KEY);
    return raw ? (JSON.parse(raw) as DecisionRecord[]) : [];
  } catch {
    return [];
  }
}

export function clearRecordedDecisions(): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(DECISIONS_KEY);
  } catch {
    // Silently fail
  }
}

/* ---------- server sync (fire-and-forget) ---------- */

function post(url: string, body: unknown): void {
  if (typeof window === "undefined") return;
  try {
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true, // survive page unload / navigation
    }).catch(() => {
      /* never block or surface to the game */
    });
  } catch {
    // ignore (e.g. fetch unavailable)
  }
}

/** Mirror the full game state to the server. Fire-and-forget. */
export function syncProgress(state: GameState): void {
  const deviceToken = getDeviceToken();
  if (!deviceToken) return; // storage unavailable — stay local-only
  post("/api/playthrough", {
    deviceToken,
    state,
    decisions: getRecordedDecisions(),
    name: state.playerName,
    email: state.playerEmail,
  });
}

/** Link a captured name and/or email to this device. Fire-and-forget. */
export function linkIdentity(identity: { name?: string; email?: string }): void {
  const deviceToken = getDeviceToken();
  if (!deviceToken) return;
  post("/api/identity", { deviceToken, ...identity });
}
