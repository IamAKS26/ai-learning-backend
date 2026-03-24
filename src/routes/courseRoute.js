import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  generateCourseAI,
  publishCourse,
  unpublishCourse
} from "../controllers/courseController.js";
import { protect, optionalProtect } from "../Middleware/authMiddleware.js";
import { validate } from "../Middleware/validate.js";
import { generateCourseSchema } from "../validators/courseValidator.js";

const router = express.Router();

// ── AI generation ──────────────────────────────────────────────────────────
// NOTE: /generate must come BEFORE /:id so Express doesn't treat "generate" as an id
router.post("/generate", protect, validate(generateCourseSchema), generateCourseAI);

// ── Publish / Unpublish ───────────────────────────────────────────────────
router.put("/:id/publish",   protect, publishCourse);
router.put("/:id/unpublish", protect, unpublishCourse);

// ── CRUD ──────────────────────────────────────────────────────────────────
router.post("/create", protect, createCourse);
router.get("/",    optionalProtect, getCourses);         // shows published + own unpublished if authed
router.get("/:id", optionalProtect, getCourseById);      // owner can view own unpublished

export default router;