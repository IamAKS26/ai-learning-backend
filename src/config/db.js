import mongoose from "mongoose";

const connectDB = async () => {
  // Safe MongoDB connection check
  if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
    throw new Error("MONGODB_URI missing");
  }

  // Use either one that is available
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Error:", error);
    process.exit(1);
  }
};

export default connectDB;