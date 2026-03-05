import express from "express";
import {
  createUnit,
  getUnitsByModule,
  generateUnitAI
} from "../controllers/unitcontroller.js";

import { generateQuizUnit } from "../controllers/unitcontroller.js";
import { getNextUnit } from "../controllers/unitcontroller.js";

import { trackInteraction } from "../controllers/unitcontroller.js";

const router = express.Router();

router.post("/create", createUnit);
router.get("/:moduleId", getUnitsByModule);

// AI generated unit
router.post("/generate", generateUnitAI);
router.post("/generate-quiz", generateQuizUnit);
router.post("/next-unit", getNextUnit);
router.post("/track-interaction", trackInteraction);

export default router;