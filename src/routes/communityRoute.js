import express from "express";
import {
  getCommunityFeed,
  getStudentProfile,
  trackCourseView,
  rateCourse,
  enrollCourse,
  getTrending,
} from "../controllers/communityController.js";
import { protect, optionalProtect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/feed",              optionalProtect, getCommunityFeed);
router.get("/profile/:userId",   optionalProtect, getStudentProfile);
router.get("/trending",          optionalProtect, getTrending);
router.post("/view/:courseId",   optionalProtect, trackCourseView);

// Auth-required routes
router.post("/rate/:courseId",   protect, rateCourse);
router.post("/enroll/:courseId", protect, enrollCourse);

export default router;
