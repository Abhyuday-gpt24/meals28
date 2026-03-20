"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/getUser";
import { revalidatePath } from "next/cache";

export async function claimOrder(orderId: string) {
  const user = await requireUser();
  if (user.role !== "DRIVER" && user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  // Atomic claim: only succeeds if order is still READY and unclaimed
  const updated = await prisma.order.updateMany({
    where: {
      id: orderId,
      status: "READY",
      driverId: null,
    },
    data: {
      driverId: user.id,
      status: "OUT_FOR_DELIVERY",
    },
  });

  if (updated.count === 0) {
    return { success: false, error: "Order already claimed or not ready" };
  }

  revalidatePath("/driver");
  return { success: true };
}

export async function markDelivered(orderId: string) {
  const user = await requireUser();
  if (user.role !== "DRIVER" && user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const updated = await prisma.order.updateMany({
    where: {
      id: orderId,
      driverId: user.id,
      status: "OUT_FOR_DELIVERY",
    },
    data: {
      status: "DELIVERED",
    },
  });

  if (updated.count === 0) {
    return { success: false, error: "Order not found or not assigned to you" };
  }

  revalidatePath("/driver");
  return { success: true };
}
