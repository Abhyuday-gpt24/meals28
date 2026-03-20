import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be greater than 0"),
  imageUrl: z
    .union([z.string().url("Must be a valid URL"), z.literal("")])
    .optional(),
  isAvailable: z.boolean().default(true),
  isVegetarian: z.boolean().default(true),
  categoryId: z.string().min(1).nullable(),
});

export type MenuItemPayload = z.infer<typeof menuItemSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

export type CategoryPayload = z.infer<typeof categorySchema>;
