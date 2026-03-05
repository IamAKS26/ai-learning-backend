import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  userId: {
    type: String,
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
    enum: ["read", "quiz"]
  },

  timeSpent: {
    type: Number
  },

  quizScore: {
    type: Number
  },

  completed: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("UserInteraction", interactionSchema);