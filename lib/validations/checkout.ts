import { z } from "zod";

// 1. Validate individual cart items
const orderItemSchema = z.object({
  menuItemId: z.string().min(1, "Menu item ID is required"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be at least 1"),
});

// 2. Validate the entire checkout payload
export const checkoutSchema = z.object({
  // The address the user selected from their saved addresses
  addressId: z.string().min(1, "Please select a delivery address"),

  // We don't ask for userId here because it should be extracted securely
  // from the auth session on the server, not passed by the client.

  // The cart contents
  items: z.array(orderItemSchema).min(1, "Your cart cannot be empty"),

  // Optional coupon code
  couponCode: z.string().optional().or(z.literal("")),
});

// 3. Export the TypeScript type inferred directly from Zod
export type CheckoutPayload = z.infer<typeof checkoutSchema>;
