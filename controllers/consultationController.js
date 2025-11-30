/**
 * =====================================================
 * Consultation Controller
 * =====================================================
 * Gère les demandes de consultation étudiant-conseiller
 *
 * @module controllers/consultationController
 * @version 2.0
 */
const ConsultationModel = require('../models/consultationModel');
const QuestionnaireModel = require('../models/questionnaireModel');
const RecommendationModel = require('../models/recommendationModel');
const CounselorModel = require('../models/counselorModel');
const UserModel = require('../models/userModel');
const whatsappService = require('../services/whatsappService');
const emailService = require('../services/emailService');
const validator = require('validator');
/**

 Crée une demande de consultation
 Route: POST /api/consultations/request
 Auth: client
 */
exports.requestConsultation = async (req, res) => {
    try {
        const studentId = req.user.id;
        const {
            questionnaireId,
            recommendationId,
            studentEmail,
            studentPhone,
            additionalComment
        } = req.body;
        console.log('📝 [Consultation] Nouvelle demande de:', studentId);

        // Validation des champs obligatoires
        if (!questionnaireId || !recommendationId || !studentPhone) {
            console.log('⚠️ [Consultation] Champs manquants');
            return res.status(400).json({
                success: false,
                error: 'questionnaireId, recommendationId et studentPhone sont obligatoires'
            });
        }

        // Validation format téléphone (international)
        if (!validator.isMobilePhone(studentPhone, 'any', {strictMode: false})) {
            console.log('⚠️ [Consultation] Numéro téléphone invalide');
            return res.status(400).json({
                success: false,
                error: 'Format de numéro de téléphone invalide (ex: +228 90 12 34 56)'
            });
        }

        // Validation email si fourni
        if (studentEmail && !validator.isEmail(studentEmail)) {
            console.log('⚠️ [Consultation] Email invalide');
            return res.status(400).json({
                success: false,
                error: "Format d'email invalide"
            });
        }

        // Vérifier que le questionnaire existe et appartient à l'utilisateur
        const questionnaire = await QuestionnaireModel.getById(questionnaireId);
        if (!questionnaire) {
            console.log('⚠️ [Consultation] Questionnaire non trouvé');
            return res.status(404).json({
                success: false,
                error: 'Questionnaire non trouvé'
            });
        }

        if (questionnaire.userId.toString() !== studentId.toString()) {
            console.log('⚠️ [Consultation] Questionnaire non autorisé');
            return res.status(403).json({
                success: false,
                error: 'Ce questionnaire ne vous appartient pas'
            });
        }

        // Vérifier que la recommandation existe et appartient à l'utilisateur
        const recommendation = await RecommendationModel.getById(recommendationId);
        if (!recommendation) {
            console.log('⚠️ [Consultation] Recommandation non trouvée');
            return res.status(404).json({
                success: false,
                error: 'Recommandation non trouvée'
            });
        }

        if (recommendation.userId.toString() !== studentId.toString()) {
            console.log('⚠️ [Consultation] Recommandation non autorisée');
            return res.status(403).json({
                success: false,
                error: 'Cette recommandation ne vous appartient pas'
            });
        }

        // Créer la demande de consultation
        const consultationData = {
            studentId,
            questionnaireId,
            recommendationId,
            studentEmail: studentEmail || null,
            studentPhone,
            additionalComment: additionalComment || null,
            status: 'pending',
            whatsappSent: false,
            emailSentToCounselor: false
        };

        const consultationId = await ConsultationModel.create(consultationData);
        console.log('✅ [Consultation] Demande créée, ID:', consultationId);

        // Récupérer les infos de l'étudiant pour le message WhatsApp
        const student = await UserModel.findById(studentId);
        const studentName = student.name || student.email.split('@')[0];

        // Envoi WhatsApp automatique
        let whatsappSent = false;
        if (whatsappService.isAvailable()) {
            try {
                await whatsappService.sendConsultationConfirmation({
                    studentPhone,
                    studentName
                });

                // Marquer comme envoyé
                await ConsultationModel.markWhatsappSent(consultationId);
                whatsappSent = true;

                console.log('✅ [Consultation] WhatsApp envoyé');
            } catch (whatsappError) {
                console.error('❌ [Consultation] Erreur envoi WhatsApp:', whatsappError.message);
                // On continue même si WhatsApp échoue
            }
        } else {
            console.warn('⚠️ [Consultation] Service WhatsApp non disponible');
        }

        // Récupérer la consultation créée
        const createdConsultation = await ConsultationModel.getById(consultationId);

        return res.status(201).json({
            success: true,
            message: 'Demande de consultation enregistrée avec succès',
            consultation: createdConsultation,
            whatsappSent
        });
    } catch (error) {
        console.error('❌ [Consultation] Erreur création:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la création de la demande de consultation'
        });
    }
};

/**

 Liste toutes les consultations (admin)
 Route: GET /api/consultations
 Auth: admin
 */
exports.getAllConsultations = async (req, res) => {
    try {
        const {status, counselorId} = req.query;
        console.log('🔎 [Consultation] Liste demandes (admin)');

        const filters = {};
        if (status) filters.status = status;
        if (counselorId) filters.counselorId = counselorId;

        const consultations = await ConsultationModel.getAll(filters);

        console.log(`✅ [Consultation] ${consultations.length} demande(s) trouvée(s)`);

        return res.status(200).json({
            success: true,
            consultations,
            count: consultations.length
        });
    } catch (error) {
        console.error('❌ [Consultation] Erreur récupération:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des consultations'
        });
    }
};

/**

 Récupère les détails d'une consultation (admin)
 Route: GET /api/consultations/:id
 Auth: admin
 */
exports.getConsultationById = async (req, res) => {
    try {
        const consultationId = req.params.id;
        console.log('🔎 [Consultation] Détails ID:', consultationId);

        const consultation = await ConsultationModel.getFullDetails(consultationId);

        if (!consultation) {
            console.log('⚠️ [Consultation] Non trouvée');
            return res.status(404).json({
                success: false,
                error: 'Consultation non trouvée'
            });
        }

        console.log('✅ [Consultation] Détails récupérés');

        return res.status(200).json({
            success: true,
            consultation
        });
    } catch (error) {
        console.error('❌ [Consultation] Erreur récupération détails:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération de la consultation'
        });
    }
};

/**

 Assigne un conseiller à une consultation (admin)
 Route: PUT /api/consultations/:id/assign
 Auth: admin
 */
exports.assignCounselor = async (req, res) => {
    try {
        const consultationId = req.params.id;
        const {counselorId} = req.body;
        console.log('👨‍🏫 [Consultation] Assignation conseiller:', counselorId, 'à consultation:', consultationId);

        // Validation
        if (!counselorId) {
            console.log('⚠️ [Consultation] counselorId manquant');
            return res.status(400).json({
                success: false,
                error: 'counselorId est obligatoire'
            });
        }

        // Vérifier que la consultation existe
        const consultation = await ConsultationModel.getById(consultationId);
        if (!consultation) {
            console.log('⚠️ [Consultation] Consultation non trouvée');
            return res.status(404).json({
                success: false,
                error: 'Consultation non trouvée'
            });
        }

        // Vérifier que le conseiller existe et est actif
        const counselor = await CounselorModel.getById(counselorId);
        if (!counselor) {
            console.log('⚠️ [Consultation] Conseiller non trouvé');
            return res.status(404).json({
                success: false,
                error: 'Conseiller non trouvé'
            });
        }

        if (!counselor.isActive) {
            console.log('⚠️ [Consultation] Conseiller inactif');
            return res.status(400).json({
                success: false,
                error: 'Ce conseiller est actuellement inactif'
            });
        }

        // Assigner le conseiller
        await ConsultationModel.assignCounselor(consultationId, counselorId);
        console.log('✅ [Consultation] Conseiller assigné');

        // Récupérer les détails complets pour l'email
        const fullDetails = await ConsultationModel.getFullDetailsForEmail(consultationId);

        // Envoi email au conseiller
        let emailSent = false;
        if (emailService.isAvailable()) {
            try {
                await emailService.sendCounselorAssignment(fullDetails);

                // Marquer comme envoyé
                await ConsultationModel.markEmailSent(consultationId);
                emailSent = true;

                console.log('✅ [Consultation] Email envoyé au conseiller');
            } catch (emailError) {
                console.error('❌ [Consultation] Erreur envoi email:', emailError.message);
                // On continue même si l'email échoue
            }
        } else {
            console.warn('⚠️ [Consultation] Service email non disponible');
        }

        // Récupérer la consultation mise à jour
        const updatedConsultation = await ConsultationModel.getById(consultationId);

        return res.status(200).json({
            success: true,
            message: 'Conseiller assigné avec succès',
            consultation: updatedConsultation,
            emailSent
        });
    } catch (error) {
        console.error('❌ [Consultation] Erreur assignation:', error);
        return res.status(500).json({
            success: false,
            error: "Erreur lors de l'assignation du conseiller"
        });
    }
};

/**

 Récupère l'historique des consultations d'un utilisateur
 Route: GET /api/consultations/user/:userId
 Auth: admin ou user lui-même
 */
exports.getUserConsultations = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const authenticatedUserId = req.user.id;
        const userPermissions = req.user.permissions;
        console.log('🔎 [Consultation] Historique pour user:', targetUserId);

        // Vérification des permissions
        if (userPermissions !== 'admin' && authenticatedUserId.toString() !== targetUserId) {
            console.log('⛔ [Consultation] Accès refusé');
            return res.status(403).json({
                success: false,
                error: 'Accès refusé - Vous ne pouvez consulter que vos propres demandes'
            });
        }

        const consultations = await ConsultationModel.getByStudentId(targetUserId);

        console.log(`✅ [Consultation] ${consultations.length} consultation(s) trouvée(s)`);

        return res.status(200).json({
            success: true,
            consultations,
            count: consultations.length
        });
    } catch (error) {
        console.error('❌ [Consultation] Erreur récupération historique:', error);
        return res.status(500).json({
            success: false,
            error: "Erreur lors de la récupération de l'historique"
        });
    }
};

/**

 Met à jour le statut d'une consultation (admin)
 Route: PATCH /api/consultations/:id/status
 Auth: admin
 */
exports.updateStatus = async (req, res) => {
    try {
        const consultationId = req.params.id;
        const {status} = req.body;
        console.log('🔄 [Consultation] Mise à jour statut:', status);

        // Validation
        const validStatuses = ['pending', 'assigned', 'completed', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            console.log('⚠️ [Consultation] Statut invalide');
            return res.status(400).json({
                success: false,
                error: `Statut invalide. Valeurs acceptées: ${validStatuses.join(', ')}`
            });
        }

        // Vérifier que la consultation existe
        const consultation = await ConsultationModel.getById(consultationId);
        if (!consultation) {
            console.log('⚠️ [Consultation] Consultation non trouvée');
            return res.status(404).json({
                success: false,
                error: 'Consultation non trouvée'
            });
        }

        // Mettre à jour le statut
        await ConsultationModel.updateStatus(consultationId, status);
        console.log('✅ [Consultation] Statut mis à jour');

        // Récupérer la consultation mise à jour
        const updatedConsultation = await ConsultationModel.getById(consultationId);

        return res.status(200).json({
            success: true,
            message: 'Statut mis à jour avec succès',
            consultation: updatedConsultation
        });
    } catch (error) {
        console.error('❌ [Consultation] Erreur mise à jour statut:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la mise à jour du statut'
        });
    }
};

/**

 Récupère les statistiques des consultations (admin)
 Route: GET /api/consultations/stats
 Auth: admin
 */
exports.getStats = async (req, res) => {
    try {
        console.log('📊 [Consultation] Récupération statistiques');
        const stats = await ConsultationModel.countByStatus();

        console.log('✅ [Consultation] Statistiques récupérées');

        return res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('❌ [Consultation] Erreur récupération stats:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des statistiques'
        });
    }
};