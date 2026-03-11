export const buildLessonPrompt = (topic) => {
  return `
You are an educational AI.

Explain the topic "${topic}" in a beginner-friendly way.

Rules:
- Keep it concise
- Use examples
- Avoid complex jargon
`;
};

export const buildQuizPrompt = (topic) => {
  return `
Generate 5 multiple choice questions about "${topic}".

Return strictly JSON in this format:

[
  {
    "question": "",
    "options": ["", "", "", ""],
    "correctAnswer": ""
  }
]
`;
};

export const buildTaskPrompt = (topic) => {
  return `
Generate a practical coding task for learning "${topic}".

Return JSON:

{
  "title": "",
  "description": "",
  "difficulty": "easy"
}
`;
};