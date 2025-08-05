const DegreeModel = require('../models/degreeModel');

// Récupérer tous les diplômes
exports.getAll = async (req, res) => {
    console.log('📚 [Degree] Récupération de tous les diplômes avec universités');
    try {
        const degrees = await DegreeModel.getAllWithUniversities();
        return res.status(200).json(degrees);
    } catch (error) {
        console.error('❌ [Degree] Erreur récupération diplômes:', error);
        return res.status(500).json({error: 'Erreur lors de la récupération des diplômes.'});
    }
};

// Récupérer un diplôme par ID
exports.getById = async (req, res) => {
    console.log(`🎓 [Degree] Récupération diplôme ID: ${req.params.id}`);
    try {
        const degree = await DegreeModel.getById(req.params.id);
        if (!degree) {
            console.warn('⚠️ [Degree] Diplôme non trouvé:', req.params.id);
            return res.status(404).json({error: 'Diplôme non trouvé.'});
        }
        console.log('✅ [Degree] Diplôme trouvé:', degree);
        return res.status(200).json(degree);
    } catch (error) {
        console.error('❌ [Degree] Erreur récupération diplôme:', error);
        return res.status(500).json({error: 'Erreur lors de la récupération du diplôme.'});
    }
};

// Créer un diplôme
exports.create = async (req, res) => {
    console.log('🆕 [Degree] Création diplôme:', req.body);
    try {
        const degreeData = {...req.body};
        const savedId = await DegreeModel.save(degreeData);
        const degree = await DegreeModel.getById(savedId);
        console.log(`✅ [Degree] Diplôme créé avec succès ID: ${savedId}`);
        return res.status(201).json(degree);
    } catch (error) {
        console.error('❌ [Degree] Erreur création diplôme:', error);
        return res.status(500).json({error: 'Erreur lors de la création du diplôme.'});
    }
};

// Mettre à jour un diplôme
exports.update = async (req, res) => {
    console.log(`✏️ [Degree] Mise à jour diplôme ID: ${req.params.id}`, req.body);
    try {
        const updated = await DegreeModel.update(req.params.id, req.body);
        if (!updated) {
            console.warn('⚠️ [Degree] Diplôme non trouvé ou rien à mettre à jour:', req.params.id);
            return res.status(404).json({error: 'Diplôme non trouvé ou aucun champ à mettre à jour'});
        }
        const degree = await DegreeModel.getById(req.params.id);
        console.log('✅ [Degree] Diplôme mis à jour:', degree);
        return res.status(200).json(degree);
    } catch (error) {
        console.error('❌ [Degree] Erreur mise à jour diplôme:', error);
        return res.status(500).json({error: 'Erreur lors de la mise à jour du diplôme.'});
    }
};

// Supprimer un diplôme
exports.delete = async (req, res) => {
    console.log(`🗑️ [Degree] Suppression diplôme ID: ${req.params.id}`);
    try {
        const deleted = await DegreeModel.delete(req.params.id);
        if (!deleted) {
            console.warn('⚠️ [Degree] Diplôme non trouvé pour suppression:', req.params.id);
            return res.status(404).json({error: 'Diplôme non trouvé'});
        }
        console.log('✅ [Degree] Diplôme supprimé:', req.params.id);
        return res.status(200).json({message: 'Diplôme supprimé'});
    } catch (error) {
        console.error('❌ [Degree] Erreur suppression diplôme:', error);
        return res.status(500).json({error: 'Erreur lors de la suppression du diplôme.'});
    }
};

// Récupérer les diplômes d'une université
exports.getByUniversityId = async (req, res) => {
    try {
        const degrees = await DegreeModel.getByUniversityId(req.params.universityId);
        return res.status(200).json(degrees);
    } catch (error) {
        console.error('❌ [Degree] Erreur récupération diplômes université:', error);
        return res.status(500).json({error: 'Erreur lors de la récupération des diplômes de l\'université.'});
    }
};

// Exporter tous les diplômes (CSV ou JSON)
exports.exportAll = async (req, res) => {
    try {
        const format = req.query.format || 'json';
        const data = await DegreeModel.exportAll(format);
        if (format === 'csv') {
            res.header('Content-Type', 'text/csv');
            res.attachment('degrees.csv');
            return res.send(data);
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error('❌ [Degree] Erreur export diplômes:', error);
        return res.status(500).json({error: 'Erreur lors de l\'export des diplômes.'});
    }
};

// Récupérer toutes les universités qui proposent ce diplôme
exports.getUniversities = async (req, res) => {
    try {
        const universities = await DegreeModel.getUniversities(req.params.id);
        return res.status(200).json(universities);
    } catch (error) {
        console.error('❌ [Degree] Erreur récupération universités du diplôme:', error);
        return res.status(500).json({error: 'Erreur lors de la récupération des universités du diplôme.'});
    }
};