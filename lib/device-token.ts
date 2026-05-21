/* =============================================================
   Anonymous device token.

   A per-device UUID that keys the player's server-side progress from
   the very first scene — before any name/email is captured. It is
   intentionally NOT part of GameState and is NOT cleared by
   clearSave()/RESTART, so a device keeps its identity across replays.

   On a constrained environment (SSR, private mode, storage disabled)
   reads return "" and callers skip server sync — the game still works
   fully offline via localStorage.
   ============================================================= */

const TOKEN_KEY = "anthrovian-device-token";

export function getDeviceToken(): string {
  if (typeof window === "undefined") return "";
  try {
    let token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      token =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `dt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(TOKEN_KEY, token);
    }
    return token;
  } catch {
    return "";
  }
}

/** Adopt a token from another device (cross-device restore). */
export function setDeviceToken(token: string): void {
  if (typeof window === "undefined" || !token) return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
}
