import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .nonempty("name is required")
      .min(2, "Name must be at least 2 characters")
      .max(20, "Name must be less than 20 characters"),
    email: z
      .email("Please enter a valid email address")
      .nonempty("Email is required"),
    password: z
      .string()
      .nonempty("passowrd is required")
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be less than 20 characters"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
    otp: z
      .string()
      .nonempty("Enter your verficaton code")
      .length(6, "verficaton code must be 6 digits"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .nonempty("passowrd is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be less than 20 characters"),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
