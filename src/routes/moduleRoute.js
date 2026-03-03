import express from "express";
import {
  createModule,
  getModulesByCourse,
} from "../controllers/moduleController.js";

const router = express.Router();

router.post("/create", createModule);
router.get("/:courseId", getModulesByCourse);

export default router;