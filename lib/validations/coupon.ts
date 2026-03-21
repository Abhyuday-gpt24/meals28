import { z } from "zod";

export const couponSchema = z
  .object({
    code: z
      .string()
      .min(3, "Code must be at least 3 characters")
      .max(20, "Code must be at most 20 characters")
      .transform((v) => v.toUpperCase().trim()),
    discountType: z.enum(["PERCENTAGE", "FLAT"]),
    discountValue: z.coerce
      .number()
      .positive("Discount value must be positive"),
    minOrderAmount: z.coerce.number().nonnegative().optional().or(z.literal("")),
    maxDiscount: z.coerce.number().nonnegative().optional().or(z.literal("")),
    usageLimit: z.coerce.number().int().positive().optional().or(z.literal("")),
    isActive: z.boolean().default(true),
    expiresAt: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.discountType === "PERCENTAGE" && data.discountValue > 100) {
        return false;
      }
      return true;
    },
    { message: "Percentage discount cannot exceed 100", path: ["discountValue"] },
  );

export type CouponPayload = z.infer<typeof couponSchema>;
