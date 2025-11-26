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
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password too long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&()_+\-=]{6,}$/,
      "Password must include letters & numbers"
    )
    .trim(),
})
.strict();

export type LoginSchema = z.infer<typeof loginSchema>;
