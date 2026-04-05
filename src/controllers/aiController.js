import { callAIWithHistory } from "../ai/aiClient.js";

const SYSTEM_PROMPT = `You are an expert, encouraging AI tutor for EDUstream — a personalized AI-powered learning platform.

Your role:
- Explain concepts clearly, from beginner to advanced level
- Use rich Markdown formatting: headers (##, ###), **bold**, *italics*, bullet lists, numbered lists
- For code topics: always provide \`inline code\` and fenced code blocks with the correct language tag (e.g. \`\`\`javascript)
- Use real-world analogies to make abstract concepts concrete
- Be concise but thorough — structured responses are better than walls of text
- If the user asks a follow-up, reference your previous answer naturally
- Always end with an encouraging note or a follow-up question to keep them engaged

You MUST respond in Markdown. Never respond in plain text.`;

export const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;

    // Support both old single-prompt format and new messages[] format
    let conversationMessages;

    if (Array.isArray(messages) && messages.length > 0) {
      // Validate each message has role and content
      const valid = messages.every(
        (m) => m && typeof m.role === "string" && typeof m.content === "string"
      );
      if (!valid) {
        return res.status(400).json({ message: "Each message must have role and content" });
      }
      conversationMessages = messages;
    } else if (req.body.prompt && typeof req.body.prompt === "string") {
      // Backwards compatibility: single prompt
      conversationMessages = [{ role: "user", content: req.body.prompt }];
    } else {
      return res.status(400).json({ message: "Either messages[] or prompt is required" });
    }

    // Prepend system prompt
    const fullConversation = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationMessages,
    ];

    const reply = await callAIWithHistory(fullConversation);

    res.json({ reply, role: "assistant" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
