import { generateGroqResponse } from "../ai/groqService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const aiPrompt = `You are a helpful and encouraging AI tutor. The user says: "${prompt}". Provide a concise, educational response.`;
    const response = await generateGroqResponse(aiPrompt, { temperature: 0.7 });

    res.json({ reply: response });
  } catch (error) {
    res.status(500).json({ message: "AI chat failed", error: error.message });
  }
};
