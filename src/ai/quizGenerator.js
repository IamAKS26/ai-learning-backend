import { callAI } from "./aiClient.js";

export const generateQuiz = async (topic) => {

  const prompt = `
  Generate 3 multiple choice questions about ${topic}.

  Return ONLY valid JSON in this format:

  [
    {
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "correct option"
    }
  ]
  `;

  const result = await callAI(prompt);

  return JSON.parse(result);
};