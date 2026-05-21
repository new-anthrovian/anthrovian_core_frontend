import { prisma } from "@/lib/db";

// Server progress mirror. Called fire-and-forget from the client's
// syncProgress(); the game never awaits this, so resilience > strictness.
export const dynamic = "force-dynamic";

function normEmail(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim().toLowerCase() : null;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => null);
    const deviceToken: unknown = body?.deviceToken;
    const state = body?.state;
    if (typeof deviceToken !== "string" || !deviceToken || !state) {
      return Response.json({ ok: false, error: "missing deviceToken or state" }, { status: 400 });
    }

    const scores = state.scores ?? {};
    const email = normEmail(body?.email ?? state.playerEmail);
    const name: string | null =
      (typeof body?.name === "string" && body.name) ||
      (typeof state.playerName === "string" && state.playerName) ||
      null;

    // Link/create the Player when we have an email.
    let playerId: string | undefined;
    if (email) {
      const player = await prisma.player.upsert({
        where: { email },
        create: { email, name },
        update: name ? { name } : {},
      });
      playerId = player.id;
    }

    const data = {
      state,
      decisions: Array.isArray(body?.decisions) ? body.decisions : [],
      badenya: Number(scores.badenya) || 0,
      fadenya: Number(scores.fadenya) || 0,
      nyama: Number(scores.nyama) || 0,
      endingId: state.endingId ?? null,
      phase: state.phase ?? null,
      playerName: name,
      playerEmail: email,
      ...(playerId ? { playerId } : {}),
    };

    const row = await prisma.playthrough.upsert({
      where: { deviceToken },
      create: { deviceToken, ...data },
      update: data,
    });

    return Response.json({ ok: true, updatedAt: row.updatedAt });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
