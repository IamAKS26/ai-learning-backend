import { z } from "zod";

export const nextUnitSchema = z.object({
  userId: z.string(),
  moduleId: z.string(),
  topic: z.string()
});