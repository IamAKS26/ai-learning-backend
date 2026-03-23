import { z } from "zod";

export const generateCourseSchema = z.object({
  topic: z.string().min(3, "topic must be at least 3 characters"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional().default("Beginner")
});
