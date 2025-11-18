import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, { message: "Current password must be at least 6 characters" }),
    newPassword: z.string().min(8, { message: "New password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password confirmation doesn't match",
    path: ["confirmPassword"],
  });

export type ProfileValues = z.infer<typeof profileSchema>;
export type PasswordValues = z.infer<typeof passwordSchema>;

export interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  avatar?: string | null;
  role: "USER" | "ADMIN";
  createdAt?: string;
}
