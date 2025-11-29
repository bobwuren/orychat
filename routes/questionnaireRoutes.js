/**
 * =====================================================
 * Questionnaire Routes
 * =====================================================
 * Définit les routes API pour le questionnaire d'orientation
 *
 * @module routes/questionnaireRoutes
 * @version 2.0
 */

const express = require('express');
const router = express.Router();
const questionnaireController = require('../controllers/questionnaireController');
const authMiddleware = require('../middlewares/authMiddleware');
const requirePermissions = require('../middlewares/requirePermissionsMiddleware');

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

/**
 * @swagger
 * /api/questionnaire/submit:
 *   post:
 *     summary: Soumettre un questionnaire d'orientation
 *     description: |
 *       Permet à un étudiant de soumettre ses réponses au questionnaire d'orientation.
 *       Le questionnaire comprend 5 questions QCM et 3 questions ouvertes pour mieux
 *       cerner le profil et les aspirations de l'étudiant.
 *     tags: [Questionnaire]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serieId
 *             properties:
 *               serieId:
 *                 type: string
 *                 description: ID de la série choisie par l'étudiant
 *                 example: "1"
 *               visionProfessionnelle:
 *                 type: string
 *                 description: Vision professionnelle dans 5-10 ans
 *                 example: "Entrepreneur(e)"
 *               styleApprentissage:
 *                 type: string
 *                 description: Style d'apprentissage préféré
 *                 example: "Pratique"
 *               domaineNumerique:
 *                 type: string
 *                 description: Domaine numérique d'intérêt
 *                 example: "Créer des applications"
 *               prioriteFormation:
 *                 type: string
 *                 description: Priorité principale dans le choix de formation
 *                 example: "Débouchés garantis"
 *               modeTravail:
 *                 type: string
 *                 description: Mode de travail préféré
 *                 example: "En équipe"
 *               matieresPreferees:
 *                 type: string
 *                 description: Matières préférées et forces (max 2000 caractères)
 *                 example: "J'aime les mathématiques car je trouve ça logique..."
 *               passionsExtraScolaires:
 *                 type: string
 *                 description: Passions et activités extra-scolaires (max 2000 caractères)
 *                 example: "Je fais de la programmation dans mon temps libre..."
 *               messageLibre:
 *                 type: string
 *                 description: Message libre optionnel (max 2000 caractères)
 *                 example: "Je veux créer ma propre startup dans 5 ans"
 *     responses:
 *       201:
 *         description: Questionnaire soumis avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Questionnaire soumis avec succès"
 *                 questionnaireId:
 *                   type: string
 *                   example: "123"
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post('/submit', questionnaireController.submitQuestionnaire);

/**
 * @swagger
 * /api/questionnaire/user/{userId}:
 *   get:
 *     summary: Récupérer tous les questionnaires d'un utilisateur
 *     description: |
 *       Retourne la liste de tous les questionnaires soumis par un utilisateur.
 *       Accessible uniquement par l'admin ou l'utilisateur lui-même.
 *     tags: [Questionnaire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *         example: "45"
 *     responses:
 *       200:
 *         description: Questionnaires récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 questionnaires:
 *                   type: array
 *                   items:
 *                     type: object
 *                 count:
 *                   type: integer
 *                   example: 2
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Aucun questionnaire trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/user/:userId', questionnaireController.getUserQuestionnaires);

/**
 * @swagger
 * /api/questionnaire/user/{userId}/latest:
 *   get:
 *     summary: Récupérer le dernier questionnaire d'un utilisateur
 *     description: |
 *       Retourne le questionnaire le plus récent soumis par un utilisateur.
 *       Accessible uniquement par l'admin ou l'utilisateur lui-même.
 *     tags: [Questionnaire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *         example: "45"
 *     responses:
 *       200:
 *         description: Questionnaire récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 questionnaire:
 *                   type: object
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Aucun questionnaire trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/user/:userId/latest', questionnaireController.getLatestQuestionnaire);

/**
 * @swagger
 * /api/questionnaire/{id}:
 *   get:
 *     summary: Récupérer un questionnaire par son ID
 *     description: |
 *       Retourne un questionnaire spécifique.
 *       Accessible par l'admin ou le propriétaire du questionnaire.
 *     tags: [Questionnaire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du questionnaire
 *         example: "123"
 *     responses:
 *       200:
 *         description: Questionnaire récupéré avec succès
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Questionnaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', questionnaireController.getQuestionnaireById);

/**
 * @swagger
 * /api/questionnaire/all:
 *   get:
 *     summary: Récupérer tous les questionnaires (Admin uniquement)
 *     description: |
 *       Retourne la liste complète de tous les questionnaires soumis.
 *       Accessible uniquement par les administrateurs.
 *     tags: [Questionnaire]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Questionnaires récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 questionnaires:
 *                   type: array
 *                   items:
 *                     type: object
 *                 count:
 *                   type: integer
 *                   example: 150
 *       403:
 *         description: Accès refusé - Admin requis
 *       500:
 *         description: Erreur serveur
 */
router.get('/all', requirePermissions('admin'), questionnaireController.getAllQuestionnaires);

/**
 * @swagger
 * /api/questionnaire/{id}:
 *   delete:
 *     summary: Supprimer un questionnaire (Admin uniquement)
 *     description: |
 *       Supprime définitivement un questionnaire du système.
 *       Accessible uniquement par les administrateurs.
 *     tags: [Questionnaire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du questionnaire à supprimer
 *         example: "123"
 *     responses:
 *       200:
 *         description: Questionnaire supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Questionnaire supprimé avec succès"
 *       403:
 *         description: Accès refusé - Admin requis
 *       404:
 *         description: Questionnaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', requirePermissions('admin'), questionnaireController.deleteQuestionnaire);

module.exports = router;