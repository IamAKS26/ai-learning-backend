import UserInteraction from "../models/userInteraction.js";

export const recordInteraction = async (data) => {

  const interaction = await UserInteraction.create(data);

  return interaction;
};