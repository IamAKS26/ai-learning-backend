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
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};


// Get Units by Module
export const getUnitsByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const units = await Unit.find({ moduleId });

    res.json(units);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// Get single Unit by ID
export const getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id).populate("moduleId");
    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }
    res.json(unit);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
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
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
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
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
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
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
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

    // 💰 Dynamically update user XP and learning hours
    let xpEarned = 0;
    if (completed) xpEarned += 50; // base complete
    if (quizScore !== undefined) xpEarned += Math.floor(quizScore * 50);
    if (type === "task") xpEarned += 100;
    
    // Add time spent to learning hours (in seconds -> hours)
    const hoursEarned = (timeSpent || 0) / 3600;

    const { default: User } = await import("../models/user.js");
    const userToUpdate = await User.findById(userId);
    if (userToUpdate) {
      userToUpdate.xp = (userToUpdate.xp || 0) + xpEarned;
      userToUpdate.learningHours = (userToUpdate.learningHours || 0) + hoursEarned;
      if (xpEarned > 0) {
        // Basic streak update for demonstration that it dynamically updates
        userToUpdate.streak = (userToUpdate.streak || 0) + 1;
      }
      await userToUpdate.save();
    }

    // 4️⃣ Find the next unit in the module sequence
    let nextUnitId = null;
    if (moduleId) {
      const allUnits = await Unit.find({ moduleId }).sort({ createdAt: 1 });
      const currentIndex = allUnits.findIndex(u => u._id.toString() === unitId);
      if (currentIndex !== -1 && currentIndex < allUnits.length - 1) {
        nextUnitId = allUnits[currentIndex + 1]._id.toString();
      }
    }

    res.status(201).json({
      message: "Interaction recorded and preference updated",
      interaction,
      nextUnitId
    });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};