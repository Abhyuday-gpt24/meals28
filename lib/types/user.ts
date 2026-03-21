import type { Prisma } from "@/generated/prisma/client";

export type UserWithAddresses = Prisma.UserGetPayload<{
  include: { addresses: true };
}>;
