import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// 1. Define the function that creates the Client with the Postgres Adapter
const prismaClientSingleton = () => {
  const connectionString = `${process.env.DATABASE_URL}`;
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
};

// 2. Extend the global context
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// 3. Instantiate the client safely
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// 4. Preserve the connection during Next.js development reloads
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
