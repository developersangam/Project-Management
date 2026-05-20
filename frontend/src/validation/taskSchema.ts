// validation/taskSchema.ts
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.string().min(1, "Status is required"),
  assigneeId: z.string().optional(),
  dueDate: z.date().optional(),
  labels: z.array(z.string()).optional(),
});