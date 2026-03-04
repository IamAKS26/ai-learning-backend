import Unit from "../models/unit.js";
import { generateLesson } from "../ai/contentGenerator.js";

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