"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/getUser";
import { revalidatePath } from "next/cache";

const SETTINGS_ID = "app-settings";

async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

export async function getAppSettings() {
  const settings = await prisma.appSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID, deliveryFee: 40 },
  });

  return {
    deliveryFee: settings.deliveryFee.toNumber(),
  };
}

export async function updateDeliveryFee(fee: number) {
  await requireAdmin();

  if (typeof fee !== "number" || fee < 0) {
    return { success: false, error: "Delivery fee must be a non-negative number" };
  }

  await prisma.appSettings.upsert({
    where: { id: SETTINGS_ID },
    update: { deliveryFee: fee },
    create: { id: SETTINGS_ID, deliveryFee: fee },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
  return { success: true };
}
