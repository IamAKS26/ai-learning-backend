import express from "express";
import {
  createUnit,
  getUnitsByModule,
  generateUnitAI
} from "../controllers/unitcontroller.js";
import { protect } from "../Middleware/authMiddleware.js";
import { generateQuizUnit } from "../controllers/unitcontroller.js";
import { getNextUnit } from "../controllers/unitcontroller.js";

import { trackInteraction } from "../controllers/unitcontroller.js";
import { validate } from "../Middleware/validate.js";
import { nextUnitSchema, interactionSchema } from "../validators/unitValidator.js";

const router = express.Router();

router.post("/create", createUnit);
router.get("/:moduleId", getUnitsByModule);

// AI generated unit
router.post("/generate", generateUnitAI);
router.post("/generate-quiz", generateQuizUnit);
router.post(
  "/next-unit",
  protect,
  validate(nextUnitSchema),
  getNextUnit
);
router.post(
  "/track-interaction",
  protect,
  validate(interactionSchema),
  trackInteraction
);

export default router;