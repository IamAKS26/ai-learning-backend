import { callAI } from "./aiClient.js";
import { buildLessonPrompt } from "./promptBuilder.js";

export const generateLesson = async (topic) => {
  const prompt = buildLessonPrompt(topic);
  return await callAI(prompt);
};