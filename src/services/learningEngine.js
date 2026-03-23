import Unit from "../models/unit.js";
import { logger } from "../utils/logger.js";
import { generateLesson } from "../ai/contentGenerator.js";
import { generateQuiz } from "../ai/quizGenerator.js";
import UserPreference from "../models/userPreference.js";
import { generateVideo } from "../ai/videoGenerator.js";
import { generateTask } from "../ai/taskGenerator.js";

/*
  Decides what type of unit should be generated next
  based on user preference + module progress
*/
export const decideNextUnitType = async (userId, moduleId) => {
  logger.info(`Deciding next unit type for module ${moduleId}`);

  const units = await Unit.find({ moduleId });

  const lessonCount = units.filter(u => u.type === "read").length;
  const quizCount   = units.filter(u => u.type === "quiz").length;

  const pref = await UserPreference.findOne({ userId });

  // No preference yet → sensible default sequence
  if (!pref) {
    if (lessonCount < 2) return "read";
    if (quizCount < 1)   return "quiz";
    return "complete";
  }

  const weights = [
    { type: "read",  value: pref.readWeight  },
    { type: "quiz",  value: pref.quizWeight  },
    { type: "video", value: pref.videoWeight },
    { type: "task",  value: pref.taskWeight  }
  ];

  weights.sort((a, b) => b.value - a.value);
  const selectedType = weights[0].type;

  logger.info(`Preference selected unit type: ${selectedType}`);
  return selectedType;
};

/*
  Generate the next unit dynamically
*/
export const generateNextUnit = async (userId, moduleId, topic) => {
  const type = await decideNextUnitType(userId, moduleId);

  logger.info(`Generating ${type} unit for topic: ${topic}`);

  if (type === "complete") {
    logger.info(`Module ${moduleId} completed`);
    return { message: "Module completed" };
  }

  let content;
  let title = topic; // sensible default title

  if (type === "read") {
    content = await generateLesson(topic);
    title = `Lesson: ${topic}`;
  } else if (type === "quiz") {
    content = await generateQuiz(topic);
    title = `Quiz: ${topic}`;
  } else if (type === "video") {
    content = await generateVideo(topic);
    title = content.title || `Video: ${topic}`;
  } else if (type === "task") {
    content = await generateTask(topic);
    title = content.title || `Task: ${topic}`;
  }

  const unit = await Unit.create({
    moduleId,
    type,
    title,
    content
  });

  logger.info(`Unit created with type: ${type}`);
  return unit;
};