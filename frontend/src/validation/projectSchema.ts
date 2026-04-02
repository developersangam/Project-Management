import { z } from "zod";

const ROLES = ["PROJECT_ADMIN", "PROJECT_MANAGER", "PROJECT_MEMBER"] as const;

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Project name must be at least 3 characters" }),
  description: z.string().optional(),
});

export const addMemberSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),

  role: z.enum(ROLES, {
    message: "Role is required",
  }),
});

export const changeRoleSchema = z.object({
  role: z.enum(ROLES, {
    message: "Role is required",
  }),
});
