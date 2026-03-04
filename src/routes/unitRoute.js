import express from "express";
import {
  createUnit,
  getUnitsByModule,
  generateUnitAI
} from "../controllers/unitcontroller.js";

const router = express.Router();

router.post("/create", createUnit);
router.get("/:moduleId", getUnitsByModule);

// AI generated unit
router.post("/generate", generateUnitAI);

export default router;