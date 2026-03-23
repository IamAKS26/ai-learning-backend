import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  duration: String,
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
  },
  rating: {
    type: Number,
    default: 0
  },
  category: String,
  lessonsCount: {
    type: Number,
    default: 0
  },

  // Ownership & visibility
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("Course", courseSchema);