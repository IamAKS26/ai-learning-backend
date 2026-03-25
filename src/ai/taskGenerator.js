import { callAI } from "./aiClient.js";
import { safeJsonParse } from "../utils/safeJsonParse.js";
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
      "description": "task instruction",
      "language": "python",
      "starterCode": "def solution():\\n    pass",
      "testCases": [{"input": "5", "expectedOutput": "120"}]
    }
  ]
}
`;

  const result = await callAI(prompt);

  const parsed = safeJsonParse(result);

  return parsed ? parsed.tasks : [];
};