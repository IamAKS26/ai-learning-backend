import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import connectDB from "./config/db.js";
import { errorHandler } from "./Middleware/errorMiddleware.js";
import { setupSwagger } from "./config/swagger.js";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoute.js";
import moduleRoutes from "./routes/moduleRoute.js";
import unitRoutes from "./routes/unitRoute.js";

connectDB();

const app = express();

// ── Security ───────────────────────────────────────────────────────────────
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests. Please try again later."
});
app.use(limiter);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://your-frontend-domain.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// ── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("AI Learning Backend Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/units", unitRoutes);

// ── Swagger docs ───────────────────────────────────────────────────────────
setupSwagger(app);

// ── Error handler (must be last) ───────────────────────────────────────────
app.use(errorHandler);

// ── Start server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});