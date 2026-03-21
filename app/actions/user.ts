"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/getUser";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addressSchema = z.object({
  name: z.string().min(2, "Recipient name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid ZIP/PIN code is required"),
});

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

// ─── Profile Actions ─────────────────────────────────────────────

export async function updateProfile(payload: unknown) {
  const parsed = profileSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireUser();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName || null,
        phone: parsed.data.phone || null,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating your profile.",
    };
  }
}

// ─── Address Actions ─────────────────────────────────────────────

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
        name: parsed.data.name,
        phone: parsed.data.phone,
        street: parsed.data.street,
        city: parsed.data.city,
        state: parsed.data.state,
        zipCode: parsed.data.zipCode,
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

export async function updateAddress(id: string, payload: unknown) {
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

    // Verify ownership
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== user.id) {
      return { success: false, error: "Address not found" };
    }

    await prisma.address.update({
      where: { id },
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        street: parsed.data.street,
        city: parsed.data.city,
        state: parsed.data.state,
        zipCode: parsed.data.zipCode,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update address:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating your address.",
    };
  }
}

export async function deleteAddress(id: string) {
  try {
    const user = await requireUser();

    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== user.id) {
      return { success: false, error: "Address not found" };
    }

    // Check if any orders reference this address
    const orderCount = await prisma.order.count({
      where: { deliveryAddressId: id },
    });
    if (orderCount > 0) {
      return {
        success: false,
        error: "Cannot delete: this address is linked to existing orders.",
      };
    }

    await prisma.address.delete({ where: { id } });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete address:", error);
    return {
      success: false,
      error: "An unexpected error occurred while deleting your address.",
    };
  }
}
