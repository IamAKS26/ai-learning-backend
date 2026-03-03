import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import courseRoutes from "./routes/courseRoute.js";
import moduleRoutes from "./routes/moduleRoute.js";
import unitRoutes from "./routes/unitRoute.js";


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/courses",courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/units", unitRoutes);

app.get("/", (req, res) => {
  res.send("AI Learning Backend Running 🚀");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});