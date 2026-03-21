"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/getUser";
import { couponSchema } from "@/lib/validations/coupon";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

// ─── Admin CRUD ──────────────────────────────────────────────────

export async function createCoupon(payload: unknown) {
  await requireAdmin();
  const parsed = couponSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }

  const { minOrderAmount, maxDiscount, usageLimit, expiresAt, ...rest } = parsed.data;

  await prisma.coupon.create({
    data: {
      ...rest,
      minOrderAmount: minOrderAmount || null,
      maxDiscount: maxDiscount || null,
      usageLimit: usageLimit || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function updateCoupon(id: string, payload: unknown) {
  await requireAdmin();
  const parsed = couponSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }

  const { minOrderAmount, maxDiscount, usageLimit, expiresAt, ...rest } = parsed.data;

  await prisma.coupon.update({
    where: { id },
    data: {
      ...rest,
      minOrderAmount: minOrderAmount || null,
      maxDiscount: maxDiscount || null,
      usageLimit: usageLimit || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function deleteCoupon(id: string) {
  await requireAdmin();

  const orderCount = await prisma.order.count({ where: { couponId: id } });
  if (orderCount > 0) {
    return {
      success: false,
      error: `Cannot delete: ${orderCount} order(s) used this coupon. Deactivate it instead.`,
    };
  }

  await prisma.coupon.delete({ where: { id } });

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function toggleCouponActive(id: string) {
  await requireAdmin();

  const coupon = await prisma.coupon.findUnique({
    where: { id },
    select: { isActive: true },
  });

  if (!coupon) return { success: false, error: "Coupon not found" };

  await prisma.coupon.update({
    where: { id },
    data: { isActive: !coupon.isActive },
  });

  revalidatePath("/admin/coupons");
  return { success: true };
}

// ─── Customer-facing: validate & preview discount ────────────────

export async function applyCoupon(code: string, subtotal: number) {
  if (!code || code.trim().length === 0) {
    return { success: false, error: "Please enter a coupon code" };
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase().trim() },
  });

  if (!coupon || !coupon.isActive) {
    return { success: false, error: "Invalid or inactive coupon code" };
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { success: false, error: "This coupon has expired" };
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { success: false, error: "This coupon has reached its usage limit" };
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount.toNumber()) {
    return {
      success: false,
      error: `Minimum order of ₹${coupon.minOrderAmount.toNumber()} required`,
    };
  }

  let discount: number;
  if (coupon.discountType === "PERCENTAGE") {
    discount = (subtotal * coupon.discountValue.toNumber()) / 100;
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount.toNumber());
    }
  } else {
    discount = coupon.discountValue.toNumber();
  }

  // Discount cannot exceed subtotal
  discount = Math.min(discount, subtotal);
  discount = Math.round(discount * 100) / 100;

  return {
    success: true,
    discount,
    couponId: coupon.id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue.toNumber(),
  };
}
