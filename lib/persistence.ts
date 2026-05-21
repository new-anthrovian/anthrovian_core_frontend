/* =============================================================
   localStorage save/load for "Sundiata's Rise".
   The whole GameState is JSON-serializable. A version mismatch
   means the save predates a logic change — ignore it rather than
   feed a stale shape into the reducer.
   ============================================================= */

import type { GameState } from "./types";

const SAVE_KEY = "anthrovian-sundiata-save";
const SAVE_VERSION = 2;

/**
 * Bring an older save forward to the current shape rather than discard it
 * (so returning players don't lose progress on a version bump). Returns
 * null only if the save is too old/foreign to migrate.
 */
function migrate(parsed: unknown): GameState | null {
  if (!parsed || typeof parsed !== "object") return null;
  let s = parsed as Record<string, unknown>;
  if (typeof s.version !== "number") return null;
  // v1 -> v2: identity fields added.
  if (s.version === 1) {
    s = { ...s, version: 2, playerName: null, playerEmail: null };
  }
  return s.version === SAVE_VERSION ? (s as unknown as GameState) : null;
}

export function saveGame(state: GameState): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail (private browsing, quota exceeded, etc.)
  }
}

export function loadGame(): GameState | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const migrated = migrate(parsed);
    if (!migrated) {
      clearSave();
      return null;
    }
    return migrated;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Silently fail
  }
}

export function hasSave(): boolean {
  try {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}
