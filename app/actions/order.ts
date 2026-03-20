"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/getUser";
import { checkoutSchema } from "@/lib/validations/checkout";

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

  const { items, addressId } = parsedData.data;

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

    // 4. Prisma transaction (Nested Write)
    const newOrder = await prisma.order.create({
      data: {
        userId: user.id,
        deliveryAddressId: addressId,
        totalAmount: trueTotalAmount,
        status: "PENDING", // Assuming you have an OrderStatus enum or default string
        orderItems: {
          create: orderItemsData, // Atomically creates the lines on the receipt
        },
      },
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
