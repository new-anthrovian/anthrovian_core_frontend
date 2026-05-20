import { prisma } from "@/lib/db";

// Fetch a playthrough by device token (diagnostics + a building block for
// the cross-device restore flow).
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ token: string }> }
): Promise<Response> {
  try {
    const { token } = await ctx.params;
    const row = await prisma.playthrough.findUnique({
      where: { deviceToken: token },
    });
    if (!row) {
      return Response.json({ ok: true, found: false }, { status: 404 });
    }
    return Response.json({
      ok: true,
      found: true,
      state: row.state,
      updatedAt: row.updatedAt,
    });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
