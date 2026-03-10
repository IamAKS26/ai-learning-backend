import Unit from "../models/unit.js";
import { nextUnitSchema } from "../validators/unitValidator.js";
import { generateLesson } from "../ai/contentGenerator.js";
import { generateQuiz } from "../ai/quizGenerator.js";
import { generateNextUnit } from "../services/learningEngine.js";
import { recordInteraction } from "../services/interactionService.js";
import { updatePreference } from "../services/preferenceService.js";

// Create Unit
export const createUnit = async (req, res) => {
  try {
    const { moduleId, type, content } = req.body;

    const unit = await Unit.create({
      moduleId,
      type,
      content,
    });

    res.status(201).json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Units by Module
export const getUnitsByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const units = await Unit.find({ moduleId });

    res.json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate Unit using AI
export const generateUnitAI = async (req, res) => {
  try {

    const { moduleId, topic } = req.body;

    if (!moduleId || !topic) {
      return res.status(400).json({
        message: "moduleId and topic are required"
      });
    }

    // Call AI generator
    const lesson = await generateLesson(topic);

    // Save generated content
    const unit = await Unit.create({
      moduleId,
      type: "read",
      content: lesson
    });

    res.status(201).json(unit);

  } catch (error) {
    res.status(500).json({
      message: "AI generation failed",
      error: error.message
    });
  }
};

// Generate Quiz Unit using AI
export const generateQuizUnit = async (req, res) => {

  try {

    const { moduleId, topic } = req.body;

    if (!moduleId || !topic) {
      return res.status(400).json({
        message: "moduleId and topic are required"
      });
    }

    const quiz = await generateQuiz(topic);

    // Validate AI response
    if (!Array.isArray(quiz)) {
      return res.status(500).json({
        message: "Invalid quiz format from AI"
      });
    }

    const unit = await Unit.create({
      moduleId,
      type: "quiz",
      content: quiz
    });

    res.status(201).json(unit);

  } catch (error) {

    res.status(500).json({
      message: "Quiz generation failed",
      error: error.message
    });

  }

};

export const getNextUnit = async (req, res) => {

  try {

   const validated = nextUnitSchema.parse(req.body);

  const { userId, moduleId, topic } = validated;
    if (!userId || !moduleId || !topic) {
      return res.status(400).json({
        message: "userId, moduleId and topic are required"
      });
    }

    const unit = await generateNextUnit(userId, moduleId, topic);

    res.json(unit);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
export const trackInteraction = async (req, res) => {

  try {

    const {
      userId,
      unitId,
      moduleId,
      type,
      timeSpent,
      quizScore,
      completed
    } = req.body;

    // 1️⃣ Save interaction
    const interaction = await recordInteraction({
      userId,
      unitId,
      moduleId,
      type,
      timeSpent,
      quizScore,
      completed
    });

    // 2️⃣ Calculate engagement score
    let engagement = 0.5;

    if (completed) {
      engagement = 1;
    }

    if (quizScore !== undefined) {
      engagement = quizScore > 1 ? 1 : 0.6;
    }

    // 3️⃣ Update learning preference
    await updatePreference(userId, type, engagement);

    res.status(201).json({
      message: "Interaction recorded and preference updated",
      interaction
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
console.log("Generating next unit for:", topic);
};