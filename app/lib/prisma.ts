// // lib/prisma.ts
// import { PrismaClient } from "../generated/prisma/client";

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// export const prisma = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

 const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

 export default prisma;
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

//This is prisma Instance that we will use to query the database. We will export it and use it in our API routes.