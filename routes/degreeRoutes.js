const express = require('express');
const router = express.Router();
const degreeController = require('../controllers/degreeController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/requireRoleMiddleware');

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

/**
 * @swagger
 * /degrees:
 *   get:
 *     summary: Récupérer tous les diplômes
 *     tags: [Degrees]
 *     responses:
 *       200:
 *         description: Liste des diplômes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Degree'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', degreeController.getAll);

/**
 * @swagger
 * /degrees/university/{universityId}:
 *   get:
 *     summary: Récupérer les diplômes d'une université
 *     tags: [Degrees]
 *     parameters:
 *       - in: path
 *         name: universityId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'université
 *     responses:
 *       200:
 *         description: Liste des diplômes de l'université
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Degree'
 *       500:
 *         description: Erreur serveur
 */
router.get('/university/:universityId', degreeController.getByUniversityId);

/**
 * @swagger
 * /degrees/export:
 *   get:
 *     summary: Exporter tous les diplômes (CSV ou JSON)
 *     tags: [Degrees]
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
 *         description: Diplômes exportés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 degrees:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Degree'
 *           text/csv:
 *             schema:
 *               type: string
 *       500:
 *         description: Erreur serveur
 */
router.get('/export', requireRole('admin'), degreeController.exportAll);

/**
 * @swagger
 * /degrees/{id}:
 *   get:
 *     summary: Récupérer un diplôme par ID
 *     tags: [Degrees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du diplôme
 *     responses:
 *       200:
 *         description: Diplôme trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Degree'
 *       404:
 *         description: Diplôme non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', degreeController.getById);

/**
 * @swagger
 * /degrees:
 *   post:
 *     summary: Créer un diplôme
 *     tags: [Degrees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Degree'
 *     responses:
 *       201:
 *         description: Diplôme créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Degree'
 *       500:
 *         description: Erreur serveur
 */
router.post('/', requireRole('admin'), degreeController.create);

/**
 * @swagger
 * /degrees/{id}:
 *   put:
 *     summary: Mettre à jour un diplôme
 *     tags: [Degrees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du diplôme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Degree'
 *     responses:
 *       200:
 *         description: Diplôme mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Degree'
 *       404:
 *         description: Diplôme non trouvé ou aucune modification
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', requireRole('admin'), degreeController.update);

/**
 * @swagger
 * /degrees/{id}:
 *   delete:
 *     summary: Supprimer un diplôme
 *     tags: [Degrees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du diplôme
 *     responses:
 *       204:
 *         description: Diplôme supprimé
 *       404:
 *         description: Diplôme non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', requireRole('admin'), degreeController.delete);

/**
 * @swagger
 * /degrees/{id}/universities:
 *   get:
 *     summary: Récupérer toutes les universités qui proposent ce diplôme
 *     tags: [Degrees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du diplôme
 *     responses:
 *       200:
 *         description: Liste des universités
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/University'
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id/universities', requireRole('admin'), degreeController.getUniversities);

module.exports = router;
