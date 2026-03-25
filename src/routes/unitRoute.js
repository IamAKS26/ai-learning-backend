import express from "express";
import {
  createUnit,
  getUnitsByModule,
  generateUnitAI,
  generateQuizUnit,
  getNextUnit,
  trackInteraction,
  getUnitById
} from "../controllers/unitController.js";
import { protect } from "../Middleware/authMiddleware.js";
import { validate } from "../Middleware/validate.js";
import { nextUnitSchema, interactionSchema } from "../validators/unitValidator.js";

const router = express.Router();

// Public — admin/seed only (consider adding admin auth in future)
router.post("/create", createUnit);
router.get("/single/:id", getUnitById);
router.get("/:moduleId", getUnitsByModule);

// AI generated — protected (costs API calls)
router.post("/generate",      protect, generateUnitAI);
router.post("/generate-quiz", protect, generateQuizUnit);

// Adaptive learning — protected + validated
router.post("/next-unit",          protect, validate(nextUnitSchema),    getNextUnit);
router.post("/track-interaction",  protect, validate(interactionSchema), trackInteraction);

export default router;