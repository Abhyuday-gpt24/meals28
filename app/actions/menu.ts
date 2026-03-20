"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/getUser";
import { menuItemSchema, categorySchema } from "@/lib/validations/menu";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

// ─── Menu Item Actions ───────────────────────────────────────────

export async function createMenuItem(payload: unknown) {
  await requireAdmin();
  const parsed = menuItemSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }

  const { price, imageUrl, ...rest } = parsed.data;

  await prisma.menuItem.create({
    data: {
      ...rest,
      price,
      imageUrl: imageUrl || null,
    },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/");
  return { success: true };
}

export async function updateMenuItem(id: string, payload: unknown) {
  await requireAdmin();
  const parsed = menuItemSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }

  const { price, imageUrl, ...rest } = parsed.data;

  await prisma.menuItem.update({
    where: { id },
    data: {
      ...rest,
      price,
      imageUrl: imageUrl || null,
    },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/");
  return { success: true };
}

export async function deleteMenuItem(id: string) {
  await requireAdmin();

  await prisma.menuItem.delete({ where: { id } });

  revalidatePath("/admin/menu");
  revalidatePath("/");
  return { success: true };
}

export async function toggleAvailability(id: string) {
  await requireAdmin();

  const item = await prisma.menuItem.findUnique({
    where: { id },
    select: { isAvailable: true },
  });

  if (!item) return { success: false, error: "Item not found" };

  await prisma.menuItem.update({
    where: { id },
    data: { isAvailable: !item.isAvailable },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/");
  return { success: true };
}

// ─── Category Actions ────────────────────────────────────────────

export async function createCategory(payload: unknown) {
  await requireAdmin();
  const parsed = categorySchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }

  await prisma.category.create({ data: parsed.data });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function updateCategory(id: string, payload: unknown) {
  await requireAdmin();
  const parsed = categorySchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }

  await prisma.category.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const itemCount = await prisma.menuItem.count({ where: { categoryId: id } });
  if (itemCount > 0) {
    return {
      success: false,
      error: `Cannot delete: ${itemCount} menu item(s) still belong to this category.`,
    };
  }

  await prisma.category.delete({ where: { id } });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}
