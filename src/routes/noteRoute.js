import express from "express";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  syncNotes
} from "../controllers/noteController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createNote);
router.post("/sync", protect, syncNotes);
router.get("/", protect, getNotes);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

export default router;
