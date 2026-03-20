import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CUSTOMER", "STAFF", "DRIVER", "ADMIN"]),
});

export type LoginPayload = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CUSTOMER", "STAFF", "DRIVER", "ADMIN"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .optional()
    .or(z.literal("")),
});

export type SignupPayload = z.infer<typeof signupSchema>;
