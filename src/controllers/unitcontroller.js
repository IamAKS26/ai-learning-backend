import Unit from "../models/unit.js";


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