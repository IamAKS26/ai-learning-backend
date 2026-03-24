import UserInteraction from "../models/userInteraction.js";
import { logger } from "../utils/logger.js";

export const recordInteraction = async (data) => {
  logger.info(`Interaction recorded for user ${data.userId}`);

  const interaction = await UserInteraction.create(data);

  return interaction;
};