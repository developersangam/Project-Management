import { z } from "zod";

export const registerSchema = z
  .object({
    firstname: z
      .string()
      .min(2, { message: "Firstname must be at least 2 characters" }),

    lastname: z
      .string()
      .min(2, { message: "Lastname must be at least 2 characters" }),

    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),

    email: z
      .string()
      .email({ message: "Please enter a valid email" }),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),

    passwordConfirm: z
      .string()
      .min(6, { message: "Please confirm your password" }),

    dob: z
      .string()
      .min(1, { message: "Please enter your date of birth" }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });
