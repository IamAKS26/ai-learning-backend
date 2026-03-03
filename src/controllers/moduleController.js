import Module from "../models/module.js";


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
    res.status(500).json({ message: error.message });
  }
};


// Get Modules by Course
export const getModulesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const modules = await Module.find({ courseId });

    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};