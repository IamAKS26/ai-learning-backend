import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit"
  },

  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module"
  },

  type: {
    type: String,
    enum: ["read", "quiz", "video", "task"]
  },

  timeSpent: {
    type: Number
  },

  // Expected range: 0.0 – 1.0
  quizScore: {
    type: Number,
    min: 0,
    max: 1
  },

  completed: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("UserInteraction", interactionSchema);