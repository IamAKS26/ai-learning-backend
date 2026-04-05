import Module from "../models/module.js";

// Get a single Module by its ID
export const getModuleById = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });
    res.json(module);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};


// Create Module
export const createModule = async (req, res) => {
  try {
    const { courseId, title } = req.body;

    const module = await Module.create({
      courseId,
      title,
    });

    res.status(201).json(module);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};


// Get Modules by Course
export const getModulesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const modules = await Module.find({ courseId });

    res.json(modules);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};