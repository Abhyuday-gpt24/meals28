import type { Prisma } from "@/generated/prisma";

export type UserWithAddresses = Prisma.UserGetPayload<{
  include: { addresses: true };
}>;
