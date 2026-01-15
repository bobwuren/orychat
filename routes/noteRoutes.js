const express = require('express');
const router = express.Router();
const {
    saveNotes,
    getAllNotes,
    getNoteById,
    getNotesByUserId,
    createNote
} = require('../controllers/noteController');
const authMiddleware = require('../middlewares/authMiddleware');
const requirePermissions = require('../middlewares/requirePermissionsMiddleware');

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

router.post('/save', saveNotes);

/**
 * @swagger
 * /api/notes/user/{userId}:
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
router.get('/user/:userId',requirePermissions('admin'), getNotesByUserId);

/**
 * @swagger
 * /api/notes:
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
router.get('/', requirePermissions('admin'), getAllNotes);

/**
 * @swagger
 * /api/notes:
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
router.post('/', requirePermissions('admin'), createNote);

/**
 * @swagger
 * /api/notes/{id}:
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

module.exports = router;