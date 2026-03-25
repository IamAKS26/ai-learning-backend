export const buildLessonPrompt = (topic) => {
  return `
You are an expert educational AI tutor.

Explain the topic "${topic}" in a beginner-friendly, engaging way.

CRITICAL RULES:
- MUST use rich Markdown formatting (like a modern chatbot app).
- Use # H1, ## H2, ### H3 for structure.
- Use **bold** and *italics* for emphasis.
- Use bullet points (- item) and numbered lists (1. item) for readabilty.
- Provide \`inline code\` and \`\`\`language code blocks\`\`\` for any technical concepts or examples.
- Include a real-world analogy.
- Keep the overall length concise but highly structured and visually appealing.
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