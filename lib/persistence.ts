/* =============================================================
   localStorage save/load for "Sundiata's Rise".
   The whole GameState is JSON-serializable. A version mismatch
   means the save predates a logic change — ignore it rather than
   feed a stale shape into the reducer.
   ============================================================= */

import type { GameState } from "./types";

const SAVE_KEY = "anthrovian-sundiata-save";
const SAVE_VERSION = 1;

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
    const parsed = JSON.parse(raw) as GameState;
    if (parsed?.version !== SAVE_VERSION) {
      clearSave();
      return null;
    }
    return parsed;
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
