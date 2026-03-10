import Groq from "groq-sdk";
import { aiLimiter } from "../utils/aiLimiter.js";

let groqInstance;

function getGroq() {
  if (groqInstance) return groqInstance;

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY environment variable is missing or empty. " +
      "Ensure dotenv.config() runs early and your .env contains a valid key."
    );
  }

  groqInstance = new Groq({ apiKey });
  return groqInstance;
}

export const callAI = async (prompt) => {

  return aiLimiter.schedule(async () => {

    const response = await getGroq().chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant"
    });

    return response.choices[0].message.content;

  });

};