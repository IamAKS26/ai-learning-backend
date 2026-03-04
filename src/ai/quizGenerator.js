export const generateQuiz = async (topic) => {

  const prompt = `
  Generate 3 MCQ questions about ${topic}.
  Return JSON format.
  `;

  return await callAI(prompt);
};