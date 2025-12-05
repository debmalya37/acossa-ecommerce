// lib/validations/loginSchema.ts
import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .trim()
    .toLowerCase()
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      "Invalid email format"
    ),

  password: z
    .string()
    .min(1, "Password is required")
    .trim(),
})
.strict();

export type LoginSchema = z.infer<typeof loginSchema>;
