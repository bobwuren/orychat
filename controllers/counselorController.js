/**
 * =====================================================
 * Counselor Controller
 * =====================================================
 * Gère les requêtes HTTP liées aux conseillers d'orientation
 *
 * @module controllers/counselorController
 * @version 2.0
 */

const CounselorModel = require('../models/counselorModel');
const validator = require('validator');

/**
 * Récupère tous les conseillers actifs
 *
 * Route: GET /api/counselors
 * Auth: Requise (Bearer token - tous les rôles)
 *
 * @param {Object} req - Requête Express
 * @param {Object} req.query - Query params
 * @param {string} req.query.specialty - Filtrer par spécialité (optionnel)
 * @param {Object} res - Réponse Express
 * @returns {Promise<void>}
 */
exports.getAllCounselors = async (req, res) => {
    try {
        const { specialty } = req.query;

        console.log('🔎 [Counselors] Récupération des conseillers actifs');

        let counselors;

        if (specialty) {
            console.log(`🔍 [Counselors] Filtrage par spécialité: ${specialty}`);
            counselors = await CounselorModel.getBySpecialty(specialty);
        } else {
            counselors = await CounselorModel.getAllActive();
        }

        console.log(`✅ [Counselors] ${counselors.length} conseiller(s) trouvé(s)`);

        return res.status(200).json({
            success: true,
            counselors: counselors,
            count: counselors.length
        });

    } catch (error) {
        console.error('❌ [Counselors] Erreur lors de la récupération:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des conseillers'
        });
    }
};

/**
 * Récupère tous les conseillers (actifs + inactifs) - Admin uniquement
 *
 * Route: GET /api/counselors/all
 * Auth: Requise (Bearer token - admin uniquement)
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Promise<void>}
 */
exports.getAllCounselorsAdmin = async (req, res) => {
    try {
        console.log('🔎 [Counselors] Récupération de tous les conseillers (admin)');

        const counselors = await CounselorModel.getAll();

        console.log(`✅ [Counselors] ${counselors.length} conseiller(s) trouvé(s)`);

        return res.status(200).json({
            success: true,
            counselors: counselors,
            count: counselors.length
        });

    } catch (error) {
        console.error('❌ [Counselors] Erreur lors de la récupération:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des conseillers'
        });
    }
};

/**
 * Récupère un conseiller par son ID
 *
 * Route: GET /api/counselors/:id
 * Auth: Requise (Bearer token - tous les rôles)
 *
 * @param {Object} req - Requête Express
 * @param {string} req.params.id - ID du conseiller
 * @param {Object} res - Réponse Express
 * @returns {Promise<void>}
 */
exports.getCounselorById = async (req, res) => {
    try {
        const counselorId = req.params.id;

        console.log('🔎 [Counselors] Récupération conseiller ID:', counselorId);

        const counselor = await CounselorModel.getById(counselorId);

        if (!counselor) {
            console.log('⚠️ [Counselors] Conseiller non trouvé');
            return res.status(404).json({
                success: false,
                error: 'Conseiller non trouvé'
            });
        }

        console.log('✅ [Counselors] Conseiller trouvé:', counselor.name);

        return res.status(200).json({
            success: true,
            counselor: counselor
        });

    } catch (error) {
        console.error('❌ [Counselors] Erreur lors de la récupération:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération du conseiller'
        });
    }
};

/**
 * Crée un nouveau conseiller - Admin uniquement
 *
 * Route: POST /api/counselors
 * Auth: Requise (Bearer token - admin uniquement)
 *
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.name - Nom complet (obligatoire)
 * @param {string} req.body.email - Email unique (obligatoire)
 * @param {string} req.body.phone - Téléphone (optionnel)
 * @param {string} req.body.photo - URL photo (optionnel)
 * @param {string} req.body.bio - Biographie (optionnel)
 * @param {Array} req.body.specialties - Spécialités (optionnel)
 * @param {boolean} req.body.isActive - Statut actif (optionnel)
 * @param {Object} res - Réponse Express
 * @returns {Promise<void>}
 */
exports.createCounselor = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            photo,
            bio,
            specialties,
            isActive
        } = req.body;

        console.log('📝 [Counselors] Tentative de création:', { name, email });

        // Validation des champs obligatoires
        if (!name || !name.trim()) {
            console.log('⚠️ [Counselors] Nom manquant');
            return res.status(400).json({
                success: false,
                error: 'Le nom est obligatoire'
            });
        }

        if (!email || !email.trim()) {
            console.log('⚠️ [Counselors] Email manquant');
            return res.status(400).json({
                success: false,
                error: 'L\'email est obligatoire'
            });
        }

        // Validation format email
        if (!validator.isEmail(email)) {
            console.log('⚠️ [Counselors] Format email invalide');
            return res.status(400).json({
                success: false,
                error: 'Format d\'email invalide'
            });
        }

        // Vérifier si l'email existe déjà
        const emailExists = await CounselorModel.emailExists(email);
        if (emailExists) {
            console.log('⚠️ [Counselors] Email déjà utilisé');
            return res.status(409).json({
                success: false,
                error: 'Un conseiller avec cet email existe déjà'
            });
        }

        // Validation des spécialités (doit être un tableau si fourni)
        if (specialties && !Array.isArray(specialties)) {
            console.log('⚠️ [Counselors] Format specialties invalide');
            return res.status(400).json({
                success: false,
                error: 'Les spécialités doivent être un tableau'
            });
        }

        // Validation URL photo (si fournie)
        if (photo && !validator.isURL(photo)) {
            console.log('⚠️ [Counselors] URL photo invalide');
            return res.status(400).json({
                success: false,
                error: 'L\'URL de la photo est invalide'
            });
        }

        // Création du conseiller
        const counselorData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : null,
            photo: photo ? photo.trim() : null,
            bio: bio ? bio.trim() : null,
            specialties: specialties || [],
            isActive: isActive !== undefined ? isActive : true
        };

        const counselorId = await CounselorModel.create(counselorData);

        console.log('✅ [Counselors] Conseiller créé avec succès, ID:', counselorId);

        // Récupérer le conseiller créé
        const createdCounselor = await CounselorModel.getById(counselorId);

        return res.status(201).json({
            success: true,
            message: 'Conseiller créé avec succès',
            counselor: createdCounselor
        });

    } catch (error) {
        console.error('❌ [Counselors] Erreur lors de la création:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la création du conseiller'
        });
    }
};

/**
 * Met à jour un conseiller - Admin uniquement
 *
 * Route: PUT /api/counselors/:id
 * Auth: Requise (Bearer token - admin uniquement)
 *
 * @param {Object} req - Requête Express
 * @param {string} req.params.id - ID du conseiller
 * @param {Object} req.body - Données à mettre à jour (tous optionnels)
 * @param {Object} res - Réponse Express
 * @returns {Promise<void>}
 */
exports.updateCounselor = async (req, res) => {
    try {
        const counselorId = req.params.id;
        const {
            name,
            email,
            phone,
            photo,
            bio,
            specialties,
            isActive
        } = req.body;

        console.log('✏️ [Counselors] Tentative de mise à jour ID:', counselorId);

        // Vérifier que le conseiller existe
        const existingCounselor = await CounselorModel.getById(counselorId);
        if (!existingCounselor) {
            console.log('⚠️ [Counselors] Conseiller non trouvé');
            return res.status(404).json({
                success: false,
                error: 'Conseiller non trouvé'
            });
        }

        // Validation email si fourni
        if (email) {
            if (!validator.isEmail(email)) {
                console.log('⚠️ [Counselors] Format email invalide');
                return res.status(400).json({
                    success: false,
                    error: 'Format d\'email invalide'
                });
            }

            // Vérifier si le nouvel email est déjà utilisé (par un autre conseiller)
            const emailExists = await CounselorModel.emailExists(email, counselorId);
            if (emailExists) {
                console.log('⚠️ [Counselors] Email déjà utilisé');
                return res.status(409).json({
                    success: false,
                    error: 'Cet email est déjà utilisé par un autre conseiller'
                });
            }
        }

        // Validation spécialités si fournies
        if (specialties && !Array.isArray(specialties)) {
            console.log('⚠️ [Counselors] Format specialties invalide');
            return res.status(400).json({
                success: false,
                error: 'Les spécialités doivent être un tableau'
            });
        }

        // Validation URL photo si fournie
        if (photo && !validator.isURL(photo)) {
            console.log('⚠️ [Counselors] URL photo invalide');
            return res.status(400).json({
                success: false,
                error: 'L\'URL de la photo est invalide'
            });
        }

        // Construire l'objet de mise à jour
        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (email !== undefined) updateData.email = email.trim().toLowerCase();
        if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
        if (photo !== undefined) updateData.photo = photo ? photo.trim() : null;
        if (bio !== undefined) updateData.bio = bio ? bio.trim() : null;
        if (specialties !== undefined) updateData.specialties = specialties;
        if (isActive !== undefined) updateData.isActive = isActive;

        // Vérifier qu'il y a au moins un champ à mettre à jour
        if (Object.keys(updateData).length === 0) {
            console.log('⚠️ [Counselors] Aucune donnée à mettre à jour');
            return res.status(400).json({
                success: false,
                error: 'Aucune donnée à mettre à jour'
            });
        }

        // Mise à jour
        await CounselorModel.update(counselorId, updateData);

        console.log('✅ [Counselors] Conseiller mis à jour');

        // Récupérer le conseiller mis à jour
        const updatedCounselor = await CounselorModel.getById(counselorId);

        return res.status(200).json({
            success: true,
            message: 'Conseiller mis à jour avec succès',
            counselor: updatedCounselor
        });

    } catch (error) {
        console.error('❌ [Counselors] Erreur lors de la mise à jour:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la mise à jour du conseiller'
        });
    }
};

/**
 * Supprime un conseiller - Admin uniquement
 *
 * Route: DELETE /api/counselors/:id
 * Auth: Requise (Bearer token - admin uniquement)
 *
 * @param {Object} req - Requête Express
 * @param {string} req.params.id - ID du conseiller
 * @param {Object} res - Réponse Express
 * @returns {Promise<void>}
 */
exports.deleteCounselor = async (req, res) => {
    try {
        const counselorId = req.params.id;

        console.log('🗑️ [Counselors] Tentative de suppression ID:', counselorId);

        // Vérifier que le conseiller existe
        const counselor = await CounselorModel.getById(counselorId);
        if (!counselor) {
            console.log('⚠️ [Counselors] Conseiller non trouvé');
            return res.status(404).json({
                success: false,
                error: 'Conseiller non trouvé'
            });
        }

        // Suppression
        await CounselorModel.delete(counselorId);

        console.log('✅ [Counselors] Conseiller supprimé');

        return res.status(200).json({
            success: true,
            message: 'Conseiller supprimé avec succès'
        });

    } catch (error) {
        console.error('❌ [Counselors] Erreur lors de la suppression:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression du conseiller'
        });
    }
};

/**
 * Désactive un conseiller - Admin uniquement
 *
 * Route: PATCH /api/counselors/:id/deactivate
 * Auth: Requise (Bearer token - admin uniquement)
 *
 * @param {Object} req - Requête Express
 * @param {string} req.params.id - ID du conseiller
 * @param {Object} res - Réponse Express
 * @returns {Promise<void>}
 */
exports.deactivateCounselor = async (req, res) => {
    try {
        const counselorId = req.params.id;

        console.log('🔒 [Counselors] Désactivation conseiller ID:', counselorId);

        // Vérifier que le conseiller existe
        const counselor = await CounselorModel.getById(counselorId);
        if (!counselor) {
            console.log('⚠️ [Counselors] Conseiller non trouvé');
            return res.status(404).json({
                success: false,
                error: 'Conseiller non trouvé'
            });
        }

        // Désactivation
        await CounselorModel.deactivate(counselorId);

        console.log('✅ [Counselors] Conseiller désactivé');

        return res.status(200).json({
            success: true,
            message: 'Conseiller désactivé avec succès'
        });

    } catch (error) {
        console.error('❌ [Counselors] Erreur lors de la désactivation:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la désactivation du conseiller'
        });
    }
};

/**
 * Active un conseiller - Admin uniquement
 *
 * Route: PATCH /api/counselors/:id/activate
 * Auth: Requise (Bearer token - admin uniquement)
 *
 * @param {Object} req - Requête Express
 * @param {string} req.params.id - ID du conseiller
 * @param {Object} res - Réponse Express
 * @returns {Promise<void>}
 */
exports.activateCounselor = async (req, res) => {
    try {
        const counselorId = req.params.id;

        console.log('🔓 [Counselors] Activation conseiller ID:', counselorId);

        // Vérifier que le conseiller existe
        const counselor = await CounselorModel.getById(counselorId);
        if (!counselor) {
            console.log('⚠️ [Counselors] Conseiller non trouvé');
            return res.status(404).json({
                success: false,
                error: 'Conseiller non trouvé'
            });
        }

        // Activation
        await CounselorModel.activate(counselorId);

        console.log('✅ [Counselors] Conseiller activé');

        return res.status(200).json({
            success: true,
            message: 'Conseiller activé avec succès'
        });

    } catch (error) {
        console.error('❌ [Counselors] Erreur lors de l\'activation:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'activation du conseiller'
        });
    }
};