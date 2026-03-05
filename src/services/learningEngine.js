import Unit from "../models/unit.js";
import { generateLesson } from "../ai/contentGenerator.js";
import { generateQuiz } from "../ai/quizGenerator.js";
import UserPreference from "../models/userPreference.js";
import { generateVideo } from "../ai/videoGenerator.js";

/*
Decides what type of unit should be generated next
based on user preference + module progress
*/

export const decideNextUnitType = async (userId, moduleId) => {

  // get units already generated for this module
  const units = await Unit.find({ moduleId });

  const lessonCount = units.filter(u => u.type === "read").length;
  const quizCount = units.filter(u => u.type === "quiz").length;

  // load user preference
  const pref = await UserPreference.findOne({ userId });

  // if user has no preference yet use default rule
  if (!pref) {

    if (lessonCount < 2) {
      return "read";
    }

    if (quizCount < 1) {
      return "quiz";
    }

    return "complete";
  }

  // build preference weight array
  const weights = [
    { type: "read", value: pref.readWeight },
    { type: "quiz", value: pref.quizWeight },
    { type: "video", value: pref.videoWeight },
    { type: "task", value: pref.taskWeight }
  ];

  // sort highest weight first
  weights.sort((a, b) => b.value - a.value);

  return weights[0].type;
};



/*
Generate the next unit dynamically
*/

export const generateNextUnit = async (userId, moduleId, topic) => {

  const type = await decideNextUnitType(userId, moduleId);

  // module finished
  if (type === "complete") {
    return {
      message: "Module completed"
    };
  }

  let content;

if (type === "read") {
  content = await generateLesson(topic);
}

if (type === "quiz") {
  content = await generateQuiz(topic);
}

if (type === "video") {
  content = await generateVideo(topic);
}

  const unit = await Unit.create({
    moduleId,
    type,
    content
  });

  return unit;
};