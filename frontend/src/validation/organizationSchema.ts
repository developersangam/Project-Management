import { z } from "zod";
export const ROLE_OPTIONS = ["Admin", "Member", "Viewer"] as const;


export const organizationSchema = z.object({
  name: z
    .string()
    .min(2, "Organization name must be at least 2 characters"),

  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers, and hyphens allowed"
    ),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export const createOrgSchema = z.object({
  name: z.string().min(3, { message: "Organization name must be at least 3 characters" }),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export const addMemberSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  role: z
    .string()
    .min(1, "Role is required"),
});

export const changeRoleSchema = z.object({
   role: z
    .string()
    .min(1, "Role is required"),
});

