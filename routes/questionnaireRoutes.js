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
 * tags:
 *   name: Questionnaire
 *   description: Gestion du questionnaire d'orientation des étudiants
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     QuestionnaireSubmit:
 *       type: object
 *       required:
 *         - serieId
 *       properties:
 *         serieId:
 *           type: string
 *           description: ID de la série choisie par l'étudiant
 *           example: "1"
 *         visionProfessionnelle:
 *           type: string
 *           enum:
 *             - "Entrepreneur(e) / Créateur(trice) d'entreprise"
 *             - "Salarié(e) dans une grande entreprise"
 *             - "Freelance / Consultant(e) indépendant(e)"
 *             - "Chercheur(se) / Enseignant(e)"
 *             - "Je ne sais pas encore"
 *           description: Vision professionnelle dans 5-10 ans
 *           example: "Entrepreneur(e) / Créateur(trice) d'entreprise"
 *         styleApprentissage:
 *           type: string
 *           enum:
 *             - "La pratique (projets, stages, travaux pratiques)"
 *             - "La théorie (cours magistraux, lectures, recherche)"
 *             - "Un équilibre entre théorie et pratique"
 *           description: Style d'apprentissage préféré
 *           example: "La pratique (projets, stages, travaux pratiques)"
 *         domaineNumerique:
 *           type: string
 *           enum:
 *             - "Créer des sites web et applications"
 *             - "Analyser des données et faire de l'IA"
 *             - "Gérer les réseaux sociaux et le marketing digital"
 *             - "Résoudre des problèmes techniques (cybersécurité, réseaux)"
 *             - "Design graphique et création de contenu"
 *             - "Autre / Je ne sais pas"
 *           description: Domaine numérique d'intérêt
 *           example: "Créer des sites web et applications"
 *         prioriteFormation:
 *           type: string
 *           enum:
 *             - "Durée courte de formation"
 *             - "Coût accessible"
 *             - "Prestige et réputation de l'école"
 *             - "Garantie de débouchés professionnels"
 *             - "Flexibilité (cours en ligne, horaires adaptés)"
 *           description: Priorité principale dans le choix de formation
 *           example: "Garantie de débouchés professionnels"
 *         modeTravail:
 *           type: string
 *           enum:
 *             - "Seul(e) sur tes projets"
 *             - "En équipe / collaboration"
 *             - "Ça dépend du contexte"
 *           description: Mode de travail préféré
 *           example: "En équipe / collaboration"
 *         matieresPreferees:
 *           type: string
 *           maxLength: 2000
 *           description: Matières préférées et forces (texte libre, max 2000 caractères)
 *           example: "J'aime les mathématiques car je trouve ça logique et j'arrive facilement à résoudre des problèmes complexes..."
 *         passionsExtraScolaires:
 *           type: string
 *           maxLength: 2000
 *           description: Passions et activités extra-scolaires (texte libre, max 2000 caractères)
 *           example: "Je fais de la programmation dans mon temps libre, je crée des petits jeux vidéo..."
 *         messageLibre:
 *           type: string
 *           maxLength: 2000
 *           description: Message libre optionnel (texte libre, max 2000 caractères)
 *           example: "Je veux créer ma propre startup dans 5 ans et devenir entrepreneur tech"
 *
 *     QuestionnaireResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123"
 *         userId:
 *           type: string
 *           example: "45"
 *         serieId:
 *           type: string
 *           example: "1"
 *         visionProfessionnelle:
 *           type: string
 *           example: "Entrepreneur(e) / Créateur(trice) d'entreprise"
 *         styleApprentissage:
 *           type: string
 *           example: "La pratique (projets, stages, travaux pratiques)"
 *         domaineNumerique:
 *           type: string
 *           example: "Créer des sites web et applications"
 *         prioriteFormation:
 *           type: string
 *           example: "Garantie de débouchés professionnels"
 *         modeTravail:
 *           type: string
 *           example: "En équipe / collaboration"
 *         matieresPreferees:
 *           type: string
 *           example: "J'aime les mathématiques..."
 *         passionsExtraScolaires:
 *           type: string
 *           example: "Je fais de la programmation..."
 *         messageLibre:
 *           type: string
 *           example: "Je veux créer ma startup"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-12-15T14:30:00Z"
 */

/**
 * @swagger
 * /api/questionnaire/submit:
 *   post:
 *     summary: Soumettre un questionnaire d'orientation
 *     description: |
 *       Permet à un étudiant de soumettre ses réponses au questionnaire d'orientation.
 *       Le questionnaire comprend 5 questions QCM et 3 questions ouvertes pour mieux
 *       cerner le profil et les aspirations de l'étudiant.
 *
 *       **Questions QCM :**
 *       1. Vision professionnelle (5-10 ans)
 *       2. Style d'apprentissage préféré
 *       3. Domaine numérique d'intérêt
 *       4. Priorité dans le choix de formation
 *       5. Mode de travail préféré
 *
 *       **Questions ouvertes :**
 *       1. Matières préférées et forces
 *       2. Passions et activités extra-scolaires
 *       3. Message libre (optionnel)
 *     tags: [Questionnaire]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionnaireSubmit'
 *           examples:
 *             complete_questionnaire:
 *               summary: Questionnaire complet
 *               value:
 *                 serieId: "1"
 *                 visionProfessionnelle: "Entrepreneur(e) / Créateur(trice) d'entreprise"
 *                 styleApprentissage: "La pratique (projets, stages, travaux pratiques)"
 *                 domaineNumerique: "Créer des sites web et applications"
 *                 prioriteFormation: "Garantie de débouchés professionnels"
 *                 modeTravail: "En équipe / collaboration"
 *                 matieresPreferees: "J'aime les mathématiques car je trouve ça logique et j'arrive facilement à résoudre des problèmes complexes. La physique aussi me passionne."
 *                 passionsExtraScolaires: "Je fais de la programmation dans mon temps libre, je crée des petits jeux vidéo et j'aime apprendre de nouveaux langages de programmation."
 *                 messageLibre: "Je veux créer ma propre startup dans 5 ans et devenir entrepreneur tech"
 *             minimal_questionnaire:
 *               summary: Questionnaire minimal
 *               value:
 *                 serieId: "1"
 *                 visionProfessionnelle: "Je ne sais pas encore"
 *                 styleApprentissage: "Un équilibre entre théorie et pratique"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Le champ serieId est obligatoire"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token d'authentification manquant ou invalide"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la soumission du questionnaire"
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
 *       Les questionnaires sont triés par date de création (plus récent en premier).
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
 *                     $ref: '#/components/schemas/QuestionnaireResponse'
 *                 count:
 *                   type: integer
 *                   example: 2
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Accès refusé - Vous ne pouvez consulter que vos propres questionnaires"
 *       404:
 *         description: Aucun questionnaire trouvé
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
 *                   items: {}
 *                   example: []
 *                 count:
 *                   type: integer
 *                   example: 0
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
 *                   $ref: '#/components/schemas/QuestionnaireResponse'
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Aucun questionnaire trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Aucun questionnaire trouvé pour cet utilisateur"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 questionnaire:
 *                   $ref: '#/components/schemas/QuestionnaireResponse'
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
 *                     $ref: '#/components/schemas/QuestionnaireResponse'
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