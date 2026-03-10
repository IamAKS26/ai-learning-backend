import { callAI } from "./aiClient.js";

export const generateTask = async (topic) => {

  const prompt = `
You are a programming instructor.

Create 2 small practice tasks about "${topic}".

Rules:
- Tasks should be short
- Beginner friendly
- Action based

Return ONLY valid JSON:

{
  "tasks": [
    {
      "title": "task title",
      "description": "task instruction"
    }
  ]
}
`;

  const result = await callAI(prompt);

  const parsed = JSON.parse(result);

  return parsed.tasks;
};