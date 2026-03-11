import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import courseRoutes from "./routes/courseRoute.js";
import moduleRoutes from "./routes/moduleRoute.js";
import unitRoutes from "./routes/unitRoute.js";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import { setupSwagger } from "./config/swagger.js";

connectDB();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(errorHandler);
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend-domain.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use("/api/auth", authRoutes);



app.use("/api/courses",courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/units", unitRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(setupSwagger));
setupSwagger(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests. Please try again later."
});
app.use(limiter); 


app.get("/", (req, res) => {
  res.send("AI Learning Backend Running 🚀");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});