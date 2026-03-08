/**
 * =====================================================
 * Note Controller
 * =====================================================
 * Gère les opérations sur les notes des étudiants.
 *
 * @module controllers/noteController
 */

const NoteModel = require("../models/noteModel");
const { Parser } = require("json2csv");

/**
 * Sauvegarde un lot de notes.
 *
 * Accepte deux formats de body :
 *   - Tableau direct     : [{ userId, subjectId, serieId, value }, ...]
 *   - Objet enveloppant  : { notes: [{ userId, subjectId, serieId, value }, ...] }
 *
 * Route : POST /api/notes/save
 * Auth  : client
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
exports.saveNotes = async (req, res) => {
  try {
    // Normalisation : accepte [] ou { notes: [] }
    const notes = Array.isArray(req.body)
      ? req.body
      : Array.isArray(req.body?.notes)
        ? req.body.notes
        : null;

    if (!notes || notes.length === 0) {
      console.warn("⚠️ [Notes] Format invalide. Body reçu:", req.body);
      return res.status(400).json({
        error: "Format invalide. Envoyez un tableau de notes ou { notes: [] }.",
      });
    }

    console.log("📝 [Notes] Sauvegarde de", notes.length, "note(s)");

    const savedNoteIds = [];

    for (const note of notes) {
      const { userId, subjectId, serieId, value } = note;

      if (!userId || !subjectId || !serieId || value == null) {
        console.warn("⚠️ [Notes] Note incomplète:", note);
        return res.status(400).json({
          error: "Chaque note doit avoir userId, subjectId, serieId et value.",
        });
      }

      if (value < 0 || value > 20) {
        console.warn("⚠️ [Notes] Valeur hors bornes:", value);
        return res.status(400).json({
          error: "La valeur d'une note doit être comprise entre 0 et 20.",
        });
      }

      const noteId = await NoteModel.save({
        userId,
        subjectId,
        serieId,
        value,
      });
      savedNoteIds.push(noteId);
    }

    console.log("✅ [Notes] Notes sauvegardées:", savedNoteIds);

    return res.status(201).json({
      message: "Notes sauvegardées avec succès.",
      noteIds: savedNoteIds,
    });
  } catch (error) {
    console.error("❌ [Notes] Erreur saveNotes:", error);
    return res.status(500).json({
      error: `Erreur lors de la sauvegarde des notes : ${error.message}`,
    });
  }
};

/**
 * Récupère toutes les notes (admin uniquement).
 *
 * Route : GET /api/notes
 * Auth  : admin
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
exports.getAllNotes = async (req, res) => {
  try {
    console.log("🔎 [Notes] Récupération de toutes les notes");
    const notes = await NoteModel.getAll();
    console.log("✅ [Notes] Notes récupérées:", notes.length);
    return res.status(200).json(notes);
  } catch (error) {
    console.error("❌ [Notes] Erreur getAllNotes:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Récupère une note par son ID.
 *
 * Route : GET /api/notes/:id
 * Auth  : client
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
exports.getNoteById = async (req, res) => {
  try {
    console.log("🔎 [Notes] Récupération note ID:", req.params.id);
    const note = await NoteModel.getById(req.params.id);

    if (!note) {
      console.warn("⚠️ [Notes] Note introuvable:", req.params.id);
      return res.status(404).json({ message: "Note introuvable." });
    }

    console.log("✅ [Notes] Note trouvée:", note);
    return res.status(200).json(note);
  } catch (error) {
    console.error("❌ [Notes] Erreur getNoteById:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Crée une note individuelle (admin uniquement).
 *
 * Route : POST /api/notes
 * Auth  : admin
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
exports.createNote = async (req, res) => {
  try {
    const { userId, subjectId, serieId, value } = req.body;

    if (!userId || !subjectId || !serieId || value == null) {
      console.warn("⚠️ [Notes] Champs manquants à la création");
      return res
        .status(400)
        .json({ error: "Requête invalide. Tous les champs sont requis." });
    }

    if (value < 0 || value > 20) {
      console.warn("⚠️ [Notes] Valeur hors bornes à la création:", value);
      return res
        .status(400)
        .json({ error: "La note doit être comprise entre 0 et 20." });
    }

    const noteId = await NoteModel.save({ userId, subjectId, serieId, value });
    console.log("✅ [Notes] Note créée, ID:", noteId);
    return res.status(201).json({ message: "Note créée.", noteId });
  } catch (error) {
    console.error("❌ [Notes] Erreur createNote:", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
};

/**
 * Récupère toutes les notes d'un utilisateur.
 *
 * Route : GET /api/notes/user/:userId
 * Auth  : admin
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
exports.getNotesByUserId = async (req, res) => {
  try {
    console.log(
      "🔎 [Notes] Récupération notes pour userId:",
      req.params.userId,
    );
    const notes = await NoteModel.getByUserId(req.params.userId);
    console.log("✅ [Notes] Notes récupérées:", notes.length);
    return res.status(200).json(notes);
  } catch (error) {
    console.error("❌ [Notes] Erreur getNotesByUserId:", error);
    return res.status(500).json({ error: error.message });
  }
};
