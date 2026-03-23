import Unit from "../models/unit.js";
import { nextUnitSchema, interactionSchema } from "../validators/unitValidator.js";
import { generateLesson } from "../ai/contentGenerator.js";
import { generateQuiz } from "../ai/quizGenerator.js";
import { generateNextUnit } from "../services/learningEngine.js";
import { recordInteraction } from "../services/interactionService.js";
import { updatePreference } from "../services/preferenceService.js";


// Create Unit
export const createUnit = async (req, res) => {
  try {
    const { moduleId, type, content, title, duration } = req.body;

    const unit = await Unit.create({ moduleId, type, content, title, duration });

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

// Generate Lesson Unit using AI
export const generateUnitAI = async (req, res) => {
  try {
    const { moduleId, topic } = req.body;

    if (!moduleId || !topic) {
      return res.status(400).json({ message: "moduleId and topic are required" });
    }

    const lesson = await generateLesson(topic);

    const unit = await Unit.create({
      moduleId,
      type: "read",
      title: `Lesson: ${topic}`,
      content: lesson
    });

    res.status(201).json(unit);

  } catch (error) {
    res.status(500).json({ message: "AI generation failed", error: error.message });
  }
};

// Generate Quiz Unit using AI
export const generateQuizUnit = async (req, res) => {
  try {
    const { moduleId, topic } = req.body;

    if (!moduleId || !topic) {
      return res.status(400).json({ message: "moduleId and topic are required" });
    }

    const quiz = await generateQuiz(topic);

    if (!Array.isArray(quiz)) {
      return res.status(500).json({ message: "Invalid quiz format from AI" });
    }

    const unit = await Unit.create({
      moduleId,
      type: "quiz",
      title: `Quiz: ${topic}`,
      content: quiz
    });

    res.status(201).json(unit);

  } catch (error) {
    res.status(500).json({ message: "Quiz generation failed", error: error.message });
  }
};

export const getNextUnit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { moduleId, topic } = req.body;

    console.log("Generating next unit for:", topic);

    const unit = await generateNextUnit(userId, moduleId, topic);

    res.json(unit);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const trackInteraction = async (req, res) => {
  try {
    const userId = req.user.id;

    const { unitId, moduleId, type, timeSpent, quizScore, completed } = req.body;

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

    // 2️⃣ Calculate engagement score (scores expected as 0–1 range)
    let engagement = 0.5;

    if (completed) {
      engagement = 1;
    }

    if (quizScore !== undefined) {
      // >= 80% → high engagement, else moderate
      engagement = quizScore >= 0.8 ? 1 : 0.6;
    }

    // 3️⃣ Update learning preference
    await updatePreference(userId, type, engagement);

    res.status(201).json({
      message: "Interaction recorded and preference updated",
      interaction
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};