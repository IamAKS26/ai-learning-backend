import Note from "../models/note.js";

// POST /api/notes — create a new note
export const createNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { moduleId, unitId, content } = req.body;

    if (!moduleId) {
      return res.status(400).json({ message: "moduleId is required" });
    }

    const note = await Note.create({
      userId,
      moduleId,
      unitId: unitId || null,
      content: content || ""
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/notes?moduleId= — get all notes for a module (current user)
export const getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { moduleId } = req.query;

    const filter = { userId };
    if (moduleId) filter.moduleId = moduleId;

    const notes = await Note.find(filter).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/notes/:id — update a note
export const updateNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;

    const note = await Note.findOne({ _id: req.params.id, userId });
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.content = content;
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/notes/:id — delete a note
export const deleteNote = async (req, res) => {
  try {
    const userId = req.user.id;

    const note = await Note.findOneAndDelete({ _id: req.params.id, userId });
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
