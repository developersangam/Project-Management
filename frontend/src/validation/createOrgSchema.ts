import { z } from "zod";

export const createOrgSchema = z.object({
  name: z.string().min(3, { message: "Organization name must be at least 3 characters" }),
  slug: z.string().optional(),
  description: z.string().optional(),
});