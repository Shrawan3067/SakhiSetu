import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: env.NODE_ENV === 'test' && env.DATABASE_URL_TEST ? env.DATABASE_URL_TEST : env.DATABASE_URL,
      },
    },
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
