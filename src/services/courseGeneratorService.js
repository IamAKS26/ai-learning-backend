import Course from "../models/course.js";
import Module from "../models/module.js";
import Unit from "../models/unit.js";
import { generateCourseOutline } from "../ai/courseOutlineGenerator.js";
import { generateLesson } from "../ai/contentGenerator.js";
import { generateQuiz } from "../ai/quizGenerator.js";
import { logger } from "../utils/logger.js";

/**
 * Generates a complete course from a single topic:
 * 1. AI → course outline (title, description, modules with topics)
 * 2. Save Course document
 * 3. For each module → save Module → generate lesson + quiz Unit for each topic
 *
 * @param {string} userId
 * @param {string} topic
 * @param {string} level
 * @returns {Promise<{course, modules: [{module, units[]}]}>}
 */
export const generateFullCourse = async (userId, topic, level) => {
  logger.info(`Generating full course for topic: "${topic}" (${level})`);

  // ── Step 1: AI outline ────────────────────────────────────────────────────
  const outline = await generateCourseOutline(topic, level);

  if (!outline || !Array.isArray(outline.modules) || outline.modules.length === 0) {
    throw new Error("AI returned an invalid course outline");
  }

  // ── Step 2: Save Course ───────────────────────────────────────────────────
  const course = await Course.create({
    title: outline.title,
    description: outline.description,
    category: outline.category,
    duration: outline.duration,
    level: outline.level || level,
    lessonsCount: 0,           // will update after units are created
    createdBy: userId,
    isAIGenerated: true,
    isPublished: false
  });

  logger.info(`Course created: ${course._id}`);

  // ── Step 3: Modules + Units ───────────────────────────────────────────────
  const modulesResult = [];
  let totalUnits = 0;

  for (const mod of outline.modules) {
    const module = await Module.create({
      courseId: course._id,
      title: mod.title
    });

    const units = [];

    for (const topicItem of mod.topics) {
      // Lesson unit
      const lessonContent = await generateLesson(topicItem);
      const lessonUnit = await Unit.create({
        moduleId: module._id,
        type: "read",
        title: `Lesson: ${topicItem}`,
        content: lessonContent
      });
      units.push(lessonUnit);

      // Quiz unit
      const quizContent = await generateQuiz(topicItem);
      const quizUnit = await Unit.create({
        moduleId: module._id,
        type: "quiz",
        title: `Quiz: ${topicItem}`,
        content: quizContent
      });
      units.push(quizUnit);
    }

    totalUnits += units.length;
    modulesResult.push({ module, units });
  }

  // Update lessonsCount on the course
  await Course.findByIdAndUpdate(course._id, { lessonsCount: totalUnits });

  logger.info(`Full course generation complete. Modules: ${modulesResult.length}, Units: ${totalUnits}`);

  return {
    course: { ...course.toObject(), lessonsCount: totalUnits },
    modules: modulesResult
  };
};
