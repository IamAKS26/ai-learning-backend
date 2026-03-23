import UserPreference from "../models/userPreference.js";
import { logger } from "../utils/logger.js";

const MAX_WEIGHT = 2.0; // cap to prevent unbounded growth

export const updatePreference = async (userId, type, engagement) => {
  logger.info(`Updating preference for user ${userId}`);

  let preference = await UserPreference.findOne({ userId });

  if (!preference) {
    preference = await UserPreference.create({ userId });
  }

  const delta = engagement * 0.05;

  if (type === "read") {
    preference.readWeight = Math.min(preference.readWeight + delta, MAX_WEIGHT);
  } else if (type === "quiz") {
    preference.quizWeight = Math.min(preference.quizWeight + delta, MAX_WEIGHT);
  } else if (type === "video") {
    preference.videoWeight = Math.min(preference.videoWeight + delta, MAX_WEIGHT);
  } else if (type === "task") {
    preference.taskWeight = Math.min(preference.taskWeight + delta, MAX_WEIGHT);
  }

  await preference.save();

  return preference;
};