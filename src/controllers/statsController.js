import User from "../models/user.js";
import Course from "../models/course.js";
import Module from "../models/module.js";
import Unit from "../models/unit.js";
import UserInteraction from "../models/userInteraction.js";

// Endpoint to fetch real stats for dashboard
export const getOverviewStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find modules the user has interacted with
    const interactedUnitIds = await UserInteraction.find({ userId }).distinct('moduleId');
    const activeModules = await Module.find({ _id: { $in: interactedUnitIds } });
    const activeCourseIds = activeModules.map(m => m.courseId.toString());

    // Fetch courses user has created or interacted with
    const userCourses = await Course.find({
      $or: [
        { createdBy: userId },
        { _id: { $in: activeCourseIds } }
      ]
    }).select("-__v");
    const courseStats = [];

    for (const c of userCourses) {
      // Find modules in this course
      const modules = await Module.find({ courseId: c._id });
      const moduleIds = modules.map(m => m._id);

      let totalUnits = c.lessonsCount || 0;
      let completedUnits = 0;

      if (moduleIds.length > 0) {
        // Determine total units
        totalUnits = await Unit.countDocuments({ moduleId: { $in: moduleIds }});
        
        // Count distinct unit IDs that the user has marked completed
        const interactions = await UserInteraction.find({ 
          userId, 
          moduleId: { $in: moduleIds }, 
          completed: true 
        }).distinct('unitId');
        
        completedUnits = interactions.length;
      }

      // Calculate progress percentage
      const progress = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

      courseStats.push({
        _id: c._id,
        title: c.title,
        thumbnail: c.thumbnail,
        instructor: user.name, // Proxy instructor
        level: c.level,
        category: c.category,
        hours: c.duration || 10,
        lessonsCount: totalUnits,
        progress: progress, // Now reflects actual progress
      });
    }

    res.json({
      xp: user.xp || 0,
      badges: user.badges || 0,
      certificates: user.certificates || 0,
      learningHours: user.learningHours || 0,
      streak: user.streak || 0, // Dynamic streak using user model
      courses: courseStats,
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

export const getCourseProgressIds = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    
    // Find modules for this course
    const modules = await Module.find({ courseId });
    const moduleIds = modules.map(m => m._id);
    
    if (moduleIds.length === 0) return res.json([]);
    
    const interactions = await UserInteraction.find({
      userId,
      moduleId: { $in: moduleIds },
      completed: true
    }).select("unitId");
    
    const completedUnitIds = interactions.map(i => i.unitId);
    res.json(completedUnitIds);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
