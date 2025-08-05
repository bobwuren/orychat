const express = require('express');
const router = express.Router();
const {
    saveNotes,
    getAllNotes,
    getNoteById,
    deleteNote,
    getNotesByUserId,
    getNotesBySerieId,
    getNotesByUserAndSerie,
    exportNotes,
    createNote
} = require('../controllers/noteController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/requireRoleMiddleware');

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

router.post('/save', saveNotes);

/**
 * @swagger
 * /notes/export:
 *   get:
 *     summary: Exporter toutes les notes (CSV ou JSON)
 *     tags: [Notes]
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
 *         description: Notes exportées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *           text/csv:
 *             schema:
 *               type: string
 *       500:
 *         description: Erreur serveur
 */
router.get('/export',requireRole('admin'), exportNotes);

/**
 * @swagger
 * /notes/user/{userId}/serie/{serieId}:
 *   get:
 *     summary: Récupérer toutes les notes d'un utilisateur pour une série
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *       - in: path
 *         name: serieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la série
 *     responses:
 *       200:
 *         description: Liste des notes de l'utilisateur pour la série
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       500:
 *         description: Erreur serveur
 */
router.get('/user/:userId/serie/:serieId',requireRole('admin'), getNotesByUserAndSerie);

/**
 * @swagger
 * /notes/user/{userId}:
 *   get:
 *     summary: Récupérer toutes les notes d'un utilisateur
 *     tags: [Notes]
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
 *         description: Liste des notes de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       500:
 *         description: Erreur serveur
 */
router.get('/user/:userId',requireRole('admin'), getNotesByUserId);

/**
 * @swagger
 * /notes/serie/{serieId}:
 *   get:
 *     summary: Récupérer toutes les notes d'une série
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la série
 *     responses:
 *       200:
 *         description: Liste des notes de la série
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       500:
 *         description: Erreur serveur
 */
router.get('/serie/:serieId', requireRole('admin'), getNotesBySerieId);

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Récupérer toutes les notes
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', requireRole('admin'), getAllNotes);

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Créer une note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       201:
 *         description: Note créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 noteId:
 *                   type: string
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/', requireRole('admin'), createNote);

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Récupérer une note par ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la note
 *     responses:
 *       200:
 *         description: Note trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', getNoteById);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Supprimer une note (cascade SQL)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la note
 *     responses:
 *       200:
 *         description: Note supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Note non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', requireRole('admin'), deleteNote);

module.exports = router;