const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const requirePermissions = require('../middlewares/requirePermissionsMiddleware');
const recommendationController = require('../controllers/recommendationController');

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

/**
 * @swagger
 * /api/recommendations/save:
 *   post:
 *     summary: Sauvegarder une recommandation manuelle
 *     description: Permet à l'utilisateur connecté de sauvegarder une recommandation personnalisée pour une série donnée.
 *     tags: [Recommendations]
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
 *               - orientations
 *               - noteIds
 *             properties:
 *               serieId:
 *                 type: string
 *                 description: ID de la série
 *               orientations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     why:
 *                       type: string
 *                     degrees:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           articleLink:
 *                             type: string
 *                     universities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           site:
 *                             type: string
 *                 description: Liste des orientations
 *               noteIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des IDs des notes utilisées
 *     responses:
 *       201:
 *         description: Recommandation sauvegardée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recommendation saved successfully"
 *                 id:
 *                   type: string
 *                   example: "rec_123456"
 *       400:
 *         description: Données invalides ou manquantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input data. Please provide serieId, orientations, and noteIds."
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token d'authentification manquant ou invalide"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while saving the recommendation: ..."
 */
router.post('/save', recommendationController.saveRecommendation);

/**
 * @swagger
 * /api/recommendations/all:
 *   get:
 *     summary: Récupérer toutes les recommandations (Admin uniquement)
 *     description: Retourne la liste complète de toutes les recommandations présentes dans le système. Cette route est réservée aux administrateurs.
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les recommandations récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID unique de la recommandation
 *                       userId:
 *                         type: string
 *                         description: ID de l'utilisateur propriétaire
 *                       serieId:
 *                         type: string
 *                         description: ID de la série associée
 *                       orientations:
 *                         type: array
 *                         description: Liste des orientations recommandées
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               description: Nom de l'orientation
 *                             why:
 *                               type: string
 *                               description: Justification de cette orientation
 *                             degrees:
 *                               type: array
 *                               description: Diplômes associés
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                   articleLink:
 *                                     type: string
 *                             universities:
 *                               type: array
 *                               description: Universités recommandées
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                   site:
 *                                     type: string
 *                       noteIds:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: IDs des notes utilisées pour la recommandation
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date de création de la recommandation
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token d'authentification manquant ou invalide"
 *       403:
 *         description: Accès refusé - rôle administrateur requis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Accès refusé. Rôle administrateur requis."
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while fetching all recommendations"
 */
router.get('/all', requirePermissions('admin'), recommendationController.getAllRecommendations);

/**
 * @swagger
 * /api/recommendations/export:
 *   get:
 *     summary: Exporter toutes les recommandations (CSV ou JSON)
 *     description: Exporte toutes les recommandations au format CSV ou JSON selon le paramètre 'format'.
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, json]
 *         description: Format d'export (csv ou json)
 *     responses:
 *       200:
 *         description: Export des recommandations
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recommendation'
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token d'authentification manquant ou invalide"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get('/export', requirePermissions('admin'), recommendationController.exportRecommendations);

/**
 * @swagger
 * /api/recommendations:
 *   get:
 *     summary: Récupérer l'historique des recommandations de l'utilisateur connecté
 *     description: Retourne toutes les recommandations générées ou sauvegardées par l'utilisateur connecté.
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historique des recommandations récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       serieId:
 *                         type: string
 *                       serieCode:
 *                         type: string
 *                         description: Code de la série
 *                       orientations:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             why:
 *                               type: string
 *                             degrees:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                   articleLink:
 *                                     type: string
 *                             universities:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                   site:
 *                                     type: string
 *                       noteIds:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token d'authentification manquant ou invalide"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while fetching recommendations: ..."
 */
router.get('/', recommendationController.getUserRecommendations);

/**
 * @swagger
 * /api/recommendations/{id}:
 *   get:
 *     summary: Récupérer une recommandation par son ID
 *     description: Retourne une recommandation précise selon son identifiant unique.
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la recommandation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recommandation récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recommendation'
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token d'authentification manquant ou invalide"
 *       404:
 *         description: Recommandation non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Recommendation non trouvée"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error getting recommendation by Id: ..."
 */
router.get('/:id', requirePermissions('admin'), recommendationController.getRecommendationById);

/**
 * @swagger
 * /api/recommendations/generate:
 *   post:
 *     summary: Génère une recommandation d'orientation numérique personnalisée pour l'utilisateur connecté
 *     description: Utilise l'IA pour générer une recommandation d'orientation à partir des notes et de la série de l'utilisateur connecté. Retourne un objet contenant l'id, userId, serieId, orientations (tableau de métiers/filières numériques), noteIds et createdAt.
 *     tags:
 *       - Recommendations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serieId:
 *                 type: string
 *                 description: ID de la série de l'utilisateur
 *               notes:
 *                 type: array
 *                 description: Liste des notes de l'utilisateur
 *                 items:
 *                   type: object
 *                   properties:
 *                     subjectId:
 *                       type: string
 *                     value:
 *                       type: number
 *     responses:
 *       200:
 *         description: Recommandation générée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 recommendation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     serieId:
 *                       type: string
 *                     orientations:
 *                       type: array
 *                       description: Liste des recommandations IA (filières numériques)
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           why:
 *                             type: string
 *                           degrees:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                 articleLink:
 *                                   type: string
 *                           universities:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                 site:
 *                                   type: string
 *                     noteIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input data. Please provide serieId and notes."
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token d'authentification manquant ou invalide"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while generating the recommendation: ..."
 */
router.post('/generate', recommendationController.generateRecommendation);

module.exports = router;