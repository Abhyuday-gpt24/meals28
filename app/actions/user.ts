"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/getUser";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addressSchema = z.object({
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid ZIP/PIN code is required"),
});

export async function addAddress(payload: unknown) {
  const parsed = addressSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireUser();

    await prisma.address.create({
      data: {
        userId: user.id,
        street: parsed.data.street,
        city: parsed.data.city,
        state: parsed.data.state,
        zipCode: parsed.data.zipCode,
        // isDefault will automatically be set to false by your database default!
      },
    });

    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Failed to save address:", error);
    return {
      success: false,
      error: "An unexpected error occurred while saving your address.",
    };
  }
}
