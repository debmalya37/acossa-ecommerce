import * as z from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name is required")
    .max(50, "Name too long")
    .regex(/^[a-zA-Z\s]+$/, "Only alphabets allowed")
    .trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .min(10, "Phone must be 10 digits")
    .max(15, "Phone number too long")
    .regex(/^[0-9]+$/, "Only numbers allowed")
    .trim(),

  password: z
    .string()
    .min(8, "Min 8 characters required")
    .max(50, "Password too long")
    .regex(/[A-Z]/, "Must contain 1 uppercase letter")
    .regex(/[a-z]/, "Must contain 1 lowercase letter")
    .regex(/[0-9]/, "Must contain 1 number")
    .regex(/[@$!%*?&]/, "Must contain 1 special character")
    .trim(),

  role: z.enum(["user", "admin"] as const, {
    message: "Select a valid role",
  }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
