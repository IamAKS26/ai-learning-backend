import express from "express";
import {
  createModule,
  getModulesByCourse,
  getModuleById,
} from "../controllers/moduleController.js";

const router = express.Router();

router.post("/create", createModule);
router.get("/single/:moduleId", getModuleById);
router.get("/:courseId", getModulesByCourse);

export default router;