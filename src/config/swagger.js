import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Learning API",
      version: "1.0.0",
      description: "API documentation for AI Learning Backend"
    },
    servers: [
      {
        url: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
      }
    ]
  },
  apis: [
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "../controllers/*.js")
  ]
};

let swaggerSpec;
try {
  swaggerSpec = swaggerJsdoc(options);
} catch (e) {
  console.warn("Swagger spec generation failed:", e.message);
  swaggerSpec = { openapi: "3.0.0", info: { title: "API", version: "1.0.0" }, paths: {} };
}

export const setupSwagger = (app) => {
  try {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  } catch (e) {
    console.warn("Swagger setup failed:", e.message);
  }
};