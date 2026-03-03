import Course from "../models/Course.js";

export const createCourse = async (req, res) => {
  const { title, description } = req.body;

  const course = await Course.create({ title, description });

  res.json(course);
};

export const getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};