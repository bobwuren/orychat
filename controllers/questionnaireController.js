/**
 * =====================================================
 * Questionnaire Controller
 * =====================================================
 * Gère les requêtes HTTP liées au questionnaire d'orientation
 *
 * @module controllers/questionnaireController
 * @version 2.0
 */

const QuestionnaireModel = require('../models/questionnaireModel');


/**
 * Valeurs autorisées pour les questions QCM
 */
const VALID_QCM_VALUES = {
    visionProfessionnelle: [
        "Entrepreneur(e) / Créateur(trice) d'entreprise",
        "Salarié(e) dans une grande entreprise",
        "Freelance / Consultant(e) indépendant(e)",
        "Chercheur(se) / Enseignant(e)",
        "Je ne sais pas encore"
    ],
    styleApprentissage: [
        "La pratique (projets, stages, travaux pratiques)",
        "La théorie (cours magistraux, lectures, recherche)",
        "Un équilibre entre théorie et pratique"
    ],
    domaineNumerique: [
        "Créer des sites web et applications",
        "Analyser des données et faire de l'IA",
        "Gérer les réseaux sociaux et le marketing digital",
        "Résoudre des problèmes techniques (cybersécurité, réseaux)",
        "Design graphique et création de contenu",
        "Autre / Je ne sais pas"
    ],
    prioriteFormation: [
        "Durée courte de formation",
        "Coût accessible",
        "Prestige et réputation de l'école",
        "Garantie de débouchés professionnels",
        "Flexibilité (cours en ligne, horaires adaptés)"
    ],
    modeTravail: [
        "Seul(e) sur tes projets",
        "En équipe / collaboration",
        "Ça dépend du contexte"
    ]
};

/**

 Valide les réponses QCM

 @param {Object} qcmFields - Champs QCM à valider
 @returns {Object} { valid: boolean, errors: Array }
 */
function validateQCMFields(qcmFields) {
    const errors = [];
    for (const [field, value] of Object.entries(qcmFields)) {
// Si le champ est fourni et non vide
        if (value && value.trim()) {
            const validValues = VALID_QCM_VALUES[field];
            if (validValues && !validValues.includes(value)) {
                errors.push({
                    field,
                    message: `Valeur invalide pour ${field}. Valeurs acceptées: ${validValues.join(', ')}`
                });
            }
        }
    }
    return {
        valid: errors.length === 0,
        errors
    };
}

/**

 Soumet un nouveau questionnaire d'orientation
 [MISE À JOUR avec validation ENUM]
 */
exports.submitQuestionnaire = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            serieId,
            visionProfessionnelle,
            styleApprentissage,
            domaineNumerique,
            prioriteFormation,
            modeTravail,
            matieresPreferees,
            passionsExtraScolaires,
            messageLibre
        } = req.body;
        console.log('📝 [Questionnaire] Soumission pour userId:', userId);

        // Validation des champs obligatoires
        if (!serieId) {
            console.log('⚠️ [Questionnaire] serieId manquant');
            return res.status(400).json({
                success: false,
                error: 'Le champ serieId est obligatoire'
            });
        }

        // Validation des réponses QCM
        const qcmValidation = validateQCMFields({
            visionProfessionnelle,
            styleApprentissage,
            domaineNumerique,
            prioriteFormation,
            modeTravail
        });

        if (!qcmValidation.valid) {
            console.log('⚠️ [Questionnaire] Validation QCM échouée:', qcmValidation.errors);
            return res.status(400).json({
                success: false,
                error: 'Valeurs QCM invalides',
                details: qcmValidation.errors
            });
        }

        // Validation des réponses ouvertes (longueur max)
        if (matieresPreferees && matieresPreferees.length > 2000) {
            console.log('⚠️ [Questionnaire] matieresPreferees trop long');
            return res.status(400).json({
                success: false,
                error: 'Le champ matieresPreferees ne doit pas dépasser 2000 caractères'
            });
        }

        if (passionsExtraScolaires && passionsExtraScolaires.length > 2000) {
            console.log('⚠️ [Questionnaire] passionsExtraScolaires trop long');
            return res.status(400).json({
                success: false,
                error: 'Le champ passionsExtraScolaires ne doit pas dépasser 2000 caractères'
            });
        }

        if (messageLibre && messageLibre.length > 2000) {
            console.log('⚠️ [Questionnaire] messageLibre trop long');
            return res.status(400).json({
                success: false,
                error: 'Le champ messageLibre ne doit pas dépasser 2000 caractères'
            });
        }

        // Sauvegarde du questionnaire
        const questionnaireData = {
            userId,
            serieId,
            visionProfessionnelle: visionProfessionnelle || null,
            styleApprentissage: styleApprentissage || null,
            domaineNumerique: domaineNumerique || null,
            prioriteFormation: prioriteFormation || null,
            modeTravail: modeTravail || null,
            matieresPreferees: matieresPreferees || null,
            passionsExtraScolaires: passionsExtraScolaires || null,
            messageLibre: messageLibre || null
        };

        const questionnaireId = await QuestionnaireModel.save(questionnaireData);

        console.log('✅ [Questionnaire] Sauvegardé avec succès, ID:', questionnaireId);

        return res.status(201).json({
            success: true,
            message: 'Questionnaire soumis avec succès',
            questionnaireId: questionnaireId
        });
    } catch (error) {
        console.error('❌ [Questionnaire] Erreur lors de la soumission:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la soumission du questionnaire'
        });
    }
};

/**
 * Soumet un nouveau questionnaire d'orientation
 *
 * Route: POST /api/questionnaire/submit
 * Auth: Requise (Bearer token - client)
 *
 * @param {Object} req - Requête Express
 * @param {Object} req.user - Utilisateur authentifié (via middleware)
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.serieId - ID de la série choisie
 * @param {string} req.body.visionProfessionnelle - Vision professionnelle (QCM)
 * @param {string} req.body.styleApprentissage - Style d'apprentissage (QCM)
 * @param {string} req.body.domaineNumerique - Domaine numérique (QCM)
 * @param {string} req.body.prioriteFormation - Priorité formation (QCM)
 * @param {string} req.body.modeTravail - Mode de travail (QCM)
 * @param {string} req.body.matieresPreferees - Matières préférées (ouvert)
 * @param {string} req.body.passionsExtraScolaires - Passions (ouvert)
 * @param {string} req.body.messageLibre - Message libre (optionnel)
 * @param {Object} res - Réponse Express
 * @returns {Promise<void>}
 */
exports.submitQuestionnaire = async (req, res) => {
    try {
        const userId = req.user.id; // ID de l'utilisateur authentifié
        const {
            serieId,
            visionProfessionnelle,
            styleApprentissage,
            domaineNumerique,
            prioriteFormation,
            modeTravail,
            matieresPreferees,
            passionsExtraScolaires,
            messageLibre
        } = req.body;

        console.log('📝 [Questionnaire] Soumission pour userId:', userId);

        // Validation des champs obligatoires
        if (!serieId) {
            console.log('⚠️ [Questionnaire] serieId manquant');
            return res.status(400).json({
                success: false,
                error: 'Le champ serieId est obligatoire'
            });
        }

        // Validation des réponses QCM (optionnelles mais recommandées)
        const qcmFields = {
            visionProfessionnelle,
            styleApprentissage,
            domaineNumerique,
            prioriteFormation,
            modeTravail
        };

        // Validation des réponses ouvertes (optionnelles)
        if (matieresPreferees && matieresPreferees.length > 2000) {
            console.log('⚠️ [Questionnaire] matieresPreferees trop long');
            return res.status(400).json({
                success: false,
                error: 'Le champ matieresPreferees ne doit pas dépasser 2000 caractères'
            });
        }

        if (passionsExtraScolaires && passionsExtraScolaires.length > 2000) {
            console.log('⚠️ [Questionnaire] passionsExtraScolaires trop long');
            return res.status(400).json({
                success: false,
                error: 'Le champ passionsExtraScolaires ne doit pas dépasser 2000 caractères'
            });
        }

        if (messageLibre && messageLibre.length > 2000) {
            console.log('⚠️ [Questionnaire] messageLibre trop long');
            return res.status(400).json({
                success: false,
                error: 'Le champ messageLibre ne doit pas dépasser 2000 caractères'
            });
        }

        // Sauvegarde du questionnaire
        const questionnaireData = {
            userId,
            serieId,
            visionProfessionnelle: visionProfessionnelle || null,
            styleApprentissage: styleApprentissage || null,
            domaineNumerique: domaineNumerique || null,
            prioriteFormation: prioriteFormation || null,
            modeTravail: modeTravail || null,
            matieresPreferees: matieresPreferees || null,
            passionsExtraScolaires: passionsExtraScolaires || null,
            messageLibre: messageLibre || null
        };

        const questionnaireId = await QuestionnaireModel.save(questionnaireData);

        console.log('✅ [Questionnaire] Sauvegardé avec succès, ID:', questionnaireId);

        return res.status(201).json({
            success: true,
            message: 'Questionnaire soumis avec succès',
            questionnaireId: questionnaireId
        });

    } catch (error) {
        console.error('❌ [Questionnaire] Erreur lors de la soumission:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la soumission du questionnaire'
        });
    }
};

/**
 * Récupère les réponses au questionnaire d'un utilisateur
 *
 * Route: GET /api/questionnaire/user/:userId
 * Auth: Requise (Bearer token - admin ou user lui-même)
 *
 * @param {Object} req - Requête Express
 * @param {Object} req.user - Utilisateur authentifié
 * @param {string} req.params.userId - ID de l'utilisateur cible
 * @param {Object} res - Réponse Express
 * @returns {Promise<void>}
 */
exports.getUserQuestionnaires = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const authenticatedUserId = req.user.id;
        const userPermissions = req.user.permissions;

        console.log('🔎 [Questionnaire] Récupération pour userId:', targetUserId);

        // Vérification des permissions
        // Seul l'admin ou l'utilisateur lui-même peut voir ses questionnaires
        if (userPermissions !== 'admin' && authenticatedUserId.toString() !== targetUserId) {
            console.log('⛔ [Questionnaire] Accès refusé');
            return res.status(403).json({
                success: false,
                error: 'Accès refusé - Vous ne pouvez consulter que vos propres questionnaires'
            });
        }

        // Récupération des questionnaires
        const questionnaires = await QuestionnaireModel.getByUserId(targetUserId);

        console.log(`✅ [Questionnaire] ${questionnaires.length} questionnaire(s) trouvé(s)`);

        return res.status(200).json({
            success: true,
            questionnaires: questionnaires,
            count: questionnaires.length
        });

    } catch (error) {
        console.error('❌ [Questionnaire] Erreur lors de la récupération:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des questionnaires'
        });
    }
};

/**
 * Récupère le dernier questionnaire d'un utilisateur
 *
 * Route: GET /api/questionnaire/user/:userId/latest
 * Auth: Requise (Bearer token - admin ou user lui-même)
 *
 * @param {Object} req - Requête Express
 * @param {Object} req.user - Utilisateur authentifié
 * @param {string} req.params.userId - ID de l'utilisateur cible
 * @param {Object} res - Réponse Express
 * @returns {Promise<void>}
 */
exports.getLatestQuestionnaire = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const authenticatedUserId = req.user.id;
        const userPermissions = req.user.permissions;

        console.log('🔎 [Questionnaire] Récupération du dernier questionnaire pour userId:', targetUserId);

        // Vérification des permissions
        if (userPermissions !== 'admin' && authenticatedUserId.toString() !== targetUserId) {
            console.log('⛔ [Questionnaire] Accès refusé');
            return res.status(403).json({
                success: false,
                error: 'Accès refusé'
            });
        }

        // Récupération du dernier questionnaire
        const questionnaire = await QuestionnaireModel.getLatestByUserId(targetUserId);

        if (!questionnaire) {
            console.log('⚠️ [Questionnaire] Aucun questionnaire trouvé');
            return res.status(404).json({
                success: false,
                error: 'Aucun questionnaire trouvé pour cet utilisateur'
            });
        }

        console.log('✅ [Questionnaire] Questionnaire trouvé, ID:', questionnaire.id);

        return res.status(200).json({
            success: true,
            questionnaire: questionnaire
        });

    } catch (error) {
        console.error('❌ [Questionnaire] Erreur lors de la récupération:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération du questionnaire'
        });
    }
};

/**
 * Récupère un questionnaire par son ID
 *
 * Route: GET /api/questionnaire/:id
 * Auth: Requise (Bearer token - admin ou propriétaire)
 *
 * @param {Object} req - Requête Express
 * @param {Object} req.user - Utilisateur authentifié
 * @param {string} req.params.id - ID du questionnaire
 * @param {Object} res - Réponse Express
 * @returns {Promise<void>}
 */
exports.getQuestionnaireById = async (req, res) => {
    try {
        const questionnaireId = req.params.id;
        const authenticatedUserId = req.user.id;
        const userPermissions = req.user.permissions;

        console.log('🔎 [Questionnaire] Récupération questionnaire ID:', questionnaireId);

        // Récupération du questionnaire
        const questionnaire = await QuestionnaireModel.getById(questionnaireId);

        if (!questionnaire) {
            console.log('⚠️ [Questionnaire] Questionnaire non trouvé');
            return res.status(404).json({
                success: false,
                error: 'Questionnaire non trouvé'
            });
        }

        // Vérification des permissions
        if (userPermissions !== 'admin' && questionnaire.userId.toString() !== authenticatedUserId.toString()) {
            console.log('⛔ [Questionnaire] Accès refusé');
            return res.status(403).json({
                success: false,
                error: 'Accès refusé'
            });
        }

        console.log('✅ [Questionnaire] Questionnaire trouvé');

        return res.status(200).json({
            success: true,
            questionnaire: questionnaire
        });

    } catch (error) {
        console.error('❌ [Questionnaire] Erreur lors de la récupération:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération du questionnaire'
        });
    }
};

/**
 * Récupère tous les questionnaires (Admin uniquement)
 *
 * Route: GET /api/questionnaire/all
 * Auth: Requise (Bearer token - admin uniquement)
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Promise<void>}
 */
exports.getAllQuestionnaires = async (req, res) => {
    try {
        console.log('🔎 [Questionnaire] Récupération de tous les questionnaires (admin)');

        const questionnaires = await QuestionnaireModel.getAll();

        console.log(`✅ [Questionnaire] ${questionnaires.length} questionnaire(s) trouvé(s)`);

        return res.status(200).json({
            success: true,
            questionnaires: questionnaires,
            count: questionnaires.length
        });

    } catch (error) {
        console.error('❌ [Questionnaire] Erreur lors de la récupération:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des questionnaires'
        });
    }
};

/**
 * Supprime un questionnaire (Admin uniquement)
 *
 * Route: DELETE /api/questionnaire/:id
 * Auth: Requise (Bearer token - admin uniquement)
 *
 * @param {Object} req - Requête Express
 * @param {string} req.params.id - ID du questionnaire
 * @param {Object} res - Réponse Express
 * @returns {Promise<void>}
 */
exports.deleteQuestionnaire = async (req, res) => {
    try {
        const questionnaireId = req.params.id;

        console.log('🗑️ [Questionnaire] Suppression questionnaire ID:', questionnaireId);

        // Vérifier que le questionnaire existe
        const questionnaire = await QuestionnaireModel.getById(questionnaireId);
        if (!questionnaire) {
            console.log('⚠️ [Questionnaire] Questionnaire non trouvé');
            return res.status(404).json({
                success: false,
                error: 'Questionnaire non trouvé'
            });
        }

        // Suppression
        const deleted = await QuestionnaireModel.delete(questionnaireId);

        if (!deleted) {
            console.log('❌ [Questionnaire] Échec de la suppression');
            return res.status(500).json({
                success: false,
                error: 'Échec de la suppression'
            });
        }

        console.log('✅ [Questionnaire] Questionnaire supprimé');

        return res.status(200).json({
            success: true,
            message: 'Questionnaire supprimé avec succès'
        });

    } catch (error) {
        console.error('❌ [Questionnaire] Erreur lors de la suppression:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression du questionnaire'
        });
    }
};