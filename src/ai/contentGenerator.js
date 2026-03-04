import { callAI } from "./aiClient.js";

export const generateLesson = async (topic) => {

  const prompt = `
  Create a structured beginner-friendly lesson about ${topic}.

  Include:
  1. Introduction
  2. Explanation
  3. Example
  4. Summary
  `;

  return await callAI(prompt);
};