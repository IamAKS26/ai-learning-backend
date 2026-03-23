import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true
    },

    type: {
      type: String,
      enum: ["read", "quiz", "video", "task"],
      required: true
    },
    
    title: {
      type: String,
      required: true
    },

    duration: {
      type: String, // e.g., "15:00"
      default: "00:00"
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }

  },
  {
    timestamps: true
  }
);

export default mongoose.model("Unit", unitSchema);