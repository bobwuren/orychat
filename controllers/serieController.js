const SerieModel = require('../models/serieModel');
const {Parser} = require('json2csv');
const SubjectModel = require('../models/subjectModel');

// Récupérer toutes les séries
exports.getAllSeries = async (req, res) => {
    try {
        console.log('🔎 [Series] Get all series');
        const series = await SerieModel.getAll();
        // Pour chaque série, récupérer les matières associées
        const seriesWithSubjects = await Promise.all(series.map(async (serie) => {
            const subjects = await SubjectModel.getBySerieId(serie.id);
            return {
                ...serie,
                subjects
            };
        }));
        return res.status(200).json({
            series: seriesWithSubjects
        });
    } catch (error) {
        console.error('❌ [Series] Error fetching series:', error);
        return res.status(500).json({error: `Error getting all series: ${error.message}`});
    }
}

// Récupérer une série par ID (getSerieById)
exports.getSerieById = async (req, res) => {
    try {
        console.log('🔎 [Series] Get serie by ID:', req.params.id);
        const serie = await SerieModel.getById(req.params.id);
        if (!serie) {
            console.log('⚠️ [Series] Serie not found:', req.params.id);
            return res.status(404).json({message: 'Serie not found'});
        }
        // Récupérer les matières liées à cette série
        const subjects = await SubjectModel.getBySerieId(req.params.id);
        res.status(200).json({
            ...serie,
            subjects
        });
    } catch (error) {
        console.log('❌ [Series] Error getting serie by Id:', error);
        res.status(500).json({error: error.message});
    }
};

// Créer une série
exports.createSerie = async (req, res) => {
    try {
        const {code, description, subjects} = req.body;
        if (!code || !description || !code.trim() || !description.trim()) {
            console.log('⚠️ [Series] Champs manquants ou invalides à la création');
            return res.status(400).json({error: 'Requête invalide'});
        }
        
        // Validation optionnelle des matières si fournies
        if (subjects !== undefined && !Array.isArray(subjects)) {
            console.log('⚠️ [Series] Format de subjects invalide à la création');
            return res.status(400).json({error: 'Le champ subjects doit être un tableau'});
        }
        
        const id = require('../utils/idHelper').generateId();
        
        // Créer la série
        await SerieModel.create({id, code: code.trim(), description: description.trim()});
        
        // Ajouter les matières si fournies (la méthode addSubjects gère la validation)
        if (subjects && Array.isArray(subjects) && subjects.length > 0) {
            await SerieModel.addSubjects(id, subjects);
        }
        
        // Récupérer la série créée avec ses matières
        const createdSerie = await SerieModel.getById(id);
        const serieSubjects = await SerieModel.getSubjects(id);
        
        console.log('✅ [Series] Serie créée avec succès');
        res.status(201).json({
            message: 'Série créée',
            serie: {
                ...createdSerie,
                subjects: serieSubjects || []
            }
        });
    } catch (error) {
        if (error.status === 409) {
            console.log('🚫 [Series] Code déjà utilisé lors de la création');
            return res.status(409).json({error: 'Conflit'});
        }
        console.log('❌ [Series] Erreur serveur à la création:', error);
        res.status(500).json({error: 'Erreur serveur'});
    }
};

// Update une série
exports.updateSerie = async (req, res) => {
    try {
        const {code, description, subjects} = req.body;
        if (!code || !description || !code.trim() || !description.trim()) {
            console.log('⚠️ [Series] Champs manquants ou invalides à la modification');
            return res.status(400).json({error: 'Requête invalide'});
        }
        
        // Validation optionnelle des matières si fournies
        if (subjects !== undefined && !Array.isArray(subjects)) {
            console.log('⚠️ [Series] Format de subjects invalide à la modification');
            return res.status(400).json({error: 'Le champ subjects doit être un tableau'});
        }
        
        const serie = await SerieModel.getById(req.params.id);
        if (!serie) {
            console.log('⚠️ [Series] Serie non trouvée à la modification:', req.params.id);
            return res.status(404).json({error: 'Non trouvé'});
        }
        
        // Mettre à jour la série
        await SerieModel.update(req.params.id, {code: code.trim(), description: description.trim()});
        
        // Mettre à jour les matières si fournies (la méthode updateSubjects gère la validation)
        if (subjects !== undefined) {
            await SerieModel.updateSubjects(req.params.id, subjects);
        }
        
        // Récupérer la série mise à jour avec ses matières
        const updatedSerie = await SerieModel.getById(req.params.id);
        const serieSubjects = await SerieModel.getSubjects(req.params.id);
        
        console.log('✅ [Series] Serie mise à jour avec succès');
        res.status(200).json({
            message: 'Série mise à jour',
            serie: {
                ...updatedSerie,
                subjects: serieSubjects || []
            }
        });
    } catch (error) {
        if (error.status === 409) {
            console.log('🚫 [Series] Code déjà utilisé lors de la modification');
            return res.status(409).json({error: 'Conflit'});
        }
        console.log('❌ [Series] Erreur serveur à la modification:', error);
        res.status(500).json({error: 'Erreur serveur'});
    }
};

// Exporter toutes les séries (CSV ou JSON)
exports.exportSeries = async (req, res) => {
    try {
        const format = req.query.format || 'json';
        const series = await SerieModel.getAll();
        // Pour chaque série, récupérer les matières associées
        const seriesWithSubjects = await Promise.all(series.map(async (serie) => {
            const subjects = await SubjectModel.getBySerieId(serie.id);
            return {
                ...serie,
                subjects
            };
        }));
        if (format === 'csv') {
            // Pour le CSV, aplatir les subjects en une seule ligne par série avec concaténation des subjects
            const flatSeries = seriesWithSubjects.map(serie => ({
                ...serie,
                subjects: serie.subjects.map(s => `${s.name} (coef:${s.coefficient})`).join(', ')
            }));
            const parser = new Parser({fields: ['id', 'code', 'description', 'subjects']});
            const csv = parser.parse(flatSeries);
            res.header('Content-Type', 'text/csv');
            res.attachment('series.csv');
            return res.send(csv);
        } else {
            res.header('Content-Type', 'application/json');
            return res.json({series: seriesWithSubjects});
        }
    } catch (error) {
        console.log('❌ [Series] Erreur export:', error);
        res.status(500).json({error: 'Erreur serveur'});
    }
};

// Supprimer une série (toujours en cascade grâce à ON DELETE CASCADE)
exports.deleteSerie = async (req, res) => {
    try {
        const serie = await SerieModel.getById(req.params.id);
        if (!serie) {
            console.log('⚠️ [Series] Serie non trouvée à la suppression:', req.params.id);
            return res.status(404).json({error: 'Non trouvé'});
        }
        await SerieModel.delete(req.params.id);
        console.log('🗑️ [Series] Serie supprimée (cascade SQL)');
        res.status(200).json({message: 'Série supprimée'});
    } catch (error) {
        console.log('❌ [Series] Erreur serveur à la suppression:', error);
        res.status(500).json({error: 'Erreur serveur'});
    }
};
