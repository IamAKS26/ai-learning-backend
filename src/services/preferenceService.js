import UserPreference from "../models/userPreference.js";

export const updatePreference = async (userId, type, engagement) => {
  logger.info(`Updating preference for user ${userId}`);
  let preference = await UserPreference.findOne({ userId });

  if (!preference) {
    preference = await UserPreference.create({ userId });
  }

  if (type === "read") {
    preference.readWeight += engagement * 0.05;
  }

  if (type === "quiz") {
    preference.quizWeight += engagement * 0.05;
  }

  if (type === "video") {
    preference.videoWeight += engagement * 0.05;
  }

  if (type === "task") {
    preference.taskWeight += engagement * 0.05;
  }

  await preference.save();

  return preference;
};