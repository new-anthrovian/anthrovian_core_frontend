import { prisma } from "@/lib/db";

// Cross-device resume: given an email, return the latest playthrough's state
// + its device token so the new device can adopt it and continue. Game state
// is non-sensitive, so a direct lookup (no magic link) is acceptable here.
export const dynamic = "force-dynamic";

function normEmail(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim().toLowerCase() : null;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => null);
    const email = normEmail(body?.email);
    if (!email) {
      return Response.json({ ok: true, found: false });
    }
    const row = await prisma.playthrough.findFirst({
      where: { playerEmail: email },
      orderBy: { updatedAt: "desc" },
    });
    if (!row) {
      return Response.json({ ok: true, found: false });
    }
    return Response.json({
      ok: true,
      found: true,
      state: row.state,
      deviceToken: row.deviceToken,
    });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
