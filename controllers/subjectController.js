const SubjectModel = require('../models/subjectModel');
const {Parser} = require('json2csv');

// Récupérer toutes les matières
exports.getAllSubjects = async (req, res) => {
    try {
        console.log('🔎 [Subjects] Get all subjects');
        const subjects = await SubjectModel.getAllSubjects();
        // Ajoute les coefficients pour chaque série
        const subjectsWithCoeffs = await Promise.all(subjects.map(async (subject) => {
            const seriesCoefficients = await SubjectModel.getSeriesCoefficientsForSubject(subject.id);
            return {
                id: subject.id,
                name: subject.name,
                seriesCoefficients
            };
        }));
        console.log('✅ [Subjects] Subjects fetched:', subjectsWithCoeffs.length);
        return res.status(200).json({'subjects': subjectsWithCoeffs});
    } catch (error) {
        console.error("❌ [Subjects] Error fetching subjects:", error);
        return res.status(500).json({error: `Error fetching all subjects: ${error.message}`});
    }
}

// Récupérer une matière par ID
exports.getSubjectById = async (req, res) => {
    const subjectId = req.params.id;
    try {
        console.log('🔎 [Subjects] Get subject by ID:', subjectId);
        const subject = await SubjectModel.getById(subjectId);
        if (!subject) {
            console.log('⚠️ [Subjects] Subject not found:', subjectId);
            return res.status(404).json({error: 'Subject not found'});
        }
        const seriesCoefficients = await SubjectModel.getSeriesCoefficientsForSubject(subject.id);
        console.log('✅ [Subjects] Subject fetched:', subjectId);
        return res.status(200).json({
            'subject': {
                id: subject.id,
                name: subject.name,
                seriesCoefficients
            }
        });
    } catch (error) {
        console.error("❌ [Subjects] Error fetching subject:", error);
        return res.status(500).json({error: `Error fetching subject: ${error.message}`});
    }
}

// Récupérer les matières d'une série
exports.getSubjectsBySerieId = async (req, res) => {
    const serieId = req.params.serieId;
    if (!serieId) {
        console.log('⚠️ [Subjects] Serie ID manquant dans la requête');
        return res.status(400).json({error: 'ID de série manquant'});
    }
    try {
        console.log('🔎 [Subjects] Get subjects by serieId:', serieId);
        const subjects = await SubjectModel.getBySerieId(serieId);
        console.log('✅ [Subjects] Subjects by serie fetched:', subjects.length);
        return res.status(200).json(subjects);
    } catch (error) {
        console.log('❌ [Subjects] Error getting subjects by serie Id:', error);
        return res.status(500).json({error: error.message});
    }
};

// Exporter toutes les matières (CSV ou JSON)
exports.exportSubjects = async (req, res) => {
    try {
        const format = req.query.format || 'json';
        console.log('📦 [Subjects] Export subjects in format:', format);
        
        // Récupérer toutes les matières avec leurs coefficients
        const subjects = await SubjectModel.getAllSubjects();
        const subjectsWithCoeffs = await Promise.all(subjects.map(async (subject) => {
            const seriesCoefficients = await SubjectModel.getSeriesCoefficientsForSubject(subject.id);
            return {
                id: subject.id,
                name: subject.name,
                seriesCoefficients,
                // Informations supplémentaires pour l'export
                totalSeries: Object.keys(seriesCoefficients).length,
                averageCoefficient: Object.keys(seriesCoefficients).length > 0 
                    ? (Object.values(seriesCoefficients).reduce((sum, coef) => sum + coef, 0) / Object.keys(seriesCoefficients).length).toFixed(2)
                    : 0
            };
        }));

        if (format === 'csv') {
            // Pour CSV, on aplatit les données pour avoir une ligne par matière-série
            const flattenedData = [];
            subjectsWithCoeffs.forEach(subject => {
                if (Object.keys(subject.seriesCoefficients).length > 0) {
                    Object.entries(subject.seriesCoefficients).forEach(([serieId, coefficient]) => {
                        flattenedData.push({
                            subject_id: subject.id,
                            subject_name: subject.name,
                            serie_id: serieId,
                            coefficient: coefficient,
                            total_series: subject.totalSeries,
                            average_coefficient: subject.averageCoefficient
                        });
                    });
                } else {
                    // Matière sans série associée
                    flattenedData.push({
                        subject_id: subject.id,
                        subject_name: subject.name,
                        serie_id: '',
                        coefficient: '',
                        total_series: 0,
                        average_coefficient: 0
                    });
                }
            });
            
            const parser = new Parser({
                fields: [
                    'subject_id', 
                    'subject_name', 
                    'serie_id', 
                    'coefficient', 
                    'total_series', 
                    'average_coefficient'
                ]
            });
            const csv = parser.parse(flattenedData);
            res.header('Content-Type', 'text/csv');
            res.attachment('subjects.csv');
            console.log('✅ [Subjects] CSV export completed:', flattenedData.length, 'rows');
            return res.send(csv);
        } else {
            res.header('Content-Type', 'application/json');
            console.log('✅ [Subjects] JSON export completed:', subjectsWithCoeffs.length, 'subjects');
            return res.json({
                subjects: subjectsWithCoeffs,
                metadata: {
                    total_subjects: subjectsWithCoeffs.length,
                    export_date: new Date().toISOString(),
                    format: 'json'
                }
            });
        }
    } catch (error) {
        console.log('❌ [Subjects] Erreur export:', error);
        return res.status(500).json({error: 'Erreur serveur'});
    }
};

// Créer une matière
exports.createSubject = async (req, res) => {
    try {
        const {name, seriesCoefficients} = req.body;
        console.log('📝 [Subjects] Tentative de création de matière:', {name, seriesCoefficients});
        
        if (!name || !name.trim() || name.length > 255) {
            console.log('⚠️ [Subjects] Champs manquants ou invalides à la création');
            return res.status(400).json({error: 'Requête invalide : name est requis'});
        }
        
        // Validation des coefficients si fournis
        if (seriesCoefficients && Array.isArray(seriesCoefficients)) {
            for (const sc of seriesCoefficients) {
                if (!sc.serieId || typeof sc.coefficient !== 'number') {
                    console.log('⚠️ [Subjects] Données série/coefficient invalides:', sc);
                    return res.status(400).json({error: 'Chaque série doit avoir un serieId et un coefficient numérique'});
                }
            }
        }
        
        // Créer la matière avec ou sans coefficients
        if (seriesCoefficients && Array.isArray(seriesCoefficients) && seriesCoefficients.length > 0) {
            const subjectId = await SubjectModel.createWithCoefficients(
                {name: name.trim()}, 
                seriesCoefficients
            );
            console.log('✅ [Subjects] Matière créée avec succès');
            return res.status(201).json({
                message: 'Matière créée avec succès',
                subject: {id: subjectId, name: name.trim(), seriesCoefficients: seriesCoefficients || []}
            });
        } else {
            const subjectId = await SubjectModel.create({name: name.trim()});
            console.log('✅ [Subjects] Matière créée avec succès');
            return res.status(201).json({
                message: 'Matière créée avec succès',
                subject: {id: subjectId, name: name.trim(), seriesCoefficients: []}
            });
        }
    } catch (error) {
        if (error.status === 409) {
            console.log('🚫 [Subjects] Nom déjà utilisé à la création');
            return res.status(409).json({error: 'Conflit'});
        }
        console.log('❌ [Subjects] Erreur serveur à la création:', error);
        return res.status(500).json({error: 'Erreur serveur'});
    }
};

// Modifier une matière
exports.updateSubject = async (req, res) => {
    try {
        const {name, seriesCoefficients} = req.body;
        console.log('✏️ [Subjects] Tentative de modification de matière:', req.params.id, {name, seriesCoefficients});
        
        if (!name || !name.trim() || name.length > 255) {
            console.log('⚠️ [Subjects] Champs manquants ou invalides à la modification');
            return res.status(400).json({error: 'Requête invalide'});
        }
        
        const subject = await SubjectModel.getById(req.params.id);
        if (!subject) {
            console.log('⚠️ [Subjects] Subject non trouvée à la modification:', req.params.id);
            return res.status(404).json({error: 'Non trouvé'});
        }
        
        // Validation des coefficients si fournis
        if (seriesCoefficients && Array.isArray(seriesCoefficients)) {
            for (const sc of seriesCoefficients) {
                if (!sc.serieId || typeof sc.coefficient !== 'number') {
                    console.log('⚠️ [Subjects] Données série/coefficient invalides lors de la modification:', sc);
                    return res.status(400).json({error: 'Chaque série doit avoir un serieId et un coefficient numérique'});
                }
            }
        }
        
        // Mettre à jour la matière avec ou sans coefficients
        await SubjectModel.updateWithCoefficients(
            Number(req.params.id), 
            {name: name.trim()}, 
            seriesCoefficients
        );
        
        console.log('✅ [Subjects] Matière modifiée avec succès');
        return res.status(200).json({
            message: 'Matière modifiée avec succès',
            subject: {id: req.params.id, name: name.trim(), seriesCoefficients: seriesCoefficients || []}
        });
    } catch (error) {
        if (error.status === 409) {
            console.log('🚫 [Subjects] Nom déjà utilisé à la modification');
            return res.status(409).json({error: 'Conflit'});
        }
        console.log('❌ [Subjects] Erreur serveur à la modification:', error);
        return res.status(500).json({error: 'Erreur serveur'});
    }
};

// Supprimer une matière (cascade SQL)
exports.deleteSubject = async (req, res) => {
    try {
        const subject = await SubjectModel.getById(req.params.id);
        if (!subject) {
            console.log('⚠️ [Subjects] Subject non trouvée à la suppression:', req.params.id);
            return res.status(404).json({error: 'Non trouvé'});
        }
        await SubjectModel.delete(req.params.id);
        console.log('🗑️ [Subjects] Subject supprimée (cascade SQL)');
        return res.status(200).json({message: 'Matière supprimée (et toutes ses dépendances)'});
    } catch (error) {
        console.log('❌ [Subjects] Erreur serveur à la suppression:', error);
        return res.status(500).json({error: 'Erreur serveur'});
    }
};