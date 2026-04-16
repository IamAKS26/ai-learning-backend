import express from "express";
import { getOverviewStats, getCourseProgressIds } from "../controllers/statsController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/overview", protect, getOverviewStats);
router.get("/progress/:courseId", protect, getCourseProgressIds);

export default router;
