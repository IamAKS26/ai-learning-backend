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
  learningHours: { type: Number, default: 0 }

}, { timestamps: true });

export default mongoose.model("User", userSchema);