import Unit from "../models/unit.js";
import { generateLesson } from "../ai/contentGenerator.js";4
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

    const { moduleId, topic } = req.body;

    const unit = await generateNextUnit(moduleId, topic);

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

    const interaction = await recordInteraction({
      userId,
      unitId,
      moduleId,
      type,
      timeSpent,
      quizScore,
      completed
    });

    res.status(201).json(interaction);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};