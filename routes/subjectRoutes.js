const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/requireRoleMiddleware');

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Récupérer toutes les matières du système
 *     description: |
 *       Récupère la liste complète de toutes les matières disponibles dans le système éducatif.
 *       
 *       **Fonctionnalités:**
 *       - Liste paginée de toutes les matières
 *       - Informations complètes pour chaque matière
 *       - Comptage total des matières
 *       - Support de la recherche et du filtrage
 *       
 *       **Permissions requises:** Utilisateur authentifié (admin ou client)
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page pour la pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre d'éléments par page
 *         example: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Terme de recherche pour filtrer par nom de matière
 *         example: "mathématiques"
 *     responses:
 *       200:
 *         description: Liste des matières récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 subjects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubjectWithCoefficients'
 *                 count:
 *                   type: integer
 *                   description: Nombre total de matières
 *                   example: 25
 *                 totalPages:
 *                   type: integer
 *                   description: Nombre total de pages
 *                   example: 3
 *                 currentPage:
 *                   type: integer
 *                   description: Page actuelle
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: "Matières récupérées avec succès"
 *             examples:
 *               success:
 *                 summary: Récupération réussie
 *                 value:
 *                   success: true
 *                   subjects:
 *                     - id: "subj_1234567890"
 *                       name: "Mathématiques"
 *                       description: "Algèbre, géométrie et analyse"
 *                       code: "MATH"
 *                       serieId: "ser_0987654321"
 *                       seriesName: "Série S"
 *                       coefficients:
 *                         - serieId: "ser_0987654321"
 *                           seriesName: "Série S"
 *                           coefficient: 4
 *                       createdAt: "2023-01-15T10:30:00Z"
 *                       updatedAt: "2023-06-20T14:45:00Z"
 *                     - id: "subj_2345678901"
 *                       name: "Physique-Chimie"
 *                       description: "Sciences physiques et chimiques"
 *                       code: "PC"
 *                       serieId: null
 *                       seriesName: null
 *                       coefficients: []
 *                       createdAt: "2023-02-10T09:15:00Z"
 *                       updatedAt: "2023-02-10T09:15:00Z"
 *                   count: 25
 *                   totalPages: 3
 *                   currentPage: 1
 *                   message: "Matières récupérées avec succès"
 *               empty:
 *                 summary: Aucune matière trouvée
 *                 value:
 *                   success: true
 *                   subjects: []
 *                   count: 0
 *                   totalPages: 0
 *                   currentPage: 1
 *                   message: "Aucune matière trouvée"
 *       401:
 *         description: Non autorisé - Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Token d'accès requis"
 *               error: "UNAUTHORIZED"
 *       403:
 *         description: Accès refusé - Permissions insuffisantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Accès refusé"
 *               error: "FORBIDDEN"
*       500:
*         description: Erreur interne du serveur
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/ErrorResponse'
*             example:
*               success: false
*               message: "Erreur lors de la récupération des matières"
*               error: "INTERNAL_SERVER_ERROR"
*/
router.get('/', subjectController.getAllSubjects);

/**
 * @swagger
 * /subjects/export:
 *   get:
 *     summary: Exporter toutes les matières au format CSV ou JSON
 *     description: |
 *       Génère et télécharge un fichier contenant toutes les matières du système avec leurs informations complètes.
 *       
 *       **Fonctionnalités:**
 *       - Export complet de toutes les matières
 *       - Formats supportés: CSV et JSON
 *       - Inclut les assignations de séries et coefficients
 *       - Encodage UTF-8 pour les caractères spéciaux
 *       
 *       **Permissions requises:** Administrateur uniquement
 *       
 *       **Format CSV:**
 *       - En-têtes: ID, Nom, Description, Code, Série ID, Nom de Série, Coefficients, Date de Création, Date de Modification
 *       - Séparateur: virgule (,)
 *       - Encodage: UTF-8
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, json]
 *           default: csv
 *         description: Format de fichier souhaité pour l'export
 *         example: "csv"
 *     responses:
 *       200:
 *         description: Export généré avec succès
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *               example: |
 *                 ID,Nom,Description,Code,Série ID,Nom de Série,Coefficients,Date de Création,Date de Modification
 *                 subj_1234567890,Mathématiques,Algèbre et géométrie,MATH,ser_0987654321,Série S,"[{""serieId"":""ser_0987654321"",""coefficient"":4}]",2023-01-15T10:30:00Z,2023-06-20T14:45:00Z
 *                 subj_2345678901,Physique-Chimie,Sciences physiques,PC,,,,[],2023-02-10T09:15:00Z,2023-02-10T09:15:00Z
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 subjects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubjectWithCoefficients'
 *                 count:
 *                   type: integer
 *                   example: 25
 *                 format:
 *                   type: string
 *                   example: "json"
 *                 exportDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-15T14:30:00Z"
 *                 message:
 *                   type: string
 *                   example: "Export JSON réussi"
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *             example: "attachment; filename=subjects_export_2023-12-15.csv"
 *           Content-Type:
 *             schema:
 *               type: string
 *             example: "text/csv; charset=utf-8"
 *       401:
 *         description: Non autorisé - Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Token d'accès requis"
 *               error: "UNAUTHORIZED"
 *       403:
 *         description: Accès refusé - Seuls les administrateurs peuvent exporter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Accès réservé aux administrateurs"
 *               error: "ADMIN_REQUIRED"
 *       500:
 *         description: Erreur interne du serveur lors de la génération du fichier
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de l'export des matières"
 *               error: "EXPORT_FAILED"
 */
router.get('/export', requireRole('admin'), subjectController.exportSubjects);

/**
 * @swagger
 * /subjects/{id}:
 *   get:
 *     summary: Récupérer une matière spécifique par son ID
 *     description: |
 *       Récupère les informations détaillées d'une matière spécifique en utilisant son identifiant unique.
 *       
 *       **Fonctionnalités:**
 *       - Informations complètes de la matière
 *       - Liste des coefficients par série
 *       - Données de création et modification
 *       - Gestion des erreurs 404 si la matière n'existe pas
 *       
 *       **Permissions requises:** Utilisateur authentifié (admin ou client)
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^subj_[0-9]+$'
 *         description: Identifiant unique de la matière (format subj_xxxxxxxxxx)
 *         example: "subj_1234567890"
 *     responses:
 *       200:
 *         description: Matière récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 subject:
 *                   $ref: '#/components/schemas/SubjectWithCoefficients'
 *                 message:
 *                   type: string
 *                   example: "Matière récupérée avec succès"
 *             examples:
 *               with_coefficients:
 *                 summary: Matière avec coefficients par série
 *                 value:
 *                   success: true
 *                   subject:
 *                     id: "subj_1234567890"
 *                     name: "Mathématiques"
 *                     description: "Algèbre, géométrie et analyse mathématique"
 *                     code: "MATH"
 *                     serieId: "ser_0987654321"
 *                     seriesName: "Série S"
 *                     coefficients:
 *                       - serieId: "ser_0987654321"
 *                         seriesName: "Série S"
 *                         coefficient: 4
 *                       - serieId: "ser_1111111111"
 *                         seriesName: "Série ES"
 *                         coefficient: 3
 *                     createdAt: "2023-01-15T10:30:00Z"
 *                     updatedAt: "2023-06-20T14:45:00Z"
 *                   message: "Matière récupérée avec succès"
 *               without_coefficients:
 *                 summary: Matière sans coefficients
 *                 value:
 *                   success: true
 *                   subject:
 *                     id: "subj_2345678901"
 *                     name: "Arts Plastiques"
 *                     description: "Expression artistique et créativité"
 *                     code: "ART"
 *                     serieId: null
 *                     seriesName: null
 *                     coefficients: []
 *                     createdAt: "2023-03-10T09:15:00Z"
 *                     updatedAt: "2023-03-10T09:15:00Z"
 *                   message: "Matière récupérée avec succès"
 *       400:
 *         description: ID de matière invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Format d'ID invalide"
 *               error: "INVALID_ID_FORMAT"
 *       401:
 *         description: Non autorisé - Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Token d'accès requis"
 *               error: "UNAUTHORIZED"
 *       403:
 *         description: Accès refusé - Permissions insuffisantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Accès refusé"
 *               error: "FORBIDDEN"
 *       404:
 *         description: Matière non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Matière non trouvée"
 *               error: "SUBJECT_NOT_FOUND"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de la récupération de la matière"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.get('/:id', subjectController.getSubjectById);

/**
 * @swagger
 * /subjects/serie/{serieId}:
 *   get:
 *     summary: Récupérer toutes les matières assignées à une série spécifique
 *     description: |
 *       Récupère la liste de toutes les matières qui sont assignées à une série donnée avec leurs coefficients.
 *       
 *       **Fonctionnalités:**
 *       - Liste des matières d'une série spécifique
 *       - Inclut les coefficients pour chaque matière
 *       - Informations complètes des matières
 *       - Validation de l'existence de la série
 *       
 *       **Permissions requises:** Utilisateur authentifié (admin ou client)
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serieId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^ser_[0-9]+$'
 *         description: Identifiant unique de la série (format ser_xxxxxxxxxx)
 *         example: "ser_0987654321"
 *     responses:
 *       200:
 *         description: Liste des matières de la série récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 subjects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subject'
 *                 serieInfo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "ser_0987654321"
 *                     name:
 *                       type: string
 *                       example: "Série S"
 *                 count:
 *                   type: integer
 *                   description: Nombre de matières dans cette série
 *                   example: 8
 *                 message:
 *                   type: string
 *                   example: "Matières de la série récupérées avec succès"
 *             examples:
 *               with_subjects:
 *                 summary: Série avec matières
 *                 value:
 *                   success: true
 *                   subjects:
 *                     - id: "subj_1234567890"
 *                       name: "Mathématiques"
 *                       description: "Algèbre, géométrie et analyse"
 *                       code: "MATH"
 *                       coefficient: 4
 *                       createdAt: "2023-01-15T10:30:00Z"
 *                       updatedAt: "2023-06-20T14:45:00Z"
 *                     - id: "subj_2345678901"
 *                       name: "Physique-Chimie"
 *                       description: "Sciences physiques et chimiques"
 *                       code: "PC"
 *                       coefficient: 4
 *                       createdAt: "2023-02-10T09:15:00Z"
 *                       updatedAt: "2023-02-10T09:15:00Z"
 *                   serieInfo:
 *                     id: "ser_0987654321"
 *                     name: "Série S"
 *                   count: 8
 *                   message: "Matières de la série récupérées avec succès"
 *               empty_series:
 *                 summary: Série sans matières
 *                 value:
 *                   success: true
 *                   subjects: []
 *                   serieInfo:
 *                     id: "ser_1111111111"
 *                     name: "Série L"
 *                   count: 0
 *                   message: "Aucune matière assignée à cette série"
 *       400:
 *         description: ID de série manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "ID de série requis et valide"
 *               error: "INVALID_SERIE_ID"
 *       401:
 *         description: Non autorisé - Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Token d'accès requis"
 *               error: "UNAUTHORIZED"
 *       404:
 *         description: Série non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Série non trouvée"
 *               error: "SERIES_NOT_FOUND"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de la récupération des matières"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.get('/serie/:serieId', subjectController.getSubjectsBySerieId);

/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Créer une nouvelle matière dans le système
 *     description: |
 *       Crée une nouvelle matière académique avec possibilité d'assigner des coefficients pour différentes séries.
 *       
 *       **Fonctionnalités:**
 *       - Création de matière avec nom obligatoire
 *       - Assignment optionnel à des séries avec coefficients
 *       - Validation de l'unicité du nom
 *       - Génération automatique d'un ID unique
 *       
 *       **Permissions requises:** Administrateur uniquement
 *       
 *       **Règles de validation:**
 *       - Nom obligatoire (2-100 caractères)
 *       - Coefficients optionnels (valeurs décimales positives)
 *       - Vérification de l'existence des séries référencées
 *     tags: [Subjects]
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
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Nom de la matière (obligatoire et unique)
 *                 example: "Mathématiques"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Description détaillée de la matière (optionnel)
 *                 example: "Algèbre, géométrie et analyse mathématique"
 *               code:
 *                 type: string
 *                 maxLength: 10
 *                 description: Code court de la matière (optionnel)
 *                 example: "MATH"
 *               seriesCoefficients:
 *                 type: array
 *                 description: Liste des coefficients par série (optionnel)
 *                 items:
 *                   type: object
 *                   required:
 *                     - serieId
 *                     - coefficient
 *                   properties:
 *                     serieId:
 *                       type: string
 *                       pattern: '^ser_[0-9]+$'
 *                       description: ID de la série existante
 *                       example: "ser_0987654321"
 *                     coefficient:
 *                       type: number
 *                       minimum: 0.1
 *                       maximum: 20
 *                       description: Coefficient de la matière pour cette série
 *                       example: 4
 *           examples:
 *             simple_subject:
 *               summary: Matière simple sans série
 *               value:
 *                 name: "Arts Plastiques"
 *                 description: "Expression artistique et créativité"
 *                 code: "ART"
 *             subject_with_series:
 *               summary: Matière avec assignations de séries
 *               value:
 *                 name: "Mathématiques"
 *                 description: "Algèbre, géométrie et analyse mathématique"
 *                 code: "MATH"
 *                 seriesCoefficients:
 *                   - serieId: "ser_0987654321"
 *                     coefficient: 4
 *                   - serieId: "ser_1111111111"
 *                     coefficient: 3
 *     responses:
 *       201:
 *         description: Matière créée avec succès
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
 *                   example: "Matière créée avec succès"
 *                 subject:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "subj_1234567890"
 *                     name:
 *                       type: string
 *                       example: "Mathématiques"
 *                     description:
 *                       type: string
 *                       example: "Algèbre, géométrie et analyse mathématique"
 *                     code:
 *                       type: string
 *                       example: "MATH"
 *                     seriesCoefficients:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           serieId:
 *                             type: string
 *                           seriesName:
 *                             type: string
 *                           coefficient:
 *                             type: number
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-15T14:30:00Z"
 *             examples:
 *               created_simple:
 *                 summary: Matière simple créée
 *                 value:
 *                   success: true
 *                   message: "Matière créée avec succès"
 *                   subject:
 *                     id: "subj_3456789012"
 *                     name: "Arts Plastiques"
 *                     description: "Expression artistique et créativité"
 *                     code: "ART"
 *                     seriesCoefficients: []
 *                     createdAt: "2023-12-15T14:30:00Z"
 *               created_with_series:
 *                 summary: Matière avec séries créée
 *                 value:
 *                   success: true
 *                   message: "Matière créée avec succès"
 *                   subject:
 *                     id: "subj_1234567890"
 *                     name: "Mathématiques"
 *                     description: "Algèbre, géométrie et analyse mathématique"
 *                     code: "MATH"
 *                     seriesCoefficients:
 *                       - serieId: "ser_0987654321"
 *                         seriesName: "Série S"
 *                         coefficient: 4
 *                       - serieId: "ser_1111111111"
 *                         seriesName: "Série ES"
 *                         coefficient: 3
 *                     createdAt: "2023-12-15T14:30:00Z"
 *       400:
 *         description: Données de requête invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_name:
 *                 summary: Nom manquant
 *                 value:
 *                   success: false
 *                   message: "Le nom de la matière est obligatoire"
 *                   error: "MISSING_REQUIRED_FIELD"
 *               invalid_coefficient:
 *                 summary: Coefficient invalide
 *                 value:
 *                   success: false
 *                   message: "Le coefficient doit être entre 0.1 et 20"
 *                   error: "INVALID_COEFFICIENT"
 *       401:
 *         description: Non autorisé - Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Token d'accès requis"
 *               error: "UNAUTHORIZED"
 *       403:
 *         description: Accès refusé - Seuls les administrateurs peuvent créer des matières
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Accès réservé aux administrateurs"
 *               error: "ADMIN_REQUIRED"
 *       409:
 *         description: Conflit - Nom de matière déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Une matière avec ce nom existe déjà"
 *               error: "SUBJECT_NAME_EXISTS"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de la création de la matière"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.post('/', requireRole('admin'), subjectController.createSubject);

/**
 * @swagger
 * /subjects/{id}:
 *   put:
 *     summary: Modifier une matière existante
 *     description: |
 *       Met à jour les informations d'une matière existante, y compris ses assignations aux séries avec coefficients.
 *       
 *       **Fonctionnalités:**
 *       - Modification des informations de base de la matière
 *       - Mise à jour des coefficients par série
 *       - Ajout ou suppression d'assignations de séries
 *       - Validation de l'unicité du nom (sauf pour la matière elle-même)
 *       
 *       **Permissions requises:** Administrateur uniquement
 *       
 *       **Règles de validation:**
 *       - Nom obligatoire (2-100 caractères)
 *       - Coefficients optionnels (valeurs décimales positives)
 *       - Vérification de l'existence des séries référencées
 *       - Préservation de l'historique de modification
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^subj_[0-9]+$'
 *         description: Identifiant unique de la matière à modifier
 *         example: "subj_1234567890"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Nom de la matière (obligatoire et unique)
 *                 example: "Mathématiques Avancées"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Description détaillée de la matière (optionnel)
 *                 example: "Algèbre avancée, géométrie et analyse mathématique"
 *               code:
 *                 type: string
 *                 maxLength: 10
 *                 description: Code court de la matière (optionnel)
 *                 example: "MATH_ADV"
 *               seriesCoefficients:
 *                 type: array
 *                 description: Liste des coefficients par série (remplace entièrement la liste existante)
 *                 items:
 *                   type: object
 *                   required:
 *                     - serieId
 *                     - coefficient
 *                   properties:
 *                     serieId:
 *                       type: string
 *                       pattern: '^ser_[0-9]+$'
 *                       description: ID de la série existante
 *                       example: "ser_0987654321"
 *                     coefficient:
 *                       type: number
 *                       minimum: 0.1
 *                       maximum: 20
 *                       description: Coefficient de la matière pour cette série
 *                       example: 5
 *           examples:
 *             update_basic:
 *               summary: Mise à jour des informations de base
 *               value:
 *                 name: "Mathématiques Avancées"
 *                 description: "Algèbre avancée, géométrie et analyse mathématique"
 *                 code: "MATH_ADV"
 *             update_with_new_series:
 *               summary: Mise à jour avec nouvelles assignations
 *               value:
 *                 name: "Mathématiques Avancées"
 *                 description: "Algèbre avancée, géométrie et analyse mathématique"
 *                 code: "MATH_ADV"
 *                 seriesCoefficients:
 *                   - serieId: "ser_0987654321"
 *                     coefficient: 5
 *                   - serieId: "ser_1111111111"
 *                     coefficient: 4
 *                   - serieId: "ser_2222222222"
 *                     coefficient: 2
 *             remove_series:
 *               summary: Suppression de toutes les assignations
 *               value:
 *                 name: "Arts Plastiques"
 *                 description: "Expression artistique sans assignation de série"
 *                 code: "ART"
 *                 seriesCoefficients: []
 *     responses:
 *       200:
 *         description: Matière modifiée avec succès
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
 *                   example: "Matière modifiée avec succès"
 *                 subject:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "subj_1234567890"
 *                     name:
 *                       type: string
 *                       example: "Mathématiques Avancées"
 *                     description:
 *                       type: string
 *                       example: "Algèbre avancée, géométrie et analyse mathématique"
 *                     code:
 *                       type: string
 *                       example: "MATH_ADV"
 *                     seriesCoefficients:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           serieId:
 *                             type: string
 *                           seriesName:
 *                             type: string
 *                           coefficient:
 *                             type: number
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-15T15:45:00Z"
 *             examples:
 *               updated_with_series:
 *                 summary: Matière mise à jour avec séries
 *                 value:
 *                   success: true
 *                   message: "Matière modifiée avec succès"
 *                   subject:
 *                     id: "subj_1234567890"
 *                     name: "Mathématiques Avancées"
 *                     description: "Algèbre avancée, géométrie et analyse mathématique"
 *                     code: "MATH_ADV"
 *                     seriesCoefficients:
 *                       - serieId: "ser_0987654321"
 *                         seriesName: "Série S"
 *                         coefficient: 5
 *                       - serieId: "ser_1111111111"
 *                         seriesName: "Série ES"
 *                         coefficient: 4
 *                     updatedAt: "2023-12-15T15:45:00Z"
 *       400:
 *         description: Données de requête invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_name:
 *                 summary: Nom manquant
 *                 value:
 *                   success: false
 *                   message: "Le nom de la matière est obligatoire"
 *                   error: "MISSING_REQUIRED_FIELD"
 *               invalid_id:
 *                 summary: ID invalide
 *                 value:
 *                   success: false
 *                   message: "Format d'ID de matière invalide"
 *                   error: "INVALID_ID_FORMAT"
 *       401:
 *         description: Non autorisé - Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Token d'accès requis"
 *               error: "UNAUTHORIZED"
 *       403:
 *         description: Accès refusé - Seuls les administrateurs peuvent modifier des matières
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Accès réservé aux administrateurs"
 *               error: "ADMIN_REQUIRED"
 *       404:
 *         description: Matière non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Matière non trouvée"
 *               error: "SUBJECT_NOT_FOUND"
 *       409:
 *         description: Conflit - Nom de matière déjà utilisé par une autre matière
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Une autre matière utilise déjà ce nom"
 *               error: "SUBJECT_NAME_CONFLICT"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de la modification de la matière"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.put('/:id', requireRole('admin'), subjectController.updateSubject);

/**
 * @swagger
 * /subjects/{id}:
 *   delete:
 *     summary: Supprimer définitivement une matière du système
 *     description: |
 *       Supprime complètement une matière et toutes ses dépendances grâce à la cascade SQL.
 *       
 *       **⚠️ ATTENTION: Cette action est irréversible!**
 *       
 *       **Éléments supprimés automatiquement:**
 *       - La matière elle-même
 *       - Toutes les assignations aux séries (table subject_coefficients)
 *       - Toutes les notes associées à cette matière
 *       - Toutes les recommandations liées à cette matière
 *       
 *       **Permissions requises:** Administrateur uniquement
 *       
 *       **Vérifications avant suppression:**
 *       - Existence de la matière
 *       - Validation des permissions administrateur
 *       - Confirmation de la cascade SQL
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^subj_[0-9]+$'
 *         description: Identifiant unique de la matière à supprimer
 *         example: "subj_1234567890"
 *     responses:
 *       200:
 *         description: Matière supprimée avec succès
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
 *                   example: "Matière supprimée avec succès"
 *                 deletedSubject:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "subj_1234567890"
 *                     name:
 *                       type: string
 *                       example: "Mathématiques"
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-15T16:30:00Z"
 *                 cascadeInfo:
 *                   type: object
 *                   properties:
 *                     seriesAssignments:
 *                       type: integer
 *                       description: Nombre d'assignations de séries supprimées
 *                       example: 3
 *                     notes:
 *                       type: integer
 *                       description: Nombre de notes supprimées
 *                       example: 156
 *                     recommendations:
 *                       type: integer
 *                       description: Nombre de recommandations supprimées
 *                       example: 12
 *             examples:
 *               successful_deletion:
 *                 summary: Suppression réussie avec cascade
 *                 value:
 *                   success: true
 *                   message: "Matière supprimée avec succès"
 *                   deletedSubject:
 *                     id: "subj_1234567890"
 *                     name: "Mathématiques"
 *                     deletedAt: "2023-12-15T16:30:00Z"
 *                   cascadeInfo:
 *                     seriesAssignments: 3
 *                     notes: 156
 *                     recommendations: 12
 *               deletion_no_dependencies:
 *                 summary: Suppression sans dépendances
 *                 value:
 *                   success: true
 *                   message: "Matière supprimée avec succès"
 *                   deletedSubject:
 *                     id: "subj_3456789012"
 *                     name: "Arts Plastiques"
 *                     deletedAt: "2023-12-15T16:30:00Z"
 *                   cascadeInfo:
 *                     seriesAssignments: 0
 *                     notes: 0
 *                     recommendations: 0
 *       400:
 *         description: ID de matière invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Format d'ID de matière invalide"
 *               error: "INVALID_ID_FORMAT"
 *       401:
 *         description: Non autorisé - Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Token d'accès requis"
 *               error: "UNAUTHORIZED"
 *       403:
 *         description: Accès refusé - Seuls les administrateurs peuvent supprimer des matières
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Accès réservé aux administrateurs"
 *               error: "ADMIN_REQUIRED"
 *       404:
 *         description: Matière non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Matière non trouvée"
 *               error: "SUBJECT_NOT_FOUND"
 *       500:
 *         description: Erreur interne du serveur lors de la suppression
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de la suppression de la matière"
 *               error: "DELETION_FAILED"
 */
router.delete('/:id', requireRole('admin'), subjectController.deleteSubject);

/**
 * @swagger
 * /subjects/{id}/coefficients:
 *   get:
 *     summary: Récupérer les coefficients d'une matière pour chaque série
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la matière
 *     responses:
 *       200:
 *         description: Coefficients par série pour la matière
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SeriesCoefficient'
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id/coefficients', subjectController.getSeriesCoefficientsForSubject);

module.exports = router;