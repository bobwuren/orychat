const UniversityModel = require('../models/universityModel');

// Récupérer toutes les universités (avec diplômes associés)
exports.getAll = async (req, res) => {
    console.log('🏫 [Universities] Récupération de toutes les universités');
    try {
        const universities = await UniversityModel.getAll();
        console.log('✅ [Universities] Universités récupérées:', universities.length);
        res.status(200).json(universities);
    } catch (error) {
        console.error('❌ [Universities] Erreur récupération universités:', error);
        res.status(500).json({error: 'Erreur lors de la récupération des universités.'});
    }
};

// Récupérer toutes les universités sponsors (avec diplômes associés)
exports.getAllSponsors = async (req, res) => {
    console.log('🏫 [Universities] Récupération des universités sponsors');
    try {
        const sponsors = await UniversityModel.getAllSponsors();
        console.log('✅ [Universities] Sponsors récupérés:', sponsors.length);
        res.status(200).json(sponsors);
    } catch (error) {
        console.error('❌ [Universities] Erreur récupération sponsors:', error);
        res.status(500).json({error: 'Erreur lors de la récupération des universités sponsors.'});
    }
};

// Récupérer une université par ID (avec diplômes associés)
exports.getById = async (req, res) => {
    try {
        const university = await UniversityModel.getById(req.params.id);
        if (!university) return res.status(404).json({error: 'Université non trouvée.'});
        res.status(200).json(university);
    } catch (error) {
        res.status(500).json({error: 'Erreur lors de la récupération de l\'université.'});
    }
};

// Récupérer les diplômes d'une université
exports.getDegrees = async (req, res) => {
    try {
        const degrees = await UniversityModel.getDegrees(req.params.id);
        res.status(200).json(degrees);
    } catch (error) {
        res.status(500).json({error: 'Erreur lors de la récupération des diplômes.'});
    }
};

// Créer une université
exports.createUniversity = async (req, res) => {
    try {
        const {name, webSite, description, isSponsor, degrees} = req.body;
        const id = require('../utils/idHelper').generateId();
        console.log('🏫 [Universities] Tentative de création université:', {id, name, webSite, description, isSponsor, degrees});
        if (!name || !name.trim() || name.length > 255 || !Array.isArray(degrees) || degrees.length === 0) {
            console.log('⚠️ [Universities] Champs manquants ou invalides à la création (ou aucune formation fournie)');
            return res.status(400).json({error: 'Requête invalide : name et au moins une formation sont requis'});
        }
        // Utilisation du modèle pour la création et l'association
        await UniversityModel.createWithDegrees({id, name: name.trim(), webSite, description, isSponsor: Boolean(isSponsor), degrees});
        console.log('✅ [Universities] Université créée et liée à des formations avec succès');
        return res.status(201).json({
            message: 'Université créée et liée à des formations',
            university: {id, name: name.trim(), webSite, description, isSponsor: Boolean(isSponsor), degrees}
        });
    } catch (error) {
        if (error.status === 409) {
            console.log('🚫 [Universities] Nom déjà utilisé à la création');
            return res.status(409).json({error: 'Conflit'});
        }
        console.log('❌ [Universities] Erreur serveur à la création:', error);
        return res.status(500).json({error: 'Erreur serveur'});
    }
};

// Mettre à jour une université
exports.updateUniversity = async (req, res) => {
    try {
        const {name, webSite, description, isSponsor, degrees} = req.body;
        console.log('✏️ [Universities] Tentative de modification université:', {id: req.params.id, name, webSite, description, isSponsor, degrees});
        if (!name && !webSite && !description && (isSponsor === undefined) && !degrees) {
            console.log('⚠️ [Universities] Aucun champ à modifier');
            return res.status(400).json({error: 'Aucune donnée à modifier'});
        }
        const university = await UniversityModel.getById(req.params.id);
        if (!university) {
            console.log('⚠️ [Universities] Université non trouvée à la modification:', req.params.id);
            return res.status(404).json({error: 'Non trouvé'});
        }
        // Utilisation du modèle pour la mise à jour et l'association
        const updateData = {
            ...(name ? {name} : {}),
            ...(webSite !== undefined ? {webSite} : {}),
            ...(description !== undefined ? {description} : {}),
            ...(isSponsor !== undefined ? {isSponsor: Boolean(isSponsor)} : {}),
            ...(degrees ? {degrees} : {})
        };
        await UniversityModel.updateWithDegrees(req.params.id, updateData);
        console.log('✅ [Universities] Université modifiée avec succès:', req.params.id);
        return res.status(200).json({
            message: 'Université modifiée',
            university: {
                id: req.params.id,
                ...(name ? {name: name.trim()} : {}),
                ...(webSite !== undefined ? {webSite} : {}),
                ...(description !== undefined ? {description} : {}),
                ...(isSponsor !== undefined ? {isSponsor: Boolean(isSponsor)} : {}),
                ...(Array.isArray(degrees) ? {degrees} : {})
            }
        });
    } catch (error) {
        if (error.status === 409) {
            console.log('🚫 [Universities] Nom déjà utilisé à la modification');
            return res.status(409).json({error: 'Conflit'});
        }
        console.log('❌ [Universities] Erreur serveur à la modification:', error);
        return res.status(500).json({error: 'Erreur serveur'});
    }
};

// Supprimer une université
exports.delete = async (req, res) => {
    try {
        const deleted = await UniversityModel.delete(req.params.id);
        if (!deleted) return res.status(404).json({error: 'Université non trouvée.'});
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: 'Erreur lors de la suppression de l\'université.'});
    }
};

// Associer un diplôme à une université
exports.addDegree = async (req, res) => {
    try {
        const {degreeId} = req.body;
        if (!degreeId) return res.status(400).json({error: 'degreeId requis.'});
        await UniversityModel.addDegree(req.params.id, degreeId);
        const university = await UniversityModel.getById(req.params.id);
        res.status(200).json(university);
    } catch (error) {
        res.status(500).json({error: 'Erreur lors de l\'ajout du diplôme.'});
    }
};

// Supprimer un diplôme d'une université
exports.removeDegree = async (req, res) => {
    try {
        const {degreeId} = req.body;
        if (!degreeId) return res.status(400).json({error: 'degreeId requis.'});
        await UniversityModel.removeDegree(req.params.id, degreeId);
        const university = await UniversityModel.getById(req.params.id);
        res.status(200).json(university);
    } catch (error) {
        res.status(500).json({error: 'Erreur lors de la suppression du diplôme.'});
    }
};

// Récupérer les universités sponsors qui proposent un diplôme donné
exports.getSponsorsByDegree = async (req, res) => {
    try {
        const {degreeId} = req.query;
        if (!degreeId) return res.status(400).json({error: 'degreeId requis.'});
        const sponsors = await UniversityModel.getSponsorsByDegree(degreeId);
        res.status(200).json(sponsors);
    } catch (error) {
        res.status(500).json({error: 'Erreur lors de la récupération des sponsors pour ce diplôme.'});
    }
};

// Exporter toutes les universités (CSV ou JSON)
exports.exportAll = async (req, res) => {
    try {
        const format = req.query.format === 'csv' ? 'csv' : 'json';
        const data = await UniversityModel.exportAll(format);
        if (format === 'csv') {
            res.header('Content-Type', 'text/csv');
            res.attachment('universities.csv');
            return res.send(data);
        }
        res.status(200).json({ universities: data });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'export des universités.' });
    }
};

// Récupérer toutes les universités qui proposent un diplôme donné
exports.getByDegree = async (req, res) => {
    try {
        const universities = await UniversityModel.getByDegree(req.params.degreeId);
        res.status(200).json(universities);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des universités pour ce diplôme.' });
    }
};
