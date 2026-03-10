import UserInteraction from "../models/userInteraction.js";

export const recordInteraction = async (data) => {
  logger.info(`Interaction recorded for user ${userId}`);

  const interaction = await UserInteraction.create(data);

  return interaction;
};