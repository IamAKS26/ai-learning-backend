import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
  },
  type: {
    type: String, // read | quiz | video | task
  },
  content: mongoose.Schema.Types.Mixed,
});

export default mongoose.model("Unit", unitSchema);