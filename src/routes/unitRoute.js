import express from "express";
import {
  createUnit,
  getUnitsByModule,
} from "../controllers/unitcontroller.js";

const router = express.Router();

router.post("/create", createUnit);
router.get("/:moduleId", getUnitsByModule);

export default router;