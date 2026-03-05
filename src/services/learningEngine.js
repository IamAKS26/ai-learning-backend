import Unit from "../models/unit.js";
import { generateLesson } from "../ai/contentGenerator.js";
import { generateQuiz } from "../ai/quizGenerator.js";
import UserPreference from "../models/userPreference.js";

export const decideNextUnitType = async (moduleId) => {

  const units = await Unit.find({ moduleId });

  const lessonCount = units.filter(u => u.type === "read").length;
  const quizCount = units.filter(u => u.type === "quiz").length;

  // Rule: 2 lessons then 1 quiz
  if (lessonCount < 2) {
    return "read";
  }

  if (quizCount < 1) {
    return "quiz";
  }

  return "complete";
};

export const generateNextUnit = async (moduleId, topic) => {

  const type = await decideNextUnitType(moduleId);

  if (type === "complete") {
    return {
      message: "Module completed"
    };
  }

  let content;

  if (type === "read") {
    content = await generateLesson(topic);
  }

  if (type === "quiz") {
    content = await generateQuiz(topic);
  }

  const unit = await Unit.create({
    moduleId,
    type,
    content
  });

  return unit;
};
