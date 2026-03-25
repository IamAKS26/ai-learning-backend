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
- "correctAnswer" MUST be the EXACT full text of one of the strings in "options" (not a letter like A or B)

Format:

{
  "questions": [
    {
      "question": "What does HTML stand for?",
      "options": ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Logic", "Home Text Markup Language"],
      "correctAnswer": "Hyper Text Markup Language"
    }
  ]
}
`;

  const result = await callAI(prompt);

  const parsed = safeJsonParse(result);

  return parsed ? parsed.questions : [];
};