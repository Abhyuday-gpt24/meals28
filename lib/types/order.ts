import type { Prisma } from "@/generated/prisma/client";

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { orderItems: { include: { menuItem: true } } };
}>;

export type OrderWithDriver = Prisma.OrderGetPayload<{
  include: { driver: true; deliveryAddress: true };
}>;
