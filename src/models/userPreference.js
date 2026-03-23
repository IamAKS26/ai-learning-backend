import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  readWeight: {
    type: Number,
    default: 0.4
  },

  quizWeight: {
    type: Number,
    default: 0.3
  },

  videoWeight: {
    type: Number,
    default: 0.2
  },

  taskWeight: {
    type: Number,
    default: 0.1
  }

}, { timestamps: true });

export default mongoose.model("UserPreference", preferenceSchema);