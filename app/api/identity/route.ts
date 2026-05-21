import { prisma } from "@/lib/db";

// Link a name and/or email to an existing device token. Callable twice
// (name during the griot intro, email at the Amina teaser). Fire-and-forget;
// self-heals via the next /api/playthrough sync if it fails.
export const dynamic = "force-dynamic";

function normEmail(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim().toLowerCase() : null;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => null);
    const deviceToken: unknown = body?.deviceToken;
    if (typeof deviceToken !== "string" || !deviceToken) {
      return Response.json({ ok: false }, { status: 400 });
    }
    const name: string | null =
      typeof body?.name === "string" && body.name ? body.name : null;
    const email = normEmail(body?.email);

    let playerId: string | undefined;
    if (email) {
      const player = await prisma.player.upsert({
        where: { email },
        create: { email, name },
        update: name ? { name } : {},
      });
      playerId = player.id;
    }

    // updateMany so it's a no-op (not an error) if the row doesn't exist yet.
    await prisma.playthrough.updateMany({
      where: { deviceToken },
      data: {
        ...(name ? { playerName: name } : {}),
        ...(email ? { playerEmail: email } : {}),
        ...(playerId ? { playerId } : {}),
      },
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
