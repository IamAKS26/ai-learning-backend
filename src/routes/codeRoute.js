import express from "express";
import { reviewCode } from "../controllers/codeReviewController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// POST /api/code/review — AI code review (protected)
router.post("/review", protect, reviewCode);

export default router;
