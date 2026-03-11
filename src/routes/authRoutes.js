import express from "express";
import { register, login } from "../controllers/authController.js";
import { validate } from "../Middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";

const router = express.Router();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */

router.post("/register", validate(registerSchema), register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */

router.post("/login", validate(loginSchema), login);

export default router;