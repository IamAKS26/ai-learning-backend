import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      default: null
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    content: {
      type: String,
      required: true,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
