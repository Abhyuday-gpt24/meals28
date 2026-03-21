import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const users = await prisma.user.findMany({
    select: { email: true, role: true, phone: true },
  });

  console.log("Users in database:", users.length);
  console.table(users);

  await prisma.$disconnect();
}

main();
