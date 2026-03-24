import Course from "../models/course.js";
import Module from "../models/module.js";
import Unit from "../models/unit.js";
import { generateFullCourse } from "../services/courseGeneratorService.js";

// ── Create Course (manual) ─────────────────────────────────────────────────
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
      lessonsCount,
      createdBy: req.user?.id ?? null
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get all PUBLISHED courses (+ own unpublished if authenticated) ──────────
export const getCourses = async (req, res) => {
  try {
    const userId = req.user?.id;

    const filter = userId
      ? { $or: [{ isPublished: true }, { createdBy: userId }] }
      : { isPublished: true };

    const courses = await Course.find(filter).select("-__v");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get single course with modules and units ───────────────────────────────
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const userId = req.user?.id;
    const isOwner = course.createdBy?.toString() === userId;

    if (!course.isPublished && !isOwner) {
      return res.status(403).json({ message: "This course is not published yet" });
    }

    const modules = await Module.find({ courseId: course._id });
    const moduleIds = modules.map(m => m._id);
    const units = await Unit.find({ moduleId: { $in: moduleIds } });

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

// ── AI: Generate full course ───────────────────────────────────────────────
export const generateCourseAI = async (req, res) => {
  try {
    const userId = req.user.id;
    const { topic, level } = req.body;

    const result = await generateFullCourse(userId, topic, level);

    res.status(201).json({
      message: "Course generated successfully",
      course: result.course,
      modules: result.modules.map(({ module, units }) => ({
        module,
        unitCount: units.length
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Course generation failed", error: error.message });
  }
};

// ── Publish a course ──────────────────────────────────────────────────────
export const publishCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Only owner can publish
    if (course.createdBy?.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to publish this course" });
    }

    // Already published?
    if (course.isPublished) {
      return res.status(400).json({ message: "Course is already published" });
    }

    // ── One published course per user limit ────────────────────────────────
    const existingPublished = await Course.findOne({
      createdBy: userId,
      isPublished: true
    });

    if (existingPublished) {
      return res.status(400).json({
        message: "You already have a published course. Unpublish it before publishing another.",
        publishedCourseId: existingPublished._id
      });
    }

    course.isPublished = true;
    await course.save();

    res.json({
      message: "Course published successfully",
      course: {
        _id: course._id,
        title: course.title,
        isPublished: course.isPublished
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Unpublish a course ────────────────────────────────────────────────────
export const unpublishCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.createdBy?.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to unpublish this course" });
    }

    course.isPublished = false;
    await course.save();

    res.json({
      message: "Course unpublished",
      course: { _id: course._id, title: course.title, isPublished: false }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};