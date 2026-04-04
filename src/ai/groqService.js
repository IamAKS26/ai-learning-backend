import { callAI } from "./aiClient.js";

/**
 * generateGroqResponse — thin wrapper over the existing Groq aiClient.
 * Accepts any prompt string and optional options (currently unused, reserved
 * for future model/temperature tuning).
 *
 * @param {string} prompt
 * @param {object} [options]  e.g. { temperature: 0.7 }
 * @returns {Promise<string>} AI text response
 */
export const generateGroqResponse = async (prompt, options = {}) => {
  return callAI(prompt, options);
};
