import { z } from "zod";

export const nextUnitSchema = z.object({
  moduleId: z.string().min(1, "moduleId is required"),
  topic: z.string().min(1, "topic is required")
});

export const interactionSchema = z.object({
  unitId: z.string(),
  moduleId: z.string(),
  type: z.enum(["read", "quiz", "video", "task"]),
  timeSpent: z.number().optional(),
  quizScore: z.number().optional(),
  completed: z.boolean()
});