import { PrismaClient, Prisma } from '@prisma/client';

const DATABASE_URI = process.env.DATABASE_URL;

declare global {
  // We need `var` to declare a global variable in TypeScript
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient({ datasourceUrl: DATABASE_URI });
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    datasourceUrl: DATABASE_URI,
  });

export const getPrismaClient = () => prisma;

export const myPrisma = () => Prisma;