import User from "../models/User.js";
import Course from "../models/course.js";

// Endpoint to fetch real stats for dashboard
export const getOverviewStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Dummy logic to return the user's courses (or what they've created if enrolled aren't stored)
    // Here we'll just fetch courses they created as a proxy for 'myCourses'
    const userCourses = await Course.find({ createdBy: userId }).select("-__v");

    res.json({
      xp: user.xp,
      badges: user.badges,
      certificates: user.certificates,
      learningHours: user.learningHours,
      streak: 5, // Static for now until a streak model is built
      courses: userCourses.map((c) => ({
        _id: c._id,
        title: c.title,
        instructor: user.name, // Proxy instructor
        level: c.level,
        category: c.category,
        hours: c.duration || 10,
        lessonsCount: c.lessonsCount || 0,
        progress: 0, // Set to 0 since we don't have progress tracking yet
      })),
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
