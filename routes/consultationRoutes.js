/**
 * =====================================================
 * Consultation Routes
 * =====================================================
 * Routes API pour les demandes de consultation
 *
 * @module routes/consultationRoutes
 * @version 2.1
 */
const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const authMiddleware = require('../middlewares/authMiddleware');
const requirePermissions = require('../middlewares/requirePermissionsMiddleware');

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

/**
 * @swagger
 * /api/consultations/request:
 *   post:
 *     summary: Créer une demande de consultation
 *     description: |
 *       Permet à un étudiant de demander une consultation avec un conseiller.
 *       Déclenche l'envoi automatique d'un WhatsApp de confirmation.
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionnaireId
 *               - recommendationId
 *               - studentPhone
 *             properties:
 *               questionnaireId:
 *                 type: string
 *                 description: ID du questionnaire
 *               recommendationId:
 *                 type: string
 *                 description: ID de la recommandation
 *               studentEmail:
 *                 type: string
 *                 format: email
 *                 description: Email de l'étudiant (optionnel)
 *               studentPhone:
 *                 type: string
 *                 description: Téléphone (format international)
 *                 example: "+228 90 12 34 56"
 *               additionalComment:
 *                 type: string
 *                 description: Commentaire additionnel (optionnel)
 *     responses:
 *       201:
 *         description: Demande créée avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.post('/request', consultationController.requestConsultation);

/**
 * @swagger
 * /api/consultations:
 *   get:
 *     summary: Liste toutes les consultations (Admin)
 *     description: |
 *       Retourne la liste des demandes de consultation avec filtres optionnels.
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, assigned, completed, cancelled]
 *         description: Filtrer par statut
 *       - in: query
 *         name: counselorId
 *         schema:
 *           type: string
 *         description: Filtrer par conseiller
 *     responses:
 *       200:
 *         description: Liste récupérée avec succès
 *       403:
 *         description: Accès refusé - Admin requis
 *       500:
 *         description: Erreur serveur
 */
router.get('/', requirePermissions('admin'), consultationController.getAllConsultations);

/**
 * @swagger
 * /api/consultations/stats:
 *   get:
 *     summary: Statistiques des consultations (Admin)
 *     description: Retourne le nombre de consultations par statut
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.get('/stats', requirePermissions('admin'), consultationController.getStats);

/**
 * @swagger
 * /api/consultations/user/{userId}:
 *   get:
 *     summary: Historique des consultations d'un utilisateur
 *     description: |
 *       Retourne l'historique des consultations.
 *       Accessible par l'admin ou l'utilisateur lui-même.
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Historique récupéré
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/user/:userId', consultationController.getUserConsultations);

/**
 * @swagger
 * /api/consultations/{id}:
 *   get:
 *     summary: Détails d'une consultation (Admin)
 *     description: Retourne les détails complets d'une consultation
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la consultation
 *     responses:
 *       200:
 *         description: Détails récupérés
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Consultation non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', requirePermissions('admin'), consultationController.getConsultationById);

/**
 * @swagger
 * /api/consultations/{id}/assign:
 *   put:
 *     summary: Assigner un conseiller (Admin)
 *     description: |
 *       Assigne un conseiller à une consultation et déclenche l'envoi
 *       automatique d'un email au conseiller avec le profil complet.
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la consultation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - counselorId
 *             properties:
 *               counselorId:
 *                 type: string
 *                 description: ID du conseiller à assigner
 *     responses:
 *       200:
 *         description: Conseiller assigné avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Consultation ou conseiller non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id/assign', requirePermissions('admin'), consultationController.assignCounselor);

/**
 * @swagger
 * /api/consultations/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut (Admin)
 *     description: Change le statut d'une consultation
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la consultation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, assigned, completed, cancelled]
 *                 description: Nouveau statut
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       400:
 *         description: Statut invalide
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Consultation non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id/status', requirePermissions('admin'), consultationController.updateStatus);

module.exports = router;