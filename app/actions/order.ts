"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/getUser";
import { checkoutSchema } from "@/lib/validations/checkout";
import { getAppSettings } from "@/app/actions/settings";

export async function placeOrder(formData: unknown) {
  // 1. Zod safely parses the incoming data
  const parsedData = checkoutSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      error: "Validation failed",
      details: parsedData.error.flatten().fieldErrors,
    };
  }

  const { items, addressId, couponCode } = parsedData.data;

  try {
    // 2. Get secure user session
    const user = await requireUser();

    // 3. Fetch real prices from DB using the items array
    const itemIds = items.map((item) => item.menuItemId);
    const dbMenuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: itemIds },
        isAvailable: true, // Security check: Prevent ordering sold-out items
      },
      select: {
        id: true,
        price: true,
      },
    });

    // Security check: Ensure no items were manipulated or went out of stock during checkout
    if (dbMenuItems.length !== items.length) {
      return {
        success: false,
        error:
          "Some items in your cart are no longer available. Please review your cart.",
      };
    }

    // Calculate the true server-side total and prepare the nested order items
    let trueTotalAmount = 0;

    const orderItemsData = items.map((clientItem) => {
      // The non-null assertion (!) is safe here because of the length check above
      const dbItem = dbMenuItems.find((db) => db.id === clientItem.menuItemId)!;

      trueTotalAmount += dbItem.price.toNumber() * clientItem.quantity;

      return {
        menuItemId: dbItem.id,
        quantity: clientItem.quantity,
        unitPrice: dbItem.price.toNumber(), // Snapshotting the exact price at the moment of checkout
      };
    });

    // 4. Apply coupon if provided
    let discountAmount = 0;
    let couponId: string | null = null;

    if (couponCode && couponCode.trim().length > 0) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });

      if (
        !coupon ||
        !coupon.isActive ||
        (coupon.expiresAt && coupon.expiresAt < new Date()) ||
        (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
      ) {
        return { success: false, error: "Coupon is no longer valid" };
      }

      if (coupon.minOrderAmount && trueTotalAmount < coupon.minOrderAmount.toNumber()) {
        return {
          success: false,
          error: `Minimum order of ₹${coupon.minOrderAmount.toNumber()} required for this coupon`,
        };
      }

      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = (trueTotalAmount * coupon.discountValue.toNumber()) / 100;
        if (coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount.toNumber());
        }
      } else {
        discountAmount = coupon.discountValue.toNumber();
      }

      discountAmount = Math.min(discountAmount, trueTotalAmount);
      discountAmount = Math.round(discountAmount * 100) / 100;
      couponId = coupon.id;
    }

    // Fetch delivery fee from settings
    const { deliveryFee } = await getAppSettings();
    const finalTotal = trueTotalAmount - discountAmount + deliveryFee;

    // 5. Prisma transaction (Nested Write + coupon usage increment)
    const newOrder = await prisma.$transaction(async (tx) => {
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return tx.order.create({
        data: {
          userId: user.id,
          deliveryAddressId: addressId,
          totalAmount: finalTotal,
          deliveryFee,
          discountAmount,
          couponId,
          status: "PENDING",
          orderItems: {
            create: orderItemsData,
          },
        },
      });
    });

    // Return success to the client so it can clear the cart and redirect
    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error("Order creation failed:", error);
    return {
      success: false,
      error: "An unexpected error occurred while processing your order.",
    };
  }
}
