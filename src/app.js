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
import noteRoutes from "./routes/noteRoute.js";
import codeRoutes from "./routes/codeRoute.js";
import statsRoutes from "./routes/statsRoute.js";
import aiRoutes from "./routes/aiRoute.js";
import communityRoutes from "./routes/communityRoute.js";

const app = express();

// ── Serverless-safe Database Connection Middleware ───────────────────────────
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database Connection Failed:", error);
    res.status(500).json({
      success: false,
      message: "Database Connection Failed",
      error: error.message
    });
  }
});

// ── Security ───────────────────────────────────────────────────────────────
app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://ed-ustream.vercel.app/"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for development
  message: "Too many requests. Please try again later."
});
app.use(limiter);

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
app.use("/api/notes", noteRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/community", communityRoutes);

// ── Swagger docs ───────────────────────────────────────────────────────────
setupSwagger(app);

// ── Error handler (must be last) ───────────────────────────────────────────
app.use(errorHandler);

// ── Export for Serverless Deployment (Vercel) ──
export default app;