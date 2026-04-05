import { callAI } from "../ai/aiClient.js";

// POST /api/code/review
export const reviewCode = async (req, res) => {
  try {
    const { code, language, taskDescription } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: "code and language are required" });
    }

    const prompt = `
You are a senior software engineer doing a code review for a student.

Task the student was given:
"${taskDescription || "Complete the programming task"}"

Student's code (${language}):
\`\`\`${language}
${code}
\`\`\`

Provide a structured code review. Return ONLY valid JSON — no markdown, no extra text.

{
  "rating": 7,
  "summary": "Brief overall assessment in 1-2 sentences",
  "positives": ["What the student did well (2-3 points)"],
  "suggestions": [
    {
      "title": "Suggestion title",
      "description": "Detailed explanation of the improvement",
      "improved_snippet": "Optional: a short code example showing the fix"
    }
  ],
  "bestPractice": "One key senior-dev tip about the language or topic"
}

Rating scale: 1-10 where 10 is perfect production code.
Be encouraging but honest. Sound like a helpful senior dev, not a grader.
`.trim();

    const result = await callAI(prompt);

    // Strip markdown fences if AI wraps in ```json ... ```
    const cleaned = result
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let review;
    try {
      review = JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON parse failed", e);
      // If JSON fails, return raw text as summary
      review = {
        rating: 5,
        summary: cleaned.substring(0, 300),
        positives: [],
        suggestions: [],
        bestPractice: ""
      };
    }

    res.json(review);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
