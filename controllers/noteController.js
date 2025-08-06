const NoteModel = require('../models/noteModel');
const {Parser} = require('json2csv');

exports.saveNotes = async (req, res) => {
    try {
        const notes = req.body;
        console.log('📝 [Notes] Save attempt:', notes);

        if (!Array.isArray(notes) || notes.length === 0) {
            console.log('⚠️ [Notes] Invalid notes format. Expected an array of notes.');
            return res.status(400).json({'error': 'Invalid notes format. Expected an array of notes.'});
        }

        const savedNotes = [];

        for (const note of notes) {
            const {userId, subjectId, serieId, value} = note;

            if (!userId || !subjectId || !serieId || value == null) {
                console.log('⚠️ [Notes] Invalid note format:', note);
                return res.status(400).json({'error': 'Invalid note format. Each note must have userId, subjectId, serieId, and value.'});
            }

            if (value < 0 || value > 20) {
                console.log('⚠️ [Notes] Note value out of bounds:', value);
                return res.status(400).json({'error': 'Note value must be between 0 and 20.'});
            }

            const noteId = await NoteModel.save({userId, subjectId, serieId, value});
            savedNotes.push(noteId);
        }

        console.log('✅ [Notes] Notes saved:', savedNotes);
        return res.status(201).json({
            "message": "Notes saved successfully.",
            "noteIds": savedNotes
        });
    } catch (error) {
        console.error('❌ [Notes] Error saving notes:', error);
        return res.status(500).json({'error': `An error occurred while saving notes: ${error.message}`});
    }
}

// Récupérer toutes les notes (getAll)
exports.getAllNotes = async (req, res) => {
    try {
        console.log('🔎 [Notes] Get all notes');
        const notes = await NoteModel.getAll();
        console.log('✅ [Notes] Notes retrieved successfully:', notes.length);
        return res.status(200).json(notes);
    } catch (error) {
        console.log('❌ [Notes] Error getting notes:', error);
        return res.status(500).json({error: error.message});
    }
};

// Récupérer une note par ID (getById)
exports.getNoteById = async (req, res) => {
    try {
        console.log('🔎 [Notes] Get note by ID:', req.params.id);
        const note = await NoteModel.getById(req.params.id);
        if (!note) {
            console.log('⚠️ [Notes] Note not found:', req.params.id);
            return res.status(404).json({message: 'Note not found'});
        }
        console.log('✅ [Notes] Note retrieved successfully:', note);
        return res.status(200).json(note);
    } catch (error) {
        console.log('❌ [Notes] Error getting note by id:', error);
        return res.status(500).json({error: error.message});
    }
};

// Créer une note
exports.createNote = async (req, res) => {
    try {
        const {userId, subjectId, serieId, value} = req.body;
        if (!userId || !subjectId || !serieId || value == null) {
            console.log('⚠️ [Notes] Champs manquants à la création');
            return res.status(400).json({error: 'Requête invalide'});
        }
        if (value < 0 || value > 20) {
            console.log('⚠️ [Notes] Valeur hors bornes à la création');
            return res.status(400).json({error: 'La note doit être comprise entre 0 et 20'});
        }
        const noteId = await NoteModel.save({userId, subjectId, serieId, value});
        console.log('✅ [Notes] Note créée avec succès');
        return res.status(201).json({message: 'Note créée', noteId});
    } catch (error) {
        console.log('❌ [Notes] Erreur serveur à la création:', error);
        return res.status(500).json({error: 'Erreur serveur'});
    }
};

// Récupérer toutes les notes d'un user (getByUserId)
exports.getNotesByUserId = async (req, res) => {
    try {
        console.log('🔎 [Notes] Get notes by userId:', req.params.userId);
        const notes = await NoteModel.getByUserId(req.params.userId);
        console.log('✅ [Notes] Notes retrieved successfully for user:', req.params.userId);
        return res.status(200).json(notes);
    } catch (error) {
        console.log('❌ [Notes] Error getting notes by user id:', error);
        return res.status(500).json({error: error.message});
    }
};