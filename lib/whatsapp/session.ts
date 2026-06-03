/**
 * WhatsApp channel session — load/save/link helpers keyed by E.164 phone.
 *
 * The conversation is the "device" here: there's no localStorage involved,
 * so the server's `WhatsAppSession.state` is the ONLY source of truth for
 * a WhatsApp playthrough (unlike the web channel, which is offline-first
 * with localStorage primary + Playthrough as best-effort mirror).
 *
 * Reuses `initialGameState` and the existing `GameState` shape so the same
 * pure `gameReducer` drives both channels — zero duplication of game logic.
 */

import { prisma } from "@/lib/db";
import { initialGameState } from "@/lib/story-engine";
import type { GameState } from "@/lib/types";

/** Twilio delivers phones as `whatsapp:+2348012345678`. Strip the prefix. */
export function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const stripped = trimmed.startsWith("whatsapp:")
    ? trimmed.slice("whatsapp:".length)
    : trimmed;
  return stripped.startsWith("+") ? stripped : `+${stripped}`;
}

/** Lowercased + trimmed, or null when blank. Matches lib/api/identity. */
function normEmail(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim().toLowerCase() : null;
}

export interface SessionRow {
  state: GameState;
  lastMsgId: string | null;
  playerName: string | null;
  playerEmail: string | null;
  lastInboundAt: Date | null;
}

/**
 * Read a session by phone. Returns null if no row exists yet — caller
 * should `getOrCreateSession` instead when handling the first inbound.
 */
export async function loadSessionByPhone(
  phone: string
): Promise<SessionRow | null> {
  const row = await prisma.whatsAppSession.findUnique({
    where: { phone: normalizePhone(phone) },
    select: {
      state: true,
      lastMsgId: true,
      playerName: true,
      playerEmail: true,
      lastInboundAt: true,
    },
  });
  if (!row) return null;
  return {
    state: row.state as unknown as GameState,
    lastMsgId: row.lastMsgId,
    playerName: row.playerName,
    playerEmail: row.playerEmail,
    lastInboundAt: row.lastInboundAt,
  };
}

/**
 * Get-or-create. Used at the very first inbound message from a phone.
 * On create the session starts at `initialGameState` (phase = "griot_intro").
 */
export async function getOrCreateSession(
  phone: string
): Promise<{ state: GameState; isNew: boolean }> {
  const normalized = normalizePhone(phone);
  const existing = await prisma.whatsAppSession.findUnique({
    where: { phone: normalized },
    select: { state: true },
  });
  if (existing) {
    return { state: existing.state as unknown as GameState, isNew: false };
  }
  await prisma.whatsAppSession.create({
    data: {
      phone: normalized,
      state: { ...initialGameState, startedAt: Date.now() } as unknown as object,
    },
  });
  return {
    state: { ...initialGameState, startedAt: Date.now() },
    isNew: true,
  };
}

/**
 * Persist new state. Optionally records `lastMsgId` for idempotency and
 * bumps `lastInboundAt` (the 24-hour Meta re-engagement window clock).
 * Performs `update` only — caller MUST have created the row already
 * (via getOrCreateSession) so we don't accidentally re-seed a deleted one.
 */
export async function saveSession(args: {
  phone: string;
  state: GameState;
  lastMsgId?: string | null;
  bumpInbound?: boolean;
}): Promise<void> {
  await prisma.whatsAppSession.update({
    where: { phone: normalizePhone(args.phone) },
    data: {
      state: args.state as unknown as object,
      ...(args.lastMsgId !== undefined ? { lastMsgId: args.lastMsgId } : {}),
      ...(args.bumpInbound ? { lastInboundAt: new Date() } : {}),
    },
  });
}

/**
 * True if this inbound message ID has already been processed for the
 * given phone. Twilio retries on non-2xx; this is how we stay idempotent
 * without UI-visible duplicates.
 */
export async function isDuplicateMessage(
  phone: string,
  msgId: string
): Promise<boolean> {
  if (!msgId) return false;
  const row = await prisma.whatsAppSession.findUnique({
    where: { phone: normalizePhone(phone) },
    select: { lastMsgId: true },
  });
  return row?.lastMsgId === msgId;
}

/**
 * Link captured name/email to the session AND to a Player row. Mirrors
 * the web channel's /api/identity flow so a player who provides the same
 * email on web and WhatsApp ends up linked to the same Player.
 *
 * Safe to call repeatedly — Player.upsert by unique email; updateMany on
 * the session is a no-op if nothing changed.
 */
export async function linkSessionIdentity(args: {
  phone: string;
  name?: string | null;
  email?: string | null;
}): Promise<void> {
  const normalized = normalizePhone(args.phone);
  const name =
    typeof args.name === "string" && args.name.trim() ? args.name.trim() : null;
  const email = normEmail(args.email);

  let playerId: string | undefined;
  if (email) {
    const player = await prisma.player.upsert({
      where: { email },
      create: { email, name },
      update: name ? { name } : {},
    });
    playerId = player.id;
  }

  await prisma.whatsAppSession.updateMany({
    where: { phone: normalized },
    data: {
      ...(name ? { playerName: name } : {}),
      ...(email ? { playerEmail: email } : {}),
      ...(playerId ? { playerId } : {}),
    },
  });
}
