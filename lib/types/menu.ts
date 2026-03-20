import type { Prisma } from "@/generated/prisma";

export type MenuItemWithCategory = Prisma.MenuItemGetPayload<{
  include: { category: true };
}>;

/** Client-safe version with price as number instead of Decimal */
export type SerializedMenuItem = Omit<MenuItemWithCategory, "price"> & {
  price: number;
};
