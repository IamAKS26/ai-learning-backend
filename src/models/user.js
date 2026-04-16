import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  xp: { type: Number, default: 0 },
  badges: { type: Number, default: 0 },
  certificates: { type: Number, default: 0 },
  learningHours: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  bio: { type: String, default: "" },
  avatarColor: { type: String, default: "bg-slate-200 text-slate-600" },
  website: { type: String, default: "" }

}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);