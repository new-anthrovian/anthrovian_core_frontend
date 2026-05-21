import { PrismaClient } from "@prisma/client";

/**
 * Global singleton PrismaClient. Next.js dev hot-reload and serverless
 * invocations would otherwise spawn a new client (and connection pool)
 * per reload/request, exhausting Postgres connections.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
