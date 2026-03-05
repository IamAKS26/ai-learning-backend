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