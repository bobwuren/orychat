const express = require('express');
const router = express.Router();
const serieController = require('../controllers/serieController');
const authMiddleware = require('../middlewares/authMiddleware');
const requirePermissions = require('../middlewares/requirePermissionsMiddleware');

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

/**
 * @swagger
 * /series:
 *   get:
 *     summary: Récupérer toutes les séries
 *     description: |
 *       Retourne la liste complète des séries éducatives avec leurs matières associées et coefficients.
 *       Cette route est accessible à tous les utilisateurs authentifiés.
 *       
 *       **Authentification :** Token Bearer obligatoire
 *       
 *       **Fonctionnalités :**
 *       - Liste toutes les séries du système
 *       - Inclut pour chaque série ses matières et coefficients
 *       - Données optimisées pour l'affichage frontend
 *       - Support de la pagination (si implémentée)
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page pour la pagination (optionnel)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Nombre de séries par page (optionnel)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par code ou description (optionnel)
 *     responses:
 *       200:
 *         description: Liste des séries récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 series:
 *                   type: array
 *                   description: Liste des séries avec leurs matières
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Identifiant unique de la série
 *                         example: "ser_123456789"
 *                       code:
 *                         type: string
 *                         description: Code unique de la série
 *                         example: "S"
 *                       description:
 *                         type: string
 *                         description: Description complète de la série
 *                         example: "Série Scientifique"
 *                       subjects:
 *                         type: array
 *                         description: Matières associées avec leurs coefficients
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               description: ID de la matière
 *                               example: "sub_987654321"
 *                             name:
 *                               type: string
 *                               description: Nom de la matière
 *                               example: "Mathématiques"
 *                             coefficient:
 *                               type: number
 *                               description: Coefficient de la matière pour cette série
 *                               example: 4
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date de création de la série
 *                         example: "2024-01-15T10:30:00.000Z"
 *                       totalSubjects:
 *                         type: integer
 *                         description: Nombre total de matières dans cette série
 *                         example: 8
 *                 metadata:
 *                   type: object
 *                   description: Métadonnées de la requête
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Nombre total de séries
 *                       example: 5
 *                     page:
 *                       type: integer
 *                       description: Page actuelle
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       description: Nombre total de pages
 *                       example: 1
 *             examples:
 *               series_list:
 *                 summary: Liste des séries éducatives
 *                 value:
 *                   series:
 *                     - id: "ser_123456789"
 *                       code: "S"
 *                       description: "Série Scientifique"
 *                       subjects:
 *                         - id: "sub_math001"
 *                           name: "Mathématiques"
 *                           coefficient: 4
 *                         - id: "sub_phys001"
 *                           name: "Physique-Chimie"
 *                           coefficient: 3
 *                       createdAt: "2024-01-15T10:30:00.000Z"
 *                       totalSubjects: 8
 *                     - id: "ser_987654321"
 *                       code: "L"
 *                       description: "Série Littéraire"
 *                       subjects:
 *                         - id: "sub_fran001"
 *                           name: "Français"
 *                           coefficient: 4
 *                         - id: "sub_hist001"
 *                           name: "Histoire-Géographie"
 *                           coefficient: 3
 *                       createdAt: "2024-01-15T11:00:00.000Z"
 *                       totalSubjects: 6
 *                   metadata:
 *                     total: 2
 *                     page: 1
 *                     totalPages: 1
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 missing_token:
 *                   summary: Token manquant
 *                   value:
 *                     error: "Token d'authentification manquant"
 *                 invalid_token:
 *                   summary: Token invalide
 *                   value:
 *                     error: "Token d'authentification invalide"
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la récupération des séries"
 */
router.get('/', serieController.getAllSeries);

/**
 * @swagger
 * /series/export:
 *   get:
 *     summary: Exporter toutes les séries (CSV ou JSON)
 *     description: |
 *       Exporte la liste complète des séries dans le format spécifié.
 *       Cette route est strictement réservée aux administrateurs.
 *       
 *       **Permissions requises :** Rôle admin
 *       **Authentification :** Token Bearer obligatoire
 *       
 *       **Formats supportés :**
 *       - **JSON :** Structure complète avec métadonnées d'export
 *       - **CSV :** Format tabulaire optimisé pour Excel/tableurs
 *       
 *       **Contenu de l'export :**
 *       - Informations complètes des séries
 *       - Matières associées avec coefficients
 *       - Statistiques et métadonnées
 *       - Horodatage de l'export
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, json]
 *           default: json
 *         description: |
 *           Format d'export souhaité
 *           - 'json': Export structuré avec métadonnées complètes
 *           - 'csv': Export tabulaire (une ligne par série-matière)
 *         example: json
 *       - in: query
 *         name: includeSubjects
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Inclure les détails des matières dans l'export
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *         description: Filtrer par période de création (format YYYY-MM-DD,YYYY-MM-DD)
 *         example: "2024-01-01,2024-12-31"
 *     responses:
 *       200:
 *         description: Export généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 series:
 *                   type: array
 *                   description: Liste complète des séries
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "ser_123456789"
 *                       code:
 *                         type: string
 *                         example: "S"
 *                       description:
 *                         type: string
 *                         example: "Série Scientifique"
 *                       subjects:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             coefficient:
 *                               type: number
 *                       totalSubjects:
 *                         type: integer
 *                         example: 8
 *                       avgCoefficient:
 *                         type: number
 *                         example: 2.75
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     totalSeries:
 *                       type: integer
 *                       example: 5
 *                     exportDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-20T10:30:00.000Z"
 *                     format:
 *                       type: string
 *                       example: "json"
 *                     exportedBy:
 *                       type: string
 *                       description: ID de l'administrateur qui a effectué l'export
 *                       example: "usr_admin_001"
 *           text/csv:
 *             schema:
 *               type: string
 *               description: |
 *                 Données CSV avec les colonnes :
 *                 - serie_id, serie_code, serie_description
 *                 - subject_id, subject_name, coefficient
 *                 - total_subjects, avg_coefficient
 *               example: |
 *                 serie_id,serie_code,serie_description,subject_id,subject_name,coefficient,total_subjects,avg_coefficient
 *                 ser_123,S,Série Scientifique,sub_math,Mathématiques,4,8,2.75
 *                 ser_123,S,Série Scientifique,sub_phys,Physique,3,8,2.75
 *             examples:
 *               csv_export:
 *                 summary: Export CSV des séries
 *                 value: |
 *                   serie_id,serie_code,serie_description,subject_id,subject_name,coefficient,total_subjects,avg_coefficient
 *                   ser_123456789,S,Série Scientifique,sub_math001,Mathématiques,4,8,2.75
 *                   ser_123456789,S,Série Scientifique,sub_phys001,Physique-Chimie,3,8,2.75
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 missing_token:
 *                   summary: Token manquant
 *                   value:
 *                     error: "Token d'authentification manquant"
 *                 invalid_token:
 *                   summary: Token invalide
 *                   value:
 *                     error: "Token d'authentification invalide"
 *       403:
 *         description: Accès refusé - privilèges administrateur requis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Accès refusé - privilèges administrateur requis"
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de l'export des séries"
 */
router.get('/export', requirePermissions('admin'), serieController.exportSeries);

/**
 * @swagger
 * /series/{id}:
 *   get:
 *     summary: Récupérer une série par ID
 *     description: |
 *       Retourne les informations détaillées d'une série spécifique avec toutes ses matières associées.
 *       Cette route est accessible à tous les utilisateurs authentifiés.
 *       
 *       **Authentification :** Token Bearer obligatoire
 *       
 *       **Informations retournées :**
 *       - Détails complets de la série
 *       - Liste des matières avec coefficients
 *       - Statistiques de la série
 *       - Métadonnées de création/modification
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant unique de la série
 *         example: "ser_123456789"
 *       - in: query
 *         name: includeStats
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Inclure les statistiques détaillées de la série
 *     responses:
 *       200:
 *         description: Série trouvée et récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serie:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Identifiant unique de la série
 *                       example: "ser_123456789"
 *                     code:
 *                       type: string
 *                       description: Code unique de la série
 *                       example: "S"
 *                     description:
 *                       type: string
 *                       description: Description complète de la série
 *                       example: "Série Scientifique"
 *                     subjects:
 *                       type: array
 *                       description: Matières associées avec leurs coefficients
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: ID de la matière
 *                             example: "sub_987654321"
 *                           name:
 *                             type: string
 *                             description: Nom de la matière
 *                             example: "Mathématiques"
 *                           coefficient:
 *                             type: number
 *                             description: Coefficient de la matière pour cette série
 *                             example: 4
 *                           isCore:
 *                             type: boolean
 *                             description: Indique si c'est une matière principale
 *                             example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date de création de la série
 *                       example: "2024-01-15T10:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date de dernière modification
 *                       example: "2024-01-18T14:20:00.000Z"
 *                     statistics:
 *                       type: object
 *                       description: Statistiques de la série
 *                       properties:
 *                         totalSubjects:
 *                           type: integer
 *                           description: Nombre total de matières
 *                           example: 8
 *                         averageCoefficient:
 *                           type: number
 *                           description: Coefficient moyen des matières
 *                           example: 2.75
 *                         maxCoefficient:
 *                           type: number
 *                           description: Coefficient le plus élevé
 *                           example: 4
 *                         minCoefficient:
 *                           type: number
 *                           description: Coefficient le plus bas
 *                           example: 1
 *             examples:
 *               scientific_series:
 *                 summary: Série Scientifique complète
 *                 value:
 *                   serie:
 *                     id: "ser_123456789"
 *                     code: "S"
 *                     description: "Série Scientifique"
 *                     subjects:
 *                       - id: "sub_math001"
 *                         name: "Mathématiques"
 *                         coefficient: 4
 *                         isCore: true
 *                       - id: "sub_phys001"
 *                         name: "Physique-Chimie"
 *                         coefficient: 3
 *                         isCore: true
 *                       - id: "sub_svt001"
 *                         name: "Sciences de la Vie et de la Terre"
 *                         coefficient: 3
 *                         isCore: true
 *                     createdAt: "2024-01-15T10:30:00.000Z"
 *                     updatedAt: "2024-01-18T14:20:00.000Z"
 *                     statistics:
 *                       totalSubjects: 8
 *                       averageCoefficient: 2.75
 *                       maxCoefficient: 4
 *                       minCoefficient: 1
 *               literary_series:
 *                 summary: Série Littéraire complète
 *                 value:
 *                   serie:
 *                     id: "ser_987654321"
 *                     code: "L"
 *                     description: "Série Littéraire"
 *                     subjects:
 *                       - id: "sub_fran001"
 *                         name: "Français"
 *                         coefficient: 4
 *                         isCore: true
 *                       - id: "sub_hist001"
 *                         name: "Histoire-Géographie"
 *                         coefficient: 3
 *                         isCore: true
 *                     createdAt: "2024-01-15T11:00:00.000Z"
 *                     updatedAt: "2024-01-15T11:00:00.000Z"
 *                     statistics:
 *                       totalSubjects: 6
 *                       averageCoefficient: 2.5
 *                       maxCoefficient: 4
 *                       minCoefficient: 1
 *       400:
 *         description: ID de série invalide ou malformé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID de série invalide"
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 missing_token:
 *                   summary: Token manquant
 *                   value:
 *                     error: "Token d'authentification manquant"
 *                 invalid_token:
 *                   summary: Token invalide
 *                   value:
 *                     error: "Token d'authentification invalide"
 *       404:
 *         description: Série non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Série non trouvée"
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la récupération de la série"
 */
router.get('/:id', serieController.getSerieById);

/**
 * @swagger
 * /series:
 *   post:
 *     summary: Créer une nouvelle série
 *     description: |
 *       Crée une nouvelle série éducative dans le système Orientys.
 *       Cette route est strictement réservée aux administrateurs.
 *       
 *       **Permissions requises :** Rôle admin
 *       **Authentification :** Token Bearer obligatoire
 *       
 *       **Fonctionnalités :**
 *       - Création d'une série avec code et description uniques
 *       - Association optionnelle de matières avec coefficients
 *       - Validation automatique des données
 *       - Génération d'ID unique automatique
 *       
 *       **Règles de validation :**
 *       - Code : obligatoire, unique, format court (ex: "S", "L", "ES")
 *       - Description : obligatoire, descriptive (ex: "Série Scientifique")
 *       - Matières : optionnelles, avec coefficients numériques positifs
 *       - Les matières doivent exister dans le système
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - description
 *             properties:
 *               code:
 *                 type: string
 *                 description: Code unique et court de la série
 *                 minLength: 1
 *                 maxLength: 10
 *                 pattern: "^[A-Z][A-Z0-9]*$"
 *                 example: "S"
 *               description:
 *                 type: string
 *                 description: Description complète et claire de la série
 *                 minLength: 5
 *                 maxLength: 255
 *                 example: "Série Scientifique"
 *               subjects:
 *                 type: array
 *                 description: |
 *                   Liste optionnelle des matières avec leurs coefficients.
 *                   Si fournie, remplace toute configuration existante.
 *                 items:
 *                   type: object
 *                   required:
 *                     - subjectId
 *                     - coefficient
 *                   properties:
 *                     subjectId:
 *                       type: string
 *                       description: Identifiant de la matière (doit exister)
 *                       example: "sub_987654321"
 *                     coefficient:
 *                       type: number
 *                       description: Coefficient de la matière (nombre positif)
 *                       minimum: 0.5
 *                       maximum: 10
 *                       example: 4
 *                     isCore:
 *                       type: boolean
 *                       description: Indique si c'est une matière principale (optionnel)
 *                       default: false
 *                       example: true
 *           examples:
 *             scientific_series:
 *               summary: Création série scientifique avec matières
 *               value:
 *                 code: "S"
 *                 description: "Série Scientifique"
 *                 subjects:
 *                   - subjectId: "sub_math001"
 *                     coefficient: 4
 *                     isCore: true
 *                   - subjectId: "sub_phys001"
 *                     coefficient: 3
 *                     isCore: true
 *                   - subjectId: "sub_svt001"
 *                     coefficient: 3
 *                     isCore: true
 *                   - subjectId: "sub_fran001"
 *                     coefficient: 2
 *                     isCore: false
 *             literary_series:
 *               summary: Création série littéraire
 *               value:
 *                 code: "L"
 *                 description: "Série Littéraire"
 *                 subjects:
 *                   - subjectId: "sub_fran001"
 *                     coefficient: 4
 *                     isCore: true
 *                   - subjectId: "sub_hist001"
 *                     coefficient: 3
 *                     isCore: true
 *             basic_series:
 *               summary: Création série sans matières
 *               value:
 *                 code: "TECH"
 *                 description: "Série Technologique"
 *     responses:
 *       201:
 *         description: Série créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Série créée avec succès"
 *                 serie:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID unique généré automatiquement
 *                       example: "ser_123456789"
 *                     code:
 *                       type: string
 *                       example: "S"
 *                     description:
 *                       type: string
 *                       example: "Série Scientifique"
 *                     subjects:
 *                       type: array
 *                       description: Matières associées (si fournies)
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           coefficient:
 *                             type: number
 *                           isCore:
 *                             type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date de création
 *                       example: "2024-01-20T15:30:00.000Z"
 *                     createdBy:
 *                       type: string
 *                       description: ID de l'administrateur créateur
 *                       example: "usr_admin_001"
 *             examples:
 *               created_scientific:
 *                 summary: Série scientifique créée
 *                 value:
 *                   message: "Série créée avec succès"
 *                   serie:
 *                     id: "ser_123456789"
 *                     code: "S"
 *                     description: "Série Scientifique"
 *                     subjects:
 *                       - id: "sub_math001"
 *                         name: "Mathématiques"
 *                         coefficient: 4
 *                         isCore: true
 *                       - id: "sub_phys001"
 *                         name: "Physique-Chimie"
 *                         coefficient: 3
 *                         isCore: true
 *                     createdAt: "2024-01-20T15:30:00.000Z"
 *                     createdBy: "usr_admin_001"
 *       400:
 *         description: Données de requête invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 missing_fields:
 *                   summary: Champs obligatoires manquants
 *                   value:
 *                     error: "Code et description sont requis"
 *                 invalid_code:
 *                   summary: Code invalide
 *                   value:
 *                     error: "Le code doit être en majuscules et unique"
 *                 invalid_subjects:
 *                   summary: Matières invalides
 *                   value:
 *                     error: "Une ou plusieurs matières spécifiées n'existent pas"
 *                 invalid_coefficient:
 *                   summary: Coefficient invalide
 *                   value:
 *                     error: "Les coefficients doivent être des nombres positifs"
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 missing_token:
 *                   summary: Token manquant
 *                   value:
 *                     error: "Token d'authentification manquant"
 *                 invalid_token:
 *                   summary: Token invalide
 *                   value:
 *                     error: "Token d'authentification invalide"
 *       403:
 *         description: Accès refusé - privilèges administrateur requis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Accès refusé - privilèges administrateur requis"
 *       409:
 *         description: Conflit - code déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Une série avec ce code existe déjà"
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la création de la série"
 */
router.post('/', requirePermissions('admin'), serieController.createSerie);

/**
 * @swagger
 * /series/{id}:
 *   put:
 *     summary: Mettre à jour une série existante
 *     description: |
 *       Met à jour une série éducative existante dans le système Orientys.
 *       Cette route est strictement réservée aux administrateurs.
 *       
 *       **Permissions requises :** Rôle admin
 *       **Authentification :** Token Bearer obligatoire
 *       
 *       **Fonctionnalités :**
 *       - Modification du code et/ou de la description de la série
 *       - Mise à jour complète des matières associées (remplace toutes les associations existantes)
 *       - Validation automatique des nouvelles données
 *       - Préservation de l'historique via updatedAt
 *       
 *       **⚠️ Important :** Si le paramètre `subjects` est fourni, il remplace TOUTES les matières existantes.
 *       Pour ajouter/retirer des matières individuellement, utilisez les routes dédiées.
 *       
 *       **Règles de validation :**
 *       - Code : doit rester unique si modifié
 *       - Description : obligatoire si fournie
 *       - Matières : doivent exister dans le système si spécifiées
 *       - Coefficients : doivent être des nombres positifs
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant unique de la série à modifier
 *         example: "ser_123456789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - description
 *             properties:
 *               code:
 *                 type: string
 *                 description: Nouveau code de la série (doit rester unique)
 *                 minLength: 1
 *                 maxLength: 10
 *                 pattern: "^[A-Z][A-Z0-9]*$"
 *                 example: "S"
 *               description:
 *                 type: string
 *                 description: Nouvelle description de la série
 *                 minLength: 5
 *                 maxLength: 255
 *                 example: "Série Scientifique - Profil Mathématiques"
 *               subjects:
 *                 type: array
 *                 description: |
 *                   ⚠️ REMPLACE TOUTES les matières existantes !
 *                   Si omis, les matières actuelles sont conservées.
 *                   Si fourni (même vide), remplace complètement la configuration.
 *                 items:
 *                   type: object
 *                   required:
 *                     - subjectId
 *                     - coefficient
 *                   properties:
 *                     subjectId:
 *                       type: string
 *                       description: Identifiant de la matière (doit exister)
 *                       example: "sub_987654321"
 *                     coefficient:
 *                       type: number
 *                       description: Nouveau coefficient de la matière
 *                       minimum: 0.5
 *                       maximum: 10
 *                       example: 4.5
 *                     isCore:
 *                       type: boolean
 *                       description: Indique si c'est une matière principale
 *                       default: false
 *                       example: true
 *           examples:
 *             update_description_only:
 *               summary: Modification description uniquement
 *               value:
 *                 code: "S"
 *                 description: "Série Scientifique - Profil Mathématiques Renforcées"
 *             update_with_new_subjects:
 *               summary: Modification complète avec nouvelles matières
 *               value:
 *                 code: "S"
 *                 description: "Série Scientifique - Nouveau Programme"
 *                 subjects:
 *                   - subjectId: "sub_math001"
 *                     coefficient: 5
 *                     isCore: true
 *                   - subjectId: "sub_phys001"
 *                     coefficient: 4
 *                     isCore: true
 *                   - subjectId: "sub_svt001"
 *                     coefficient: 3
 *                     isCore: true
 *                   - subjectId: "sub_angl001"
 *                     coefficient: 2
 *                     isCore: false
 *             remove_all_subjects:
 *               summary: Suppression de toutes les matières
 *               value:
 *                 code: "PREP"
 *                 description: "Série en Préparation"
 *                 subjects: []
 *     responses:
 *       200:
 *         description: Série mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Série mise à jour avec succès"
 *                 serie:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "ser_123456789"
 *                     code:
 *                       type: string
 *                       example: "S"
 *                     description:
 *                       type: string
 *                       example: "Série Scientifique - Profil Mathématiques"
 *                     subjects:
 *                       type: array
 *                       description: Matières mises à jour
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           coefficient:
 *                             type: number
 *                           isCore:
 *                             type: boolean
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date de la mise à jour
 *                       example: "2024-01-20T16:45:00.000Z"
 *                     updatedBy:
 *                       type: string
 *                       description: ID de l'administrateur qui a effectué la modification
 *                       example: "usr_admin_001"
 *                 changes:
 *                   type: object
 *                   description: Résumé des modifications effectuées
 *                   properties:
 *                     codeChanged:
 *                       type: boolean
 *                       example: false
 *                     descriptionChanged:
 *                       type: boolean
 *                       example: true
 *                     subjectsChanged:
 *                       type: boolean
 *                       example: true
 *                     addedSubjects:
 *                       type: integer
 *                       description: Nombre de matières ajoutées
 *                       example: 1
 *                     removedSubjects:
 *                       type: integer
 *                       description: Nombre de matières supprimées
 *                       example: 0
 *                     modifiedSubjects:
 *                       type: integer
 *                       description: Nombre de matières avec coefficients modifiés
 *                       example: 2
 *             examples:
 *               updated_successfully:
 *                 summary: Série mise à jour avec succès
 *                 value:
 *                   message: "Série mise à jour avec succès"
 *                   serie:
 *                     id: "ser_123456789"
 *                     code: "S"
 *                     description: "Série Scientifique - Profil Mathématiques"
 *                     subjects:
 *                       - id: "sub_math001"
 *                         name: "Mathématiques"
 *                         coefficient: 5
 *                         isCore: true
 *                       - id: "sub_phys001"
 *                         name: "Physique-Chimie"
 *                         coefficient: 4
 *                         isCore: true
 *                     updatedAt: "2024-01-20T16:45:00.000Z"
 *                     updatedBy: "usr_admin_001"
 *                   changes:
 *                     codeChanged: false
 *                     descriptionChanged: true
 *                     subjectsChanged: true
 *                     addedSubjects: 0
 *                     removedSubjects: 1
 *                     modifiedSubjects: 2
 *       400:
 *         description: Données de requête invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 missing_fields:
 *                   summary: Champs obligatoires manquants
 *                   value:
 *                     error: "Code et description sont requis"
 *                 invalid_code:
 *                   summary: Code invalide
 *                   value:
 *                     error: "Le code doit être en majuscules"
 *                 invalid_subjects:
 *                   summary: Matières inexistantes
 *                   value:
 *                     error: "Une ou plusieurs matières spécifiées n'existent pas"
 *                 invalid_coefficient:
 *                   summary: Coefficients invalides
 *                   value:
 *                     error: "Les coefficients doivent être des nombres positifs"
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 missing_token:
 *                   summary: Token manquant
 *                   value:
 *                     error: "Token d'authentification manquant"
 *                 invalid_token:
 *                   summary: Token invalide
 *                   value:
 *                     error: "Token d'authentification invalide"
 *       403:
 *         description: Accès refusé - privilèges administrateur requis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Accès refusé - privilèges administrateur requis"
 *       404:
 *         description: Série non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Série non trouvée"
 *       409:
 *         description: Conflit - code déjà utilisé par une autre série
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Une autre série utilise déjà ce code"
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la mise à jour de la série"
 */
router.put('/:id', requirePermissions('admin'), serieController.updateSerie);

/**
 * @swagger
 * /series/{id}:
 *   delete:
 *     summary: Supprimer une série
 *     description: |
 *       Supprime définitivement une série éducative du système Orientys.
 *       Cette route est strictement réservée aux administrateurs.
 *       
 *       **⚠️ ATTENTION :** Cette opération est irréversible !
 *       
 *       **Permissions requises :** Rôle admin
 *       **Authentification :** Token Bearer obligatoire
 *       
 *       **Effets de la suppression :**
 *       - Suppression définitive de la série et de toutes ses données
 *       - Suppression en cascade des associations série-matière (coefficients)
 *       - Suppression des recommandations liées à cette série
 *       - Mise à jour des profils étudiants qui référencent cette série
 *       - Impact possible sur les calculs d'orientation existants
 *       
 *       **Vérifications préalables :**
 *       - Contrôle des dépendances actives
 *       - Validation de l'existence de la série
 *       - Logs d'audit automatiques pour traçabilité
 *       
 *       **⚠️ Recommandations :**
 *       - Exporter les données avant suppression si nécessaire
 *       - Vérifier l'impact sur les utilisateurs actifs
 *       - Considérer la désactivation plutôt que la suppression pour les séries avec historique
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant unique de la série à supprimer
 *         example: "ser_123456789"
 *       - in: query
 *         name: force
 *         schema:
 *           type: boolean
 *           default: false
 *         description: |
 *           Forcer la suppression même si des dépendances existent.
 *           ⚠️ Utiliser avec précaution !
 *       - in: query
 *         name: cascade
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Supprimer en cascade toutes les données dépendantes
 *     responses:
 *       200:
 *         description: Série supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Série supprimée avec succès"
 *                 deletedSerie:
 *                   type: object
 *                   description: Informations de la série supprimée (pour confirmation)
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "ser_123456789"
 *                     code:
 *                       type: string
 *                       example: "S"
 *                     description:
 *                       type: string
 *                       example: "Série Scientifique"
 *                     totalSubjects:
 *                       type: integer
 *                       description: Nombre de matières qui étaient associées
 *                       example: 8
 *                 deletedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Horodatage de la suppression
 *                   example: "2024-01-20T17:30:00.000Z"
 *                 deletedBy:
 *                   type: string
 *                   description: ID de l'administrateur qui a effectué la suppression
 *                   example: "usr_admin_001"
 *                 cascadeEffects:
 *                   type: object
 *                   description: Détails des suppressions en cascade effectuées
 *                   properties:
 *                     subjectCoefficientsDeleted:
 *                       type: integer
 *                       description: Nombre d'associations série-matière supprimées
 *                       example: 8
 *                     recommendationsDeleted:
 *                       type: integer
 *                       description: Nombre de recommandations supprimées
 *                       example: 15
 *                     affectedUsers:
 *                       type: integer
 *                       description: Nombre d'utilisateurs dont le profil a été mis à jour
 *                       example: 3
 *                 auditLog:
 *                   type: object
 *                   description: Informations d'audit pour traçabilité
 *                   properties:
 *                     action:
 *                       type: string
 *                       example: "SERIE_DELETED"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-20T17:30:00.000Z"
 *                     performedBy:
 *                       type: string
 *                       example: "usr_admin_001"
 *                     ipAddress:
 *                       type: string
 *                       description: Adresse IP de l'administrateur
 *                       example: "192.168.1.100"
 *             examples:
 *               serie_deleted:
 *                 summary: Série supprimée avec succès
 *                 value:
 *                   message: "Série supprimée avec succès"
 *                   deletedSerie:
 *                     id: "ser_123456789"
 *                     code: "S"
 *                     description: "Série Scientifique"
 *                     totalSubjects: 8
 *                   deletedAt: "2024-01-20T17:30:00.000Z"
 *                   deletedBy: "usr_admin_001"
 *                   cascadeEffects:
 *                     subjectCoefficientsDeleted: 8
 *                     recommendationsDeleted: 15
 *                     affectedUsers: 3
 *                   auditLog:
 *                     action: "SERIE_DELETED"
 *                     timestamp: "2024-01-20T17:30:00.000Z"
 *                     performedBy: "usr_admin_001"
 *                     ipAddress: "192.168.1.100"
 *       400:
 *         description: Requête invalide ou dépendances existantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 dependencies:
 *                   type: object
 *                   description: Détails des dépendances qui empêchent la suppression
 *               examples:
 *                 invalid_id:
 *                   summary: ID invalide
 *                   value:
 *                     error: "ID de série invalide"
 *                 has_dependencies:
 *                   summary: Dépendances existantes
 *                   value:
 *                     error: "Impossible de supprimer : des dépendances existent"
 *                     dependencies:
 *                       activeRecommendations: 15
 *                       linkedUsers: 3
 *                       pendingCalculations: 2
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 missing_token:
 *                   summary: Token manquant
 *                   value:
 *                     error: "Token d'authentification manquant"
 *                 invalid_token:
 *                   summary: Token invalide
 *                   value:
 *                     error: "Token d'authentification invalide"
 *       403:
 *         description: Accès refusé - privilèges administrateur requis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Accès refusé - privilèges administrateur requis"
 *       404:
 *         description: Série non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Série non trouvée"
 *       409:
 *         description: Conflit - suppression impossible sans force
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Suppression bloquée par des dépendances critiques. Utilisez force=true si nécessaire."
 *                 criticalDependencies:
 *                   type: object
 *                   properties:
 *                     activeUsers:
 *                       type: integer
 *                       example: 25
 *                     recentRecommendations:
 *                       type: integer
 *                       example: 8
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la suppression de la série"
 */
router.delete('/:id', requirePermissions('admin'), serieController.deleteSerie);

module.exports = router;