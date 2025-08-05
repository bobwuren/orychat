const express = require("express");
const router = express.Router();
const universityController = require('../controllers/universityController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/requireRoleMiddleware');

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

/**
 * @swagger
 * /universities:
 *   get:
 *     summary: Récupérer toutes les universités avec leurs diplômes associés
 *     description: |
 *       Récupère la liste complète de toutes les universités du système avec leurs diplômes associés.
 *       
 *       **Fonctionnalités:**
 *       - Liste complète des universités
 *       - Informations détaillées pour chaque université
 *       - Diplômes associés à chaque université
 *       - Statut de sponsor pour chaque université
 *       - Support de la pagination et du filtrage
 *       
 *       **Permissions requises:** Utilisateur authentifié (admin ou client)
 *     tags: [Universities]
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
 *           default: 20
 *         description: Nombre d'éléments par page
 *         example: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Terme de recherche pour filtrer par nom d'université
 *         example: "Sorbonne"
 *       - in: query
 *         name: sponsorOnly
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Filtrer uniquement les universités sponsors
 *         example: true
 *     responses:
 *       200:
 *         description: Liste des universités récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 universities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UniversityWithDegrees'
 *                 count:
 *                   type: integer
 *                   description: Nombre total d'universités
 *                   example: 45
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
 *                   example: "Universités récupérées avec succès"
 *             examples:
 *               success:
 *                 summary: Récupération réussie
 *                 value:
 *                   success: true
 *                   universities:
 *                     - id: "univ_1234567890"
 *                       name: "Université de la Sorbonne"
 *                       description: "Université prestigieuse de Paris"
 *                       location: "Paris, France"
 *                       website: "https://www.sorbonne-universite.fr"
 *                       isSponsor: true
 *                       logo: "https://example.com/sorbonne-logo.png"
 *                       degrees:
 *                         - id: "deg_1111111111"
 *                           name: "Master en Informatique"
 *                           level: "Master"
 *                           duration: "2 ans"
 *                         - id: "deg_2222222222"
 *                           name: "Licence en Mathématiques"
 *                           level: "Licence"
 *                           duration: "3 ans"
 *                       createdAt: "2023-01-15T10:30:00Z"
 *                       updatedAt: "2023-06-20T14:45:00Z"
 *                     - id: "univ_2345678901"
 *                       name: "École Polytechnique"
 *                       description: "Grande école d'ingénieurs"
 *                       location: "Palaiseau, France"
 *                       website: "https://www.polytechnique.edu"
 *                       isSponsor: false
 *                       logo: null
 *                       degrees:
 *                         - id: "deg_3333333333"
 *                           name: "Diplôme d'Ingénieur"
 *                           level: "Master"
 *                           duration: "3 ans"
 *                       createdAt: "2023-02-10T09:15:00Z"
 *                       updatedAt: "2023-02-10T09:15:00Z"
 *                   count: 45
 *                   totalPages: 3
 *                   currentPage: 1
 *                   message: "Universités récupérées avec succès"
 *               empty:
 *                 summary: Aucune université trouvée
 *                 value:
 *                   success: true
 *                   universities: []
 *                   count: 0
 *                   totalPages: 0
 *                   currentPage: 1
 *                   message: "Aucune université trouvée"
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
 *               message: "Erreur lors de la récupération des universités"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.get('/', universityController.getAll);

/**
 * @swagger
 * /universities/sponsors:
 *   get:
 *     summary: Récupérer toutes les universités sponsors du système
 *     description: |
 *       Récupère exclusivement les universités qui ont le statut de sponsor avec leurs diplômes associés.
 *       
 *       **Fonctionnalités:**
 *       - Filtrage automatique sur le statut sponsor
 *       - Informations complètes des universités sponsors
 *       - Diplômes proposés par chaque université sponsor
 *       - Données de contact et liens utiles
 *       
 *       **Permissions requises:** Utilisateur authentifié (admin ou client)
 *       
 *       **Cas d'usage:**
 *       - Affichage des partenaires du système
 *       - Recherche d'universités partenaires
 *       - Génération de rapports sponsors
 *     tags: [Universities]
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
 *           default: 20
 *         description: Nombre d'éléments par page
 *         example: 20
 *     responses:
 *       200:
 *         description: Liste des universités sponsors récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 sponsors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UniversityWithDegrees'
 *                 count:
 *                   type: integer
 *                   description: Nombre total d'universités sponsors
 *                   example: 12
 *                 message:
 *                   type: string
 *                   example: "Universités sponsors récupérées avec succès"
 *             examples:
 *               with_sponsors:
 *                 summary: Universités sponsors trouvées
 *                 value:
 *                   success: true
 *                   sponsors:
 *                     - id: "univ_1234567890"
 *                       name: "Université de la Sorbonne"
 *                       description: "Université prestigieuse de Paris"
 *                       location: "Paris, France"
 *                       website: "https://www.sorbonne-universite.fr"
 *                       isSponsor: true
 *                       logo: "https://example.com/sorbonne-logo.png"
 *                       sponsorshipLevel: "Gold"
 *                       partnershipDate: "2023-01-15T10:30:00Z"
 *                       degrees:
 *                         - id: "deg_1111111111"
 *                           name: "Master en Informatique"
 *                           level: "Master"
 *                           duration: "2 ans"
 *                       createdAt: "2023-01-15T10:30:00Z"
 *                       updatedAt: "2023-06-20T14:45:00Z"
 *                   count: 12
 *                   message: "Universités sponsors récupérées avec succès"
 *               no_sponsors:
 *                 summary: Aucune université sponsor
 *                 value:
 *                   success: true
 *                   sponsors: []
 *                   count: 0
 *                   message: "Aucune université sponsor trouvée"
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
 *               message: "Erreur lors de la récupération des universités sponsors"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.get('/sponsors', universityController.getAllSponsors);

/**
 * @swagger
 * /universities/{id}:
 *   get:
 *     summary: Récupérer une université spécifique par son ID
 *     description: |
 *       Récupère les informations détaillées d'une université spécifique avec tous ses diplômes associés.
 *       
 *       **Fonctionnalités:**
 *       - Informations complètes de l'université
 *       - Liste de tous les diplômes proposés
 *       - Données de contact et localisation
 *       - Statut de sponsor et informations de partenariat
 *       - Gestion des erreurs 404 si l'université n'existe pas
 *       
 *       **Permissions requises:** Utilisateur authentifié (admin ou client)
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^univ_[0-9]+$'
 *         description: Identifiant unique de l'université (format univ_xxxxxxxxxx)
 *         example: "univ_1234567890"
 *     responses:
 *       200:
 *         description: Université récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 university:
 *                   $ref: '#/components/schemas/UniversityWithDegrees'
 *                 message:
 *                   type: string
 *                   example: "Université récupérée avec succès"
 *             examples:
 *               sponsor_university:
 *                 summary: Université sponsor avec diplômes
 *                 value:
 *                   success: true
 *                   university:
 *                     id: "univ_1234567890"
 *                     name: "Université de la Sorbonne"
 *                     description: "Université prestigieuse de Paris spécialisée en sciences humaines et sciences exactes"
 *                     location: "Paris, France"
 *                     address: "21 Rue de l'École de Médecine, 75006 Paris"
 *                     website: "https://www.sorbonne-universite.fr"
 *                     email: "contact@sorbonne-universite.fr"
 *                     phone: "+33 1 44 27 44 27"
 *                     isSponsor: true
 *                     sponsorshipLevel: "Gold"
 *                     logo: "https://example.com/sorbonne-logo.png"
 *                     ranking: 25
 *                     studentCount: 55000
 *                     establishedYear: 1257
 *                     degrees:
 *                       - id: "deg_1111111111"
 *                         name: "Master en Informatique"
 *                         level: "Master"
 *                         duration: "2 ans"
 *                         description: "Formation avancée en informatique"
 *                         specializations: ["IA", "Cybersécurité", "Développement"]
 *                       - id: "deg_2222222222"
 *                         name: "Licence en Mathématiques"
 *                         level: "Licence"
 *                         duration: "3 ans"
 *                         description: "Formation fondamentale en mathématiques"
 *                         specializations: ["Algèbre", "Analyse", "Probabilités"]
 *                     createdAt: "2023-01-15T10:30:00Z"
 *                     updatedAt: "2023-06-20T14:45:00Z"
 *                   message: "Université récupérée avec succès"
 *               regular_university:
 *                 summary: Université non-sponsor
 *                 value:
 *                   success: true
 *                   university:
 *                     id: "univ_2345678901"
 *                     name: "École Polytechnique"
 *                     description: "Grande école d'ingénieurs française"
 *                     location: "Palaiseau, France"
 *                     address: "Route de Saclay, 91128 Palaiseau"
 *                     website: "https://www.polytechnique.edu"
 *                     email: "info@polytechnique.edu"
 *                     phone: "+33 1 69 33 33 33"
 *                     isSponsor: false
 *                     sponsorshipLevel: null
 *                     logo: null
 *                     ranking: 8
 *                     studentCount: 2800
 *                     establishedYear: 1794
 *                     degrees:
 *                       - id: "deg_3333333333"
 *                         name: "Diplôme d'Ingénieur"
 *                         level: "Master"
 *                         duration: "3 ans"
 *                         description: "Formation d'ingénieur généraliste"
 *                         specializations: ["Mathématiques", "Physique", "Informatique"]
 *                     createdAt: "2023-02-10T09:15:00Z"
 *                     updatedAt: "2023-02-10T09:15:00Z"
 *                   message: "Université récupérée avec succès"
 *       400:
 *         description: ID d'université invalide
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
 *         description: Université non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Université non trouvée"
 *               error: "UNIVERSITY_NOT_FOUND"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de la récupération de l'université"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.get('/:id', universityController.getById);

/**
 * @swagger
 * /universities:
 *   post:
 *     summary: Créer une nouvelle université dans le système
 *     description: |
 *       Crée une nouvelle université avec toutes ses informations et la possibilité d'associer des diplômes.
 *       
 *       **Fonctionnalités:**
 *       - Création d'université avec informations complètes
 *       - Définition du statut de sponsor
 *       - Association optionnelle de diplômes existants
 *       - Validation de l'unicité du nom
 *       - Génération automatique d'un ID unique
 *       
 *       **Permissions requises:** Administrateur uniquement
 *       
 *       **Règles de validation:**
 *       - Nom obligatoire (2-200 caractères)
 *       - Localisation obligatoire
 *       - Email et website optionnels mais validés si fournis
 *       - Vérification de l'existence des diplômes référencés
 *     tags: [Universities]
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
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 200
 *                 description: Nom de l'université (obligatoire et unique)
 *                 example: "Université de la Sorbonne"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Description détaillée de l'université
 *                 example: "Université prestigieuse de Paris spécialisée en sciences humaines et sciences exactes"
 *               location:
 *                 type: string
 *                 maxLength: 200
 *                 description: Localisation de l'université (obligatoire)
 *                 example: "Paris, France"
 *               address:
 *                 type: string
 *                 maxLength: 300
 *                 description: Adresse complète de l'université
 *                 example: "21 Rue de l'École de Médecine, 75006 Paris"
 *               website:
 *                 type: string
 *                 format: uri
 *                 description: Site web officiel de l'université
 *                 example: "https://www.sorbonne-universite.fr"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de contact principal
 *                 example: "contact@sorbonne-universite.fr"
 *               phone:
 *                 type: string
 *                 maxLength: 20
 *                 description: Numéro de téléphone principal
 *                 example: "+33 1 44 27 44 27"
 *               isSponsor:
 *                 type: boolean
 *                 default: false
 *                 description: Statut de sponsor de l'université
 *                 example: true
 *               sponsorshipLevel:
 *                 type: string
 *                 enum: ["Bronze", "Silver", "Gold", "Platinum"]
 *                 description: Niveau de sponsoring (si sponsor)
 *                 example: "Gold"
 *               logo:
 *                 type: string
 *                 format: uri
 *                 description: URL du logo de l'université
 *                 example: "https://example.com/sorbonne-logo.png"
 *               ranking:
 *                 type: integer
 *                 minimum: 1
 *                 description: Classement mondial de l'université
 *                 example: 25
 *               studentCount:
 *                 type: integer
 *                 minimum: 0
 *                 description: Nombre d'étudiants inscrits
 *                 example: 55000
 *               establishedYear:
 *                 type: integer
 *                 minimum: 800
 *                 maximum: 2025
 *                 description: Année de fondation
 *                 example: 1257
 *               degreeIds:
 *                 type: array
 *                 description: Liste des IDs de diplômes à associer (optionnel)
 *                 items:
 *                   type: string
 *                   pattern: '^deg_[0-9]+$'
 *                 example: ["deg_1111111111", "deg_2222222222"]
 *           examples:
 *             complete_university:
 *               summary: Université complète avec sponsoring
 *               value:
 *                 name: "Université de la Sorbonne"
 *                 description: "Université prestigieuse de Paris spécialisée en sciences humaines et sciences exactes"
 *                 location: "Paris, France"
 *                 address: "21 Rue de l'École de Médecine, 75006 Paris"
 *                 website: "https://www.sorbonne-universite.fr"
 *                 email: "contact@sorbonne-universite.fr"
 *                 phone: "+33 1 44 27 44 27"
 *                 isSponsor: true
 *                 sponsorshipLevel: "Gold"
 *                 logo: "https://example.com/sorbonne-logo.png"
 *                 ranking: 25
 *                 studentCount: 55000
 *                 establishedYear: 1257
 *                 degreeIds: ["deg_1111111111", "deg_2222222222"]
 *             basic_university:
 *               summary: Université basique sans sponsoring
 *               value:
 *                 name: "École Polytechnique"
 *                 description: "Grande école d'ingénieurs française"
 *                 location: "Palaiseau, France"
 *                 website: "https://www.polytechnique.edu"
 *                 isSponsor: false
 *                 ranking: 8
 *                 studentCount: 2800
 *                 establishedYear: 1794
 *     responses:
 *       201:
 *         description: Université créée avec succès
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
 *                   example: "Université créée avec succès"
 *                 university:
 *                   $ref: '#/components/schemas/UniversityWithDegrees'
 *             examples:
 *               created_with_degrees:
 *                 summary: Université créée avec diplômes
 *                 value:
 *                   success: true
 *                   message: "Université créée avec succès"
 *                   university:
 *                     id: "univ_1234567890"
 *                     name: "Université de la Sorbonne"
 *                     description: "Université prestigieuse de Paris"
 *                     location: "Paris, France"
 *                     website: "https://www.sorbonne-universite.fr"
 *                     isSponsor: true
 *                     sponsorshipLevel: "Gold"
 *                     degrees:
 *                       - id: "deg_1111111111"
 *                         name: "Master en Informatique"
 *                         level: "Master"
 *                         duration: "2 ans"
 *                     createdAt: "2023-12-15T14:30:00Z"
 *               created_basic:
 *                 summary: Université basique créée
 *                 value:
 *                   success: true
 *                   message: "Université créée avec succès"
 *                   university:
 *                     id: "univ_2345678901"
 *                     name: "École Polytechnique"
 *                     description: "Grande école d'ingénieurs française"
 *                     location: "Palaiseau, France"
 *                     isSponsor: false
 *                     degrees: []
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
 *                   message: "Le nom de l'université est obligatoire"
 *                   error: "MISSING_REQUIRED_FIELD"
 *               invalid_email:
 *                 summary: Email invalide
 *                 value:
 *                   success: false
 *                   message: "Format d'email invalide"
 *                   error: "INVALID_EMAIL_FORMAT"
 *               invalid_website:
 *                 summary: Website invalide
 *                 value:
 *                   success: false
 *                   message: "Format d'URL invalide pour le site web"
 *                   error: "INVALID_URL_FORMAT"
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
 *         description: Accès refusé - Seuls les administrateurs peuvent créer des universités
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Accès réservé aux administrateurs"
 *               error: "ADMIN_REQUIRED"
 *       409:
 *         description: Conflit - Nom d'université déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Une université avec ce nom existe déjà"
 *               error: "UNIVERSITY_NAME_EXISTS"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de la création de l'université"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.post('/', requireRole('admin'), universityController.createUniversity);

/**
 * @swagger
 * /universities/{id}:
 *   put:
 *     summary: Modifier une université existante
 *     description: |
 *       Met à jour les informations d'une université existante, y compris ses diplômes associés.
 *       
 *       **Fonctionnalités:**
 *       - Modification des informations de base de l'université
 *       - Mise à jour du statut de sponsor et niveau
 *       - Modification des diplômes associés
 *       - Validation de l'unicité du nom (sauf pour l'université elle-même)
 *       - Préservation de l'historique de modification
 *       
 *       **Permissions requises:** Administrateur uniquement
 *       
 *       **Règles de validation:**
 *       - Nom obligatoire (2-200 caractères)
 *       - Email et website optionnels mais validés si fournis
 *       - Vérification de l'existence des diplômes référencés
 *       - Préservation des données non modifiées
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^univ_[0-9]+$'
 *         description: Identifiant unique de l'université à modifier
 *         example: "univ_1234567890"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 200
 *                 description: Nom de l'université (obligatoire et unique)
 *                 example: "Université de la Sorbonne - Campus Principal"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Description détaillée de l'université
 *                 example: "Université prestigieuse de Paris spécialisée en sciences humaines et sciences exactes, avec campus international"
 *               location:
 *                 type: string
 *                 maxLength: 200
 *                 description: Localisation de l'université
 *                 example: "Paris, France"
 *               address:
 *                 type: string
 *                 maxLength: 300
 *                 description: Adresse complète de l'université
 *                 example: "21 Rue de l'École de Médecine, 75006 Paris"
 *               website:
 *                 type: string
 *                 format: uri
 *                 description: Site web officiel de l'université
 *                 example: "https://www.sorbonne-universite.fr"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de contact principal
 *                 example: "contact@sorbonne-universite.fr"
 *               phone:
 *                 type: string
 *                 maxLength: 20
 *                 description: Numéro de téléphone principal
 *                 example: "+33 1 44 27 44 27"
 *               isSponsor:
 *                 type: boolean
 *                 description: Statut de sponsor de l'université
 *                 example: true
 *               sponsorshipLevel:
 *                 type: string
 *                 enum: ["Bronze", "Silver", "Gold", "Platinum"]
 *                 description: Niveau de sponsoring (si sponsor)
 *                 example: "Platinum"
 *               logo:
 *                 type: string
 *                 format: uri
 *                 description: URL du logo de l'université
 *                 example: "https://example.com/sorbonne-new-logo.png"
 *               ranking:
 *                 type: integer
 *                 minimum: 1
 *                 description: Classement mondial de l'université
 *                 example: 22
 *               studentCount:
 *                 type: integer
 *                 minimum: 0
 *                 description: Nombre d'étudiants inscrits
 *                 example: 57000
 *               degreeIds:
 *                 type: array
 *                 description: Liste des IDs de diplômes à associer (remplace la liste existante)
 *                 items:
 *                   type: string
 *                   pattern: '^deg_[0-9]+$'
 *                 example: ["deg_1111111111", "deg_2222222222", "deg_4444444444"]
 *           examples:
 *             update_sponsor_status:
 *               summary: Mise à jour du statut sponsor
 *               value:
 *                 name: "Université de la Sorbonne - Campus Principal"
 *                 isSponsor: true
 *                 sponsorshipLevel: "Platinum"
 *                 ranking: 22
 *                 studentCount: 57000
 *             update_contact_info:
 *               summary: Mise à jour des informations de contact
 *               value:
 *                 email: "nouveau-contact@sorbonne-universite.fr"
 *                 phone: "+33 1 44 27 55 55"
 *                 website: "https://www.sorbonne-universite.fr/nouveau"
 *             add_degrees:
 *               summary: Ajout de nouveaux diplômes
 *               value:
 *                 degreeIds: ["deg_1111111111", "deg_2222222222", "deg_4444444444", "deg_5555555555"]
 *             remove_sponsor_status:
 *               summary: Suppression du statut sponsor
 *               value:
 *                 isSponsor: false
 *                 sponsorshipLevel: null
 *     responses:
 *       200:
 *         description: Université modifiée avec succès
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
 *                   example: "Université modifiée avec succès"
 *                 university:
 *                   $ref: '#/components/schemas/UniversityWithDegrees'
 *             examples:
 *               updated_with_new_degrees:
 *                 summary: Université mise à jour avec nouveaux diplômes
 *                 value:
 *                   success: true
 *                   message: "Université modifiée avec succès"
 *                   university:
 *                     id: "univ_1234567890"
 *                     name: "Université de la Sorbonne - Campus Principal"
 *                     description: "Université prestigieuse de Paris spécialisée en sciences humaines et sciences exactes, avec campus international"
 *                     location: "Paris, France"
 *                     isSponsor: true
 *                     sponsorshipLevel: "Platinum"
 *                     ranking: 22
 *                     studentCount: 57000
 *                     degrees:
 *                       - id: "deg_1111111111"
 *                         name: "Master en Informatique"
 *                         level: "Master"
 *                       - id: "deg_4444444444"
 *                         name: "Doctorat en Physique"
 *                         level: "Doctorat"
 *                     updatedAt: "2023-12-15T15:45:00Z"
 *       400:
 *         description: Données de requête invalides ou aucune donnée à modifier
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               no_data_to_update:
 *                 summary: Aucune donnée à modifier
 *                 value:
 *                   success: false
 *                   message: "Aucune donnée à modifier"
 *                   error: "NO_UPDATE_DATA"
 *               invalid_id:
 *                 summary: ID invalide
 *                 value:
 *                   success: false
 *                   message: "Format d'ID d'université invalide"
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
 *         description: Accès refusé - Seuls les administrateurs peuvent modifier des universités
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Accès réservé aux administrateurs"
 *               error: "ADMIN_REQUIRED"
 *       404:
 *         description: Université non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Université non trouvée"
 *               error: "UNIVERSITY_NOT_FOUND"
 *       409:
 *         description: Conflit - Nom d'université déjà utilisé par une autre université
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Une autre université utilise déjà ce nom"
 *               error: "UNIVERSITY_NAME_CONFLICT"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de la modification de l'université"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.put('/:id', requireRole('admin'), universityController.updateUniversity);

/**
 * @swagger
 * /universities/{id}:
 *   delete:
 *     summary: Supprimer définitivement une université du système
 *     description: |
 *       Supprime complètement une université et toutes ses dépendances grâce à la cascade SQL.
 *       
 *       **⚠️ ATTENTION: Cette action est irréversible!**
 *       
 *       **Éléments supprimés automatiquement:**
 *       - L'université elle-même
 *       - Toutes les associations université-diplômes
 *       - Toutes les recommandations liées à cette université
 *       - Toutes les notes/évaluations associées
 *       
 *       **Permissions requises:** Administrateur uniquement
 *       
 *       **Vérifications avant suppression:**
 *       - Existence de l'université
 *       - Validation des permissions administrateur
 *       - Confirmation de la cascade SQL
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^univ_[0-9]+$'
 *         description: Identifiant unique de l'université à supprimer
 *         example: "univ_1234567890"
 *     responses:
 *       204:
 *         description: Université supprimée avec succès (pas de contenu retourné)
 *         headers:
 *           X-Deletion-Info:
 *             schema:
 *               type: string
 *             description: Informations sur la suppression
 *             example: "University deleted with cascade operations"
 *       200:
 *         description: Université supprimée avec succès (avec informations détaillées)
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
 *                   example: "Université supprimée avec succès"
 *                 deletedUniversity:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "univ_1234567890"
 *                     name:
 *                       type: string
 *                       example: "Université de la Sorbonne"
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-15T16:30:00Z"
 *                 cascadeInfo:
 *                   type: object
 *                   properties:
 *                     degreeAssociations:
 *                       type: integer
 *                       description: Nombre d'associations université-diplômes supprimées
 *                       example: 5
 *                     recommendations:
 *                       type: integer
 *                       description: Nombre de recommandations supprimées
 *                       example: 23
 *                     studentRecords:
 *                       type: integer
 *                       description: Nombre d'enregistrements étudiants supprimés
 *                       example: 156
 *             examples:
 *               successful_deletion:
 *                 summary: Suppression réussie avec cascade
 *                 value:
 *                   success: true
 *                   message: "Université supprimée avec succès"
 *                   deletedUniversity:
 *                     id: "univ_1234567890"
 *                     name: "Université de la Sorbonne"
 *                     deletedAt: "2023-12-15T16:30:00Z"
 *                   cascadeInfo:
 *                     degreeAssociations: 5
 *                     recommendations: 23
 *                     studentRecords: 156
 *               deletion_no_dependencies:
 *                 summary: Suppression sans dépendances
 *                 value:
 *                   success: true
 *                   message: "Université supprimée avec succès"
 *                   deletedUniversity:
 *                     id: "univ_2345678901"
 *                     name: "École Polytechnique"
 *                     deletedAt: "2023-12-15T16:30:00Z"
 *                   cascadeInfo:
 *                     degreeAssociations: 0
 *                     recommendations: 0
 *                     studentRecords: 0
 *       400:
 *         description: ID d'université invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Format d'ID d'université invalide"
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
 *         description: Accès refusé - Seuls les administrateurs peuvent supprimer des universités
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Accès réservé aux administrateurs"
 *               error: "ADMIN_REQUIRED"
 *       404:
 *         description: Université non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Université non trouvée"
 *               error: "UNIVERSITY_NOT_FOUND"
 *       500:
 *         description: Erreur interne du serveur lors de la suppression
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de la suppression de l'université"
 *               error: "DELETION_FAILED"
 */
router.delete('/:id', requireRole('admin'), universityController.delete);

/**
 * @swagger
 * /universities/{id}/degrees:
 *   post:
 *     summary: Associer un diplôme existant à une université
 *     description: |
 *       Crée une association entre une université et un diplôme existant dans le système.
 *       
 *       **Fonctionnalités:**
 *       - Association université-diplôme bidirectionnelle
 *       - Validation de l'existence de l'université et du diplôme
 *       - Prévention des doublons d'association
 *       - Mise à jour automatique des relations
 *       
 *       **Permissions requises:** Administrateur uniquement
 *       
 *       **Règles de validation:**
 *       - Université et diplôme doivent exister
 *       - Association ne doit pas déjà exister
 *       - Vérification des permissions administrateur
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^univ_[0-9]+$'
 *         description: Identifiant unique de l'université
 *         example: "univ_1234567890"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - degreeId
 *             properties:
 *               degreeId:
 *                 type: string
 *                 pattern: '^deg_[0-9]+$'
 *                 description: ID du diplôme à associer à l'université
 *                 example: "deg_1111111111"
 *           examples:
 *             associate_degree:
 *               summary: Association d'un diplôme
 *               value:
 *                 degreeId: "deg_1111111111"
 *     responses:
 *       200:
 *         description: Diplôme associé à l'université avec succès
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
 *                   example: "Diplôme associé à l'université avec succès"
 *                 university:
 *                   $ref: '#/components/schemas/UniversityWithDegrees'
 *                 association:
 *                   type: object
 *                   properties:
 *                     universityId:
 *                       type: string
 *                       example: "univ_1234567890"
 *                     degreeId:
 *                       type: string
 *                       example: "deg_1111111111"
 *                     associatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-15T14:30:00Z"
 *             examples:
 *               successful_association:
 *                 summary: Association réussie
 *                 value:
 *                   success: true
 *                   message: "Diplôme associé à l'université avec succès"
 *                   university:
 *                     id: "univ_1234567890"
 *                     name: "Université de la Sorbonne"
 *                     degrees:
 *                       - id: "deg_1111111111"
 *                         name: "Master en Informatique"
 *                         level: "Master"
 *                         duration: "2 ans"
 *                       - id: "deg_2222222222"
 *                         name: "Licence en Mathématiques"
 *                         level: "Licence"
 *                         duration: "3 ans"
 *                   association:
 *                     universityId: "univ_1234567890"
 *                     degreeId: "deg_1111111111"
 *                     associatedAt: "2023-12-15T14:30:00Z"
 *       400:
 *         description: Données de requête invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_degree_id:
 *                 summary: ID de diplôme manquant
 *                 value:
 *                   success: false
 *                   message: "degreeId est requis"
 *                   error: "MISSING_DEGREE_ID"
 *               invalid_degree_id:
 *                 summary: Format d'ID invalide
 *                 value:
 *                   success: false
 *                   message: "Format d'ID de diplôme invalide"
 *                   error: "INVALID_DEGREE_ID_FORMAT"
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
 *         description: Accès refusé - Seuls les administrateurs peuvent associer des diplômes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Accès réservé aux administrateurs"
 *               error: "ADMIN_REQUIRED"
 *       404:
 *         description: Université ou diplôme non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               university_not_found:
 *                 summary: Université non trouvée
 *                 value:
 *                   success: false
 *                   message: "Université non trouvée"
 *                   error: "UNIVERSITY_NOT_FOUND"
 *               degree_not_found:
 *                 summary: Diplôme non trouvé
 *                 value:
 *                   success: false
 *                   message: "Diplôme non trouvé"
 *                   error: "DEGREE_NOT_FOUND"
 *       409:
 *         description: Association déjà existante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Ce diplôme est déjà associé à cette université"
 *               error: "ASSOCIATION_ALREADY_EXISTS"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de l'association du diplôme"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.post('/:id/degrees', requireRole('admin'), universityController.addDegree);

/**
 * @swagger
 * /universities/{id}/degrees:
 *   delete:
 *     summary: Supprimer l'association entre une université et un diplôme
 *     description: |
 *       Supprime l'association entre une université et un diplôme spécifique, sans supprimer les entités elles-mêmes.
 *       
 *       **Fonctionnalités:**
 *       - Suppression de l'association université-diplôme uniquement
 *       - Préservation de l'université et du diplôme
 *       - Validation de l'existence de l'association
 *       - Mise à jour automatique des relations
 *       
 *       **Permissions requises:** Administrateur uniquement
 *       
 *       **Règles de validation:**
 *       - Association doit exister
 *       - Université et diplôme doivent exister
 *       - Vérification des permissions administrateur
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^univ_[0-9]+$'
 *         description: Identifiant unique de l'université
 *         example: "univ_1234567890"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - degreeId
 *             properties:
 *               degreeId:
 *                 type: string
 *                 pattern: '^deg_[0-9]+$'
 *                 description: ID du diplôme à dissocier de l'université
 *                 example: "deg_1111111111"
 *           examples:
 *             dissociate_degree:
 *               summary: Dissociation d'un diplôme
 *               value:
 *                 degreeId: "deg_1111111111"
 *     responses:
 *       200:
 *         description: Diplôme dissocié de l'université avec succès
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
 *                   example: "Diplôme supprimé de l'université avec succès"
 *                 university:
 *                   $ref: '#/components/schemas/UniversityWithDegrees'
 *                 removedAssociation:
 *                   type: object
 *                   properties:
 *                     universityId:
 *                       type: string
 *                       example: "univ_1234567890"
 *                     degreeId:
 *                       type: string
 *                       example: "deg_1111111111"
 *                     removedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-15T14:30:00Z"
 *             examples:
 *               successful_dissociation:
 *                 summary: Dissociation réussie
 *                 value:
 *                   success: true
 *                   message: "Diplôme supprimé de l'université avec succès"
 *                   university:
 *                     id: "univ_1234567890"
 *                     name: "Université de la Sorbonne"
 *                     degrees:
 *                       - id: "deg_2222222222"
 *                         name: "Licence en Mathématiques"
 *                         level: "Licence"
 *                         duration: "3 ans"
 *                   removedAssociation:
 *                     universityId: "univ_1234567890"
 *                     degreeId: "deg_1111111111"
 *                     removedAt: "2023-12-15T14:30:00Z"
 *               no_remaining_degrees:
 *                 summary: Université sans diplômes après suppression
 *                 value:
 *                   success: true
 *                   message: "Diplôme supprimé de l'université avec succès"
 *                   university:
 *                     id: "univ_2345678901"
 *                     name: "École Polytechnique"
 *                     degrees: []
 *                   removedAssociation:
 *                     universityId: "univ_2345678901"
 *                     degreeId: "deg_3333333333"
 *                     removedAt: "2023-12-15T14:30:00Z"
 *       400:
 *         description: Données de requête invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_degree_id:
 *                 summary: ID de diplôme manquant
 *                 value:
 *                   success: false
 *                   message: "degreeId est requis"
 *                   error: "MISSING_DEGREE_ID"
 *               invalid_degree_id:
 *                 summary: Format d'ID invalide
 *                 value:
 *                   success: false
 *                   message: "Format d'ID de diplôme invalide"
 *                   error: "INVALID_DEGREE_ID_FORMAT"
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
 *         description: Accès refusé - Seuls les administrateurs peuvent dissocier des diplômes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Accès réservé aux administrateurs"
 *               error: "ADMIN_REQUIRED"
 *       404:
 *         description: Université, diplôme ou association non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               university_not_found:
 *                 summary: Université non trouvée
 *                 value:
 *                   success: false
 *                   message: "Université non trouvée"
 *                   error: "UNIVERSITY_NOT_FOUND"
 *               degree_not_found:
 *                 summary: Diplôme non trouvé
 *                 value:
 *                   success: false
 *                   message: "Diplôme non trouvé"
 *                   error: "DEGREE_NOT_FOUND"
 *               association_not_found:
 *                 summary: Association non trouvée
 *                 value:
 *                   success: false
 *                   message: "Cette association n'existe pas"
 *                   error: "ASSOCIATION_NOT_FOUND"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de la suppression de l'association"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.delete('/:id/degrees', requireRole('admin'), universityController.removeDegree);

/**
 * @swagger
 * /universities/sponsors-by-degree:
 *   get:
 *     summary: Obtenir les universités partenaires pour un diplôme spécifique
 *     description: |
 *       Récupère toutes les universités partenaires (sponsors) qui proposent un diplôme donné.
 *       
 *       **Fonctionnalités:**
 *       - Filtrage par diplôme spécifique via degreeId
 *       - Retour uniquement des universités sponsors (sponsor = true)
 *       - Informations complètes sur chaque université
 *       - Tri alphabétique par nom d'université
 *       
 *       **Cas d'utilisation:**
 *       - Recherche d'universités partenaires pour un diplôme précis
 *       - Affichage des options de formation chez les partenaires
 *       - Interface de sélection d'université pour un diplôme
 *       
 *       **Permissions:** Accès libre (aucune authentification requise)
 *     tags: [Universities]
 *     parameters:
 *       - in: query
 *         name: degreeId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^deg_[0-9]+$'
 *         description: Identifiant unique du diplôme pour lequel chercher les universités partenaires
 *         example: "deg_1111111111"
 *     responses:
 *       200:
 *         description: Liste des universités partenaires pour le diplôme récupérée avec succès
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
 *                   example: "Universités partenaires trouvées pour le diplôme"
 *                 degree:
 *                   $ref: '#/components/schemas/Degree'
 *                 universities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/University'
 *                 count:
 *                   type: integer
 *                   description: Nombre d'universités partenaires trouvées
 *                   example: 3
 *             examples:
 *               universities_found:
 *                 summary: Universités partenaires trouvées
 *                 value:
 *                   success: true
 *                   message: "Universités partenaires trouvées pour le diplôme"
 *                   degree:
 *                     id: "deg_1111111111"
 *                     name: "Licence en Informatique"
 *                     level: "Licence"
 *                     duration: "3 ans"
 *                     description: "Formation en informatique fondamentale"
 *                   universities:
 *                     - id: "univ_1234567890"
 *                       name: "Université Paris-Saclay"
 *                       address: "91190 Gif-sur-Yvette"
 *                       website: "https://www.universite-paris-saclay.fr"
 *                       sponsor: true
 *                       phone: "+33 1 69 15 78 00"
 *                       email: "contact@universite-paris-saclay.fr"
 *                     - id: "univ_2345678901"
 *                       name: "École Polytechnique"
 *                       address: "91128 Palaiseau"
 *                       website: "https://www.polytechnique.edu"
 *                       sponsor: true
 *                       phone: "+33 1 69 33 33 33"
 *                       email: "contact@polytechnique.edu"
 *                   count: 2
 *               no_universities_found:
 *                 summary: Aucune université partenaire trouvée
 *                 value:
 *                   success: true
 *                   message: "Aucune université partenaire trouvée pour ce diplôme"
 *                   degree:
 *                     id: "deg_2222222222"
 *                     name: "Master en Philosophie"
 *                     level: "Master"
 *                     duration: "2 ans"
 *                   universities: []
 *                   count: 0
 *       400:
 *         description: Paramètre degreeId manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_degree_id:
 *                 summary: degreeId manquant
 *                 value:
 *                   success: false
 *                   message: "degreeId est requis"
 *                   error: "MISSING_DEGREE_ID"
 *               invalid_degree_id:
 *                 summary: Format d'ID invalide
 *                 value:
 *                   success: false
 *                   message: "Format d'ID de diplôme invalide"
 *                   error: "INVALID_DEGREE_ID_FORMAT"
 *       404:
 *         description: Diplôme non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Diplôme non trouvé"
 *               error: "DEGREE_NOT_FOUND"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de la récupération des universités partenaires"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.get('/sponsors-by-degree', universityController.getSponsorsByDegree);

/**
 * @swagger
 * /universities/export:
 *   get:
 *     summary: Exporter toutes les universités avec leurs diplômes
 *     description: |
 *       Exporte la liste complète des universités avec leurs diplômes associés dans le format spécifié.
 *       
 *       **Fonctionnalités:**
 *       - Export au format CSV ou JSON
 *       - Inclusion des diplômes associés pour chaque université
 *       - Données complètes (informations de contact, statut sponsor, etc.)
 *       - Tri alphabétique par nom d'université
 *       
 *       **Formats supportés:**
 *       - **JSON**: Structure complète avec objets imbriqués
 *       - **CSV**: Format tabulaire avec colonnes séparées
 *       
 *       **Cas d'utilisation:**
 *       - Sauvegarde de données
 *       - Import dans d'autres systèmes
 *       - Analyse de données externe
 *       - Reporting et statistiques
 *       
 *       **Permissions requises:** Administrateur uniquement
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         required: false
 *         schema:
 *           type: string
 *           enum: [csv, json]
 *           default: json
 *         description: Format d'export des données
 *         example: "json"
 *     responses:
 *       200:
 *         description: Universités exportées avec succès
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
 *                   example: "Universités exportées avec succès"
 *                 format:
 *                   type: string
 *                   example: "json"
 *                 count:
 *                   type: integer
 *                   description: Nombre total d'universités exportées
 *                   example: 25
 *                 exportedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-15T14:30:00Z"
 *                 universities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UniversityWithDegrees'
 *             examples:
 *               json_export:
 *                 summary: Export JSON réussi
 *                 value:
 *                   success: true
 *                   message: "Universités exportées avec succès"
 *                   format: "json"
 *                   count: 2
 *                   exportedAt: "2023-12-15T14:30:00Z"
 *                   universities:
 *                     - id: "univ_1234567890"
 *                       name: "Université Paris-Saclay"
 *                       address: "91190 Gif-sur-Yvette"
 *                       website: "https://www.universite-paris-saclay.fr"
 *                       sponsor: true
 *                       degrees:
 *                         - id: "deg_1111111111"
 *                           name: "Licence en Informatique"
 *                           level: "Licence"
 *                           duration: "3 ans"
 *                     - id: "univ_2345678901"
 *                       name: "École Polytechnique"
 *                       address: "91128 Palaiseau"
 *                       website: "https://www.polytechnique.edu"
 *                       sponsor: true
 *                       degrees: []
 *           text/csv:
 *             schema:
 *               type: string
 *               description: Données au format CSV avec en-têtes
 *               example: |
 *                 id,name,address,website,phone,email,sponsor,degrees_count,degree_names
 *                 univ_1234567890,"Université Paris-Saclay","91190 Gif-sur-Yvette","https://www.universite-paris-saclay.fr","+33169157800","contact@universite-paris-saclay.fr",true,1,"Licence en Informatique"
 *                 univ_2345678901,"École Polytechnique","91128 Palaiseau","https://www.polytechnique.edu","+33169333333","contact@polytechnique.edu",true,0,""
 *             examples:
 *               csv_export:
 *                 summary: Export CSV réussi
 *                 value: |
 *                   id,name,address,website,phone,email,sponsor,degrees_count,degree_names
 *                   univ_1234567890,"Université Paris-Saclay","91190 Gif-sur-Yvette","https://www.universite-paris-saclay.fr","+33169157800","contact@universite-paris-saclay.fr",true,1,"Licence en Informatique"
 *                   univ_2345678901,"École Polytechnique","91128 Palaiseau","https://www.polytechnique.edu","+33169333333","contact@polytechnique.edu",true,0,""
 *       400:
 *         description: Format d'export invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Format d'export invalide. Formats supportés: csv, json"
 *               error: "INVALID_EXPORT_FORMAT"
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
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de l'export des universités"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.get('/export', universityController.exportAll);

/**
 * @swagger
 * /universities/{id}/degrees:
 *   get:
 *     summary: Récupérer tous les diplômes proposés par une université
 *     description: |
 *       Récupère la liste complète des diplômes proposés par une université spécifique.
 *       
 *       **Fonctionnalités:**
 *       - Liste de tous les diplômes associés à l'université
 *       - Informations complètes sur chaque diplôme
 *       - Tri alphabétique par nom de diplôme
 *       - Validation de l'existence de l'université
 *       
 *       **Cas d'utilisation:**
 *       - Affichage du catalogue de formation d'une université
 *       - Interface de sélection de diplômes
 *       - Analyse de l'offre de formation
 *       
 *       **Permissions:** Accès libre (aucune authentification requise)
 *     tags: [Universities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^univ_[0-9]+$'
 *         description: Identifiant unique de l'université
 *         example: "univ_1234567890"
 *     responses:
 *       200:
 *         description: Liste des diplômes récupérée avec succès
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
 *                   example: "Diplômes récupérés avec succès"
 *                 university:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "univ_1234567890"
 *                     name:
 *                       type: string
 *                       example: "Université Paris-Saclay"
 *                 degrees:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Degree'
 *                 count:
 *                   type: integer
 *                   description: Nombre de diplômes proposés
 *                   example: 15
 *             examples:
 *               degrees_found:
 *                 summary: Diplômes trouvés
 *                 value:
 *                   success: true
 *                   message: "Diplômes récupérés avec succès"
 *                   university:
 *                     id: "univ_1234567890"
 *                     name: "Université Paris-Saclay"
 *                   degrees:
 *                     - id: "deg_1111111111"
 *                       name: "Licence en Informatique"
 *                       level: "Licence"
 *                       duration: "3 ans"
 *                       description: "Formation en informatique fondamentale"
 *                     - id: "deg_2222222222"
 *                       name: "Master en Intelligence Artificielle"
 *                       level: "Master"
 *                       duration: "2 ans"
 *                       description: "Spécialisation en IA et machine learning"
 *                   count: 2
 *               no_degrees:
 *                 summary: Aucun diplôme trouvé
 *                 value:
 *                   success: true
 *                   message: "Aucun diplôme trouvé pour cette université"
 *                   university:
 *                     id: "univ_2345678901"
 *                     name: "École Nouvelle"
 *                   degrees: []
 *                   count: 0
 *       404:
 *         description: Université non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Université non trouvée"
 *               error: "UNIVERSITY_NOT_FOUND"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de la récupération des diplômes"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.get('/:id/degrees', universityController.getDegrees);

/**
 * @swagger
 * /universities/degree/{degreeId}:
 *   get:
 *     summary: Récupérer toutes les universités proposant un diplôme spécifique
 *     description: |
 *       Récupère la liste complète des universités qui proposent un diplôme donné.
 *       
 *       **Fonctionnalités:**
 *       - Liste de toutes les universités proposant le diplôme
 *       - Inclusion des universités sponsors et non-sponsors
 *       - Informations complètes sur chaque université
 *       - Tri alphabétique par nom d'université
 *       
 *       **Cas d'utilisation:**
 *       - Recherche d'universités pour un diplôme précis
 *       - Comparaison des options de formation
 *       - Interface de sélection d'université
 *       - Analyse de la distribution géographique
 *       
 *       **Permissions:** Accès libre (aucune authentification requise)
 *     tags: [Universities]
 *     parameters:
 *       - in: path
 *         name: degreeId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^deg_[0-9]+$'
 *         description: Identifiant unique du diplôme
 *         example: "deg_1111111111"
 *     responses:
 *       200:
 *         description: Liste des universités récupérée avec succès
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
 *                   example: "Universités récupérées avec succès"
 *                 degree:
 *                   $ref: '#/components/schemas/Degree'
 *                 universities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/University'
 *                 statistics:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Nombre total d'universités
 *                       example: 5
 *                     sponsors:
 *                       type: integer
 *                       description: Nombre d'universités partenaires
 *                       example: 3
 *                     regular:
 *                       type: integer
 *                       description: Nombre d'universités non-partenaires
 *                       example: 2
 *             examples:
 *               universities_found:
 *                 summary: Universités trouvées
 *                 value:
 *                   success: true
 *                   message: "Universités récupérées avec succès"
 *                   degree:
 *                     id: "deg_1111111111"
 *                     name: "Licence en Informatique"
 *                     level: "Licence"
 *                     duration: "3 ans"
 *                     description: "Formation en informatique fondamentale"
 *                   universities:
 *                     - id: "univ_1234567890"
 *                       name: "Université Paris-Saclay"
 *                       address: "91190 Gif-sur-Yvette"
 *                       website: "https://www.universite-paris-saclay.fr"
 *                       sponsor: true
 *                       phone: "+33 1 69 15 78 00"
 *                       email: "contact@universite-paris-saclay.fr"
 *                     - id: "univ_2345678901"
 *                       name: "École Polytechnique"
 *                       address: "91128 Palaiseau"
 *                       website: "https://www.polytechnique.edu"
 *                       sponsor: true
 *                       phone: "+33 1 69 33 33 33"
 *                       email: "contact@polytechnique.edu"
 *                     - id: "univ_3456789012"
 *                       name: "Université de Versailles"
 *                       address: "78000 Versailles"
 *                       website: "https://www.uvsq.fr"
 *                       sponsor: false
 *                       phone: "+33 1 39 25 78 00"
 *                       email: "contact@uvsq.fr"
 *                   statistics:
 *                     total: 3
 *                     sponsors: 2
 *                     regular: 1
 *               no_universities_found:
 *                 summary: Aucune université trouvée
 *                 value:
 *                   success: true
 *                   message: "Aucune université ne propose ce diplôme"
 *                   degree:
 *                     id: "deg_2222222222"
 *                     name: "Master en Philosophie Antique"
 *                     level: "Master"
 *                     duration: "2 ans"
 *                   universities: []
 *                   statistics:
 *                     total: 0
 *                     sponsors: 0
 *                     regular: 0
 *       404:
 *         description: Diplôme non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Diplôme non trouvé"
 *               error: "DEGREE_NOT_FOUND"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur lors de la récupération des universités"
 *               error: "INTERNAL_SERVER_ERROR"
 */
router.get('/degree/:degreeId', universityController.getByDegree);

module.exports = router;
