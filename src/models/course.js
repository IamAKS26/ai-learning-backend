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
  ratingsCount: {
    type: Number,
    default: 0
  },
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      value: { type: Number, min: 1, max: 5 },
      review: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  views: { type: Number, default: 0 },
  enrolledCount: { type: Number, default: 0 },
  tags: [{ type: String }],
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

export default mongoose.models.Course || mongoose.model("Course", courseSchema);