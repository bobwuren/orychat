/**
 * =====================================================
 * Counselor Routes
 * =====================================================
 * Définit les routes API pour les conseillers d'orientation
 *
 * @module routes/counselorRoutes
 * @version 2.0
 */

const express = require('express');
const router = express.Router();
const counselorController = require('../controllers/counselorController');
const authMiddleware = require('../middlewares/authMiddleware');
const requirePermissions = require('../middlewares/requirePermissionsMiddleware');

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

/**
 * @swagger
 * /api/counselors:
 *   get:
 *     summary: Récupérer tous les conseillers actifs
 *     description: |
 *       Retourne la liste de tous les conseillers d'orientation actifs.
 *       Accessible à tous les utilisateurs authentifiés.
 *       Permet le filtrage par spécialité.
 *     tags: [Counselors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *         description: Filtrer par spécialité (optionnel)
 *         example: "Informatique"
 *     responses:
 *       200:
 *         description: Liste des conseillers récupérée avec succès
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/', counselorController.getAllCounselors);

/**
 * @swagger
 * /api/counselors/all:
 *   get:
 *     summary: Récupérer tous les conseillers (Admin uniquement)
 *     description: |
 *       Retourne la liste complète de tous les conseillers (actifs + inactifs).
 *       Accessible uniquement par les administrateurs.
 *     tags: [Counselors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des conseillers récupérée avec succès
 *       403:
 *         description: Accès refusé - Admin requis
 *       500:
 *         description: Erreur serveur
 */
router.get('/all', requirePermissions('admin'), counselorController.getAllCounselorsAdmin);

/**
 * @swagger
 * /api/counselors/{id}:
 *   get:
 *     summary: Récupérer un conseiller par son ID
 *     description: |
 *       Retourne les détails complets d'un conseiller spécifique.
 *       Accessible à tous les utilisateurs authentifiés.
 *     tags: [Counselors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du conseiller
 *         example: "1"
 *     responses:
 *       200:
 *         description: Conseiller récupéré avec succès
 *       404:
 *         description: Conseiller non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', counselorController.getCounselorById);

/**
 * @swagger
 * /api/counselors:
 *   post:
 *     summary: Créer un nouveau conseiller (Admin uniquement)
 *     description: |
 *       Crée un nouveau conseiller d'orientation dans le système.
 *       Accessible uniquement par les administrateurs.
 *     tags: [Counselors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom complet du conseiller
 *                 example: "Dr. Koffi MENSAH"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email unique du conseiller
 *                 example: "k.mensah@orientys.tg"
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone
 *                 example: "+228 90 12 34 56"
 *               photo:
 *                 type: string
 *                 format: uri
 *                 description: URL de la photo de profil
 *                 example: "https://example.com/photo.jpg"
 *               bio:
 *                 type: string
 *                 description: Biographie du conseiller
 *                 example: "Expert en orientation avec 10 ans d'expérience..."
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des spécialités
 *                 example: ["Informatique", "Ingénierie"]
 *               isActive:
 *                 type: boolean
 *                 description: Statut actif du conseiller
 *                 example: true
 *     responses:
 *       201:
 *         description: Conseiller créé avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé - Admin requis
 *       409:
 *         description: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', requirePermissions('admin'), counselorController.createCounselor);

/**
 * @swagger
 * /api/counselors/{id}:
 *   put:
 *     summary: Mettre à jour un conseiller (Admin uniquement)
 *     description: |
 *       Met à jour les informations d'un conseiller existant.
 *       Tous les champs sont optionnels.
 *       Accessible uniquement par les administrateurs.
 *     tags: [Counselors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du conseiller à modifier
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: uri
 *               bio:
 *                 type: string
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Conseiller mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé - Admin requis
 *       404:
 *         description: Conseiller non trouvé
 *       409:
 *         description: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', requirePermissions('admin'), counselorController.updateCounselor);

/**
 * @swagger
 * /api/counselors/{id}:
 *   delete:
 *     summary: Supprimer un conseiller (Admin uniquement)
 *     description: |
 *       Supprime définitivement un conseiller du système.
 *       Accessible uniquement par les administrateurs.
 *     tags: [Counselors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du conseiller à supprimer
 *         example: "1"
 *     responses:
 *       200:
 *         description: Conseiller supprimé avec succès
 *       403:
 *         description: Accès refusé - Admin requis
 *       404:
 *         description: Conseiller non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', requirePermissions('admin'), counselorController.deleteCounselor);

/**
 * @swagger
 * /api/counselors/{id}/deactivate:
 *   patch:
 *     summary: Désactiver un conseiller (Admin uniquement)
 *     description: |
 *       Désactive un conseiller (soft delete).
 *       Le conseiller n'apparaîtra plus dans la liste des conseillers actifs.
 *       Accessible uniquement par les administrateurs.
 *     tags: [Counselors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du conseiller à désactiver
 *         example: "1"
 *     responses:
 *       200:
 *         description: Conseiller désactivé avec succès
 *       403:
 *         description: Accès refusé - Admin requis
 *       404:
 *         description: Conseiller non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id/deactivate', requirePermissions('admin'), counselorController.deactivateCounselor);

/**
 * @swagger
 * /api/counselors/{id}/activate:
 *   patch:
 *     summary: Activer un conseiller (Admin uniquement)
 *     description: |
 *       Réactive un conseiller désactivé.
 *       Le conseiller réapparaîtra dans la liste des conseillers actifs.
 *       Accessible uniquement par les administrateurs.
 *     tags: [Counselors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du conseiller à activer
 *         example: "1"
 *     responses:
 *       200:
 *         description: Conseiller activé avec succès
 *       403:
 *         description: Accès refusé - Admin requis
 *       404:
 *         description: Conseiller non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id/activate', requirePermissions('admin'), counselorController.activateCounselor);

module.exports = router;