import { callAI } from "./aiClient.js";
import { safeJsonParse } from "../utils/safeJsonParse.js";

/**
 * Ask the AI to produce a full course outline with modules and topics.
 * @param {string} topic  - e.g. "JavaScript for Beginners"
 * @param {string} level  - "Beginner" | "Intermediate" | "Advanced"
 * @returns {Promise<{title, description, category, duration, modules: [{title, topics[]}]}>}
 */
export const generateCourseOutline = async (topic, level = "Beginner") => {
  const prompt = `
You are an expert curriculum designer.

Create a complete course outline for: "${topic}" at ${level} level.

Rules:
- Return ONLY valid JSON, no markdown, no explanation
- Include 3-5 modules
- Each module must have 2-3 topic strings

Format:
{
  "title": "Course title",
  "description": "2-3 sentence course description",
  "category": "e.g. Programming, Data Science, Design",
  "duration": "e.g. 4 hours",
  "level": "${level}",
  "modules": [
    {
      "title": "Module title",
      "topics": ["topic 1", "topic 2"]
    }
  ]
}
`;

  const result = await callAI(prompt);
  return safeJsonParse(result);
};
