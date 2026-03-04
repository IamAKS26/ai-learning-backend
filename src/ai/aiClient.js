import Groq from "groq-sdk";

let groqInstance;

function getGroq() {
  if (groqInstance) return groqInstance;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    // helpful error to guide developer
    throw new Error(
      "GROQ_API_KEY environment variable is missing or empty. " +
        "Ensure you have run dotenv.config() very early (e.g. in app.js) " +
        "and that the .env file contains a valid key, or pass an apiKey option."
    );
  }

  groqInstance = new Groq({ apiKey });  
  return groqInstance;
}

export const callAI = async (prompt) => {
  const response = await getGroq().chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.1-8b-instant",
  });

  return response.choices[0].message.content;
};