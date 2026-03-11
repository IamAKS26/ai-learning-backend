import { callAI } from "./aiClient.js";
import { safeJsonParse } from "../utils/safeJsonParse.js";

export const generateQuiz = async (topic) => {

  const prompt = `
You are an educational quiz generator.

Create 3 MCQ questions about "${topic}".

Rules:
- Return ONLY valid JSON
- No explanation text
- No markdown

Format:

{
  "questions": [
    {
      "question": "text",
      "options": ["A","B","C","D"],
      "correctAnswer": "A"
    }
  ]
}
`;

  const result = await callAI(prompt);

  const parsed = safeJsonParse(result);

  return parsed.questions;
};