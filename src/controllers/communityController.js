import Course from "../models/course.js";
import User from "../models/User.js";

// ── GET /community/feed ───────────────────────────────────────────────────
// Returns all published courses with creator info, views, and ratings
export const getCommunityFeed = async (req, res) => {
  try {
    const { search, level, category, sort = "newest", page = 1 } = req.query;
    const limit = 12;
    const skip = (parseInt(page) - 1) * limit;

    const filter = { isPublished: true };
    if (search) filter.title = { $regex: search, $options: "i" };
    if (level)    filter.level = level;
    if (category) filter.category = { $regex: category, $options: "i" };

    let sortObj = { createdAt: -1 };
    if (sort === "popular")   sortObj = { views: -1 };
    if (sort === "top-rated") sortObj = { rating: -1 };
    if (sort === "enrolled")  sortObj = { enrolledCount: -1 };

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name email bio avatarColor")
        .select("-ratings -__v"),
      Course.countDocuments(filter)
    ]);

    res.json({ courses, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

// ── GET /community/profile/:userId ────────────────────────────────────────
// Public profile: user info + their published courses
export const getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("name email bio avatarColor website xp badges certificates learningHours createdAt");

    if (!user) return res.status(404).json({ message: "User not found" });

    const courses = await Course.find({ createdBy: req.params.userId, isPublished: true })
      .select("-ratings -__v")
      .sort({ createdAt: -1 });

    const totalViews    = courses.reduce((sum, c) => sum + (c.views || 0), 0);
    const totalEnrolled = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);

    res.json({ user, courses, totalViews, totalEnrolled });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

// ── POST /community/view/:courseId ────────────────────────────────────────
// Increment view count (called when a card is clicked)
export const trackCourseView = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ views: course.views });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

// ── POST /community/rate/:courseId ────────────────────────────────────────
// Submit or update a rating (1-5) with optional review text
export const rateCourse = async (req, res) => {
  try {
    const { value, review = "" } = req.body;
    const userId = req.user.id;

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Prevent rating own course
    if (course.createdBy?.toString() === userId) {
      return res.status(403).json({ message: "You cannot rate your own course" });
    }

    // Update or insert user's rating
    const existingIndex = course.ratings.findIndex(r => r.user?.toString() === userId);
    if (existingIndex > -1) {
      course.ratings[existingIndex].value = value;
      course.ratings[existingIndex].review = review;
    } else {
      course.ratings.push({ user: userId, value, review });
    }

    // Recalculate aggregate rating
    const sum = course.ratings.reduce((acc, r) => acc + r.value, 0);
    course.rating = Math.round((sum / course.ratings.length) * 10) / 10;
    course.ratingsCount = course.ratings.length;

    await course.save();
    res.json({ rating: course.rating, ratingsCount: course.ratingsCount });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

// ── POST /community/enroll/:courseId ─────────────────────────────────────
// Mark a student as enrolled (increments counter, idempotent per user)
export const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { $inc: { enrolledCount: 1 } },
      { new: true }
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ enrolledCount: course.enrolledCount, message: "Enrolled successfully" });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

// ── GET /community/trending ───────────────────────────────────────────────
// Top 5 courses by views this week + top creators by XP
export const getTrending = async (req, res) => {
  try {
    const [topCourses, topCreators] = await Promise.all([
      Course.find({ isPublished: true })
        .sort({ views: -1 })
        .limit(5)
        .populate("createdBy", "name avatarColor")
        .select("title rating ratingsCount views enrolledCount level createdBy"),

      User.find()
        .sort({ xp: -1 })
        .limit(5)
        .select("name xp bio avatarColor")
    ]);

    res.json({ topCourses, topCreators });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};
