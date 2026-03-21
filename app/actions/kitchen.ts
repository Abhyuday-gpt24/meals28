"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/getUser";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/generated/prisma/client";

const validTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PENDING: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY"],
};

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
) {
  const user = await requireUser();
  if (user.role !== "STAFF" && user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  });

  if (!order) return { success: false, error: "Order not found" };

  const allowed = validTransitions[order.status];
  if (!allowed?.includes(newStatus)) {
    return {
      success: false,
      error: `Cannot move from ${order.status} to ${newStatus}`,
    };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  revalidatePath("/kitchen");
  return { success: true };
}
