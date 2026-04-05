import Note from "../models/note.js";

// POST /api/notes — create a new note
export const createNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, moduleId, unitId, content, metadata } = req.body;

    const note = await Note.create({
      userId,
      courseId: courseId || null,
      moduleId: moduleId || null,
      unitId: unitId || null,
      content: content || "",
      metadata: metadata || {}
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// GET /api/notes — get notes with optional filters
export const getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, moduleId, unitId } = req.query;

    const filter = { userId };
    if (courseId) filter.courseId = courseId;
    if (moduleId) filter.moduleId = moduleId;
    if (unitId) filter.unitId = unitId;

    const notes = await Note.find(filter).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// PUT /api/notes/:id — update a note
export const updateNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, metadata } = req.body;

    const note = await Note.findOne({ _id: req.params.id, userId });
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (content !== undefined) note.content = content;
    if (metadata !== undefined) note.metadata = metadata;
    await note.save();

    res.json(note);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// POST /api/notes/sync — upsert multiple notes
export const syncNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notes } = req.body;

    if (!Array.isArray(notes)) {
      return res.status(400).json({ message: "Expected an array of notes" });
    }

    const syncResults = await Promise.all(
      notes.map(async (n) => {
         // Create or update based on a local ID check 
         // Since local notes might not have a Mongo ID initially, we might need to rely on the frontend sending the Mongo _id if it exists.
         // Or just upsert based on some criteria. Let's assume frontend sends _id if it exists.
         
         if (n._id && n._id.length === 24) { // likely a Mongo ID
            const existing = await Note.findOne({ _id: n._id, userId });
            if (existing) {
               existing.content = n.content;
               existing.metadata = n.metadata || existing.metadata;
               await existing.save();
               return existing;
            }
         }

         // Otherwise create a new one
         return await Note.create({
            userId,
            courseId: n.courseId || null,
            moduleId: n.moduleId || null,
            unitId: n.unitId || null,
            content: n.content || "",
            metadata: n.metadata || {}
         });
      })
    );

    res.json(syncResults);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
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
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
