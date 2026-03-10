import { logger } from "../utils/logger.js";

logger.info("Generating lesson for topic: " + topic);

export const generateContent = async (topic) => {
  return `Generated lesson for ${topic}`;
};