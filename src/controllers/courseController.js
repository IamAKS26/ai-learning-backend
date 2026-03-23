import Course from "../models/course.js";
import Module from "../models/module.js";
import Unit from "../models/unit.js";

export const createCourse = async (req, res) => {
  try {
    const { title, description, image, duration, level, category, lessonsCount } = req.body;

    const course = await Course.create({
      title,
      description,
      image,
      duration,
      level,
      category,
      lessonsCount
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single course with modules and units
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const modules = await Module.find({ courseId: course._id });
    const moduleIds = modules.map(m => m._id);
    const units = await Unit.find({ moduleId: { $in: moduleIds } });

    // Format units as a flat lessons array for the frontend
    const lessons = units.map((u, i) => ({
      id: u._id.toString(),
      title: u.title || `Lesson ${i + 1}`,
      duration: u.duration || "10:00",
      type: u.type,
      content: u.content,
      quizId: u.type === "quiz" ? u._id.toString() : undefined
    }));

    const formattedCourse = {
      ...course.toObject(),
      id: course._id.toString(),
      instructor: "AI Instructor",
      lessons
    };

    res.json(formattedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};