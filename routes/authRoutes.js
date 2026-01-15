const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const requirePermissions = require('../middlewares/requirePermissionsMiddleware');
const {authLimiter} = require('../middlewares/rateLimiter');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     description: |
 *       Authentifie un utilisateur avec son email et mot de passe.
 *       Retourne un token d'accès JWT (validité: 1h) et un refresh token (validité: 7j).
 *       Le token d'accès doit être inclus dans l'en-tête Authorization pour les routes protégées.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email de l'utilisateur
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *                 example: Password123
 *           examples:
 *             admin:
 *               summary: Connexion admin
 *               value:
 *                 email: admin@orientys.com
 *                 password: AdminPassword123
 *             client:
 *               summary: Connexion client
 *               value:
 *                 email: client@example.com
 *                 password: ClientPassword123
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Connexion réussie"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Identifiant unique de l'utilisateur
 *                       example: "usr_123456789"
 *                     name:
 *                       type: string
 *                       description: Nom complet de l'utilisateur
 *                       example: "Jean Dupont"
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: Adresse email de l'utilisateur
 *                       example: "jean.dupont@example.com"
 *                     permissions:
 *                       type: string
 *                       enum: [admin, client]
 *                       description: Rôle de l'utilisateur dans le système
 *                       example: "client"
 *                 refreshToken:
 *                   type: string
 *                   description: Token de rafraîchissement (validité 7 jours)
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfMTIzNCIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE2MzE2NDYwMDB9.signature"
 *                 accessToken:
 *                   type: string
 *                   description: Token d'accès JWT (validité 1 heure)
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfMTIzNCIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE2MzE2NDYwMDAsImV4cCI6MTYzMTY0OTYwMH0.signature"
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
 *                   summary: Champs manquants
 *                   value:
 *                     error: "Email et mot de passe requis"
 *                 invalid_email:
 *                   summary: Email invalide
 *                   value:
 *                     error: "Format d'email invalide"
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Identifiants invalides"
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur lors de la connexion"
 */
router.post('/login', authLimiter, authController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription utilisateur
 *     description: |
 *       Crée un nouveau compte utilisateur dans le système Orientys.
 *       Valide l'email, la complexité du mot de passe et assigne automatiquement le rôle 'client'.
 *       Retourne immédiatement les tokens d'authentification pour une connexion automatique.
 *
 *       **Règles de validation :**
 *       - Email: format valide requis
 *       - Mot de passe: minimum 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
 *       - Nom: obligatoire, non vide
 *       - Rôle: optionnel, 'client' par défaut (seuls les admins peuvent créer d'autres admins)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom complet de l'utilisateur
 *                 minLength: 1
 *                 maxLength: 255
 *                 example: Jean Dupont
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email unique (utilisée pour la connexion)
 *                 example: jean.dupont@example.com
 *               password:
 *                 type: string
 *                 description: Mot de passe (min 8 chars, 1 maj, 1 min, 1 chiffre)
 *                 minLength: 8
 *                 pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"
 *                 example: SecurePass123
 *               permissions:
 *                 type: string
 *                 enum: [admin, client]
 *                 description: Rôle dans le système (optionnel, 'client' par défaut)
 *                 default: client
 *                 example: client
 *           examples:
 *             new_student:
 *               summary: Inscription étudiant
 *               value:
 *                 name: "Marie Martin"
 *                 email: "marie.martin@student.fr"
 *                 password: "StudentPass123"
 *             new_user:
 *               summary: Inscription utilisateur standard
 *               value:
 *                 name: "Pierre Durand"
 *                 email: "pierre.durand@example.com"
 *                 password: "MySecurePass456"
 *                 permissions: "client"
 *     responses:
 *       201:
 *         description: Utilisateur inscrit avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur inscrit avec succès"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Identifiant unique généré automatiquement
 *                       example: "usr_789012345"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "jean.dupont@example.com"
 *                     name:
 *                       type: string
 *                       example: "Jean Dupont"
 *                     permissions:
 *                       type: string
 *                       enum: [admin, client]
 *                       example: "client"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date de création du compte
 *                       example: "2024-01-15T10:30:00.000Z"
 *                 refreshToken:
 *                   type: string
 *                   description: Token de rafraîchissement (validité 7 jours)
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh_token_payload.signature"
 *                 accessToken:
 *                   type: string
 *                   description: Token d'accès JWT (validité 1 heure)
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access_token_payload.signature"
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
 *                     error: "Tous les champs sont requis"
 *                 invalid_email:
 *                   summary: Format email invalide
 *                   value:
 *                     error: "Format d'email invalide"
 *                 weak_password:
 *                   summary: Mot de passe trop faible
 *                   value:
 *                     error: "Le mot de passe doit faire au moins 8 caractères, contenir une majuscule, une minuscule et un chiffre"
 *                 invalid_permissions:
 *                   summary: Rôle non autorisé
 *                   value:
 *                     error: "Rôle non autorisé"
 *       409:
 *         description: Conflit - utilisateur déjà existant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Utilisateur déjà existant"
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur lors de l'inscription"
 */
router.post('/register', authLimiter, authController.register);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Rafraîchir le token d'accès
 *     description: |
 *       Génère un nouveau token d'accès à partir d'un refresh token valide.
 *       Utilisé pour maintenir l'authentification sans redemander les identifiants.
 *
 *       **Comportement :**
 *       - Valide le refresh token fourni
 *       - Génère un nouveau access token (1h de validité)
 *       - Peut optionnellement générer un nouveau refresh token
 *       - Révoque l'ancien refresh token pour des raisons de sécurité
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de rafraîchissement valide (obtenu lors de la connexion/inscription)
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfMTIzNCIsInJvbGUiOiJjbGllbnQiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTYzMTY0NjAwMCwiZXhwIjoxNjMyMjUwODAwfQ.signature
 *           examples:
 *             valid_refresh:
 *               summary: Refresh token valide
 *               value:
 *                 refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid_refresh_payload.signature"
 *     responses:
 *       200:
 *         description: Token rafraîchi avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token rafraîchi avec succès"
 *                 accessToken:
 *                   type: string
 *                   description: Nouveau token d'accès JWT (validité 1 heure)
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new_access_token_payload.signature"
 *                 refreshToken:
 *                   type: string
 *                   description: Nouveau token de rafraîchissement (validité 7 jours)
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new_refresh_token_payload.signature"
 *                 user:
 *                   type: object
 *                   description: Informations utilisateur mises à jour
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "usr_123456789"
 *                     name:
 *                       type: string
 *                       example: "Jean Dupont"
 *                     email:
 *                       type: string
 *                       example: "jean.dupont@example.com"
 *                     permissions:
 *                       type: string
 *                       enum: [admin, client]
 *                       example: "client"
 *       400:
 *         description: Refresh token manquant ou format invalide
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
 *                     error: "Token requis"
 *                 malformed_token:
 *                   summary: Token mal formé
 *                   value:
 *                     error: "Format de token invalide"
 *       401:
 *         description: Refresh token invalide ou expiré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 invalid_token:
 *                   summary: Token invalide
 *                   value:
 *                     error: "Token invalide"
 *                 expired_token:
 *                   summary: Token expiré
 *                   value:
 *                     error: "Token expiré"
 *                 revoked_token:
 *                   summary: Token révoqué
 *                   value:
 *                     error: "Token révoqué"
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur lors du rafraîchissement du token"
 */
router.post('/refresh', authController.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion utilisateur
 *     description: |
 *       Déconnecte l'utilisateur en révoquant son refresh token.
 *       Après cette opération, l'utilisateur devra se reconnecter pour obtenir de nouveaux tokens.
 *
 *       **Sécurité :**
 *       - Nécessite un token d'accès valide dans l'en-tête Authorization
 *       - Révoque définitivement le refresh token fourni
 *       - L'access token reste techniquement valide jusqu'à expiration (1h)
 *       - Recommandé : supprimer côté client tous les tokens après cette opération
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de rafraîchissement à révoquer
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfMTIzNCIsInJvbGUiOiJjbGllbnQiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTYzMTY0NjAwMCwiZXhwIjoxNjMyMjUwODAwfQ.signature
 *           examples:
 *             logout_request:
 *               summary: Demande de déconnexion
 *               value:
 *                 refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh_token_to_revoke.signature"
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Déconnexion réussie"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: Horodatage de la déconnexion
 *                   example: "2024-01-15T14:30:00.000Z"
 *       400:
 *         description: Refresh token manquant
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
 *                     error: "Token requis"
 *                 invalid_format:
 *                   summary: Format invalide
 *                   value:
 *                     error: "Format de token invalide"
 *       401:
 *         description: Token d'accès invalide ou refresh token invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 invalid_access_token:
 *                   summary: Access token invalide
 *                   value:
 *                     error: "Token d'authentification invalide"
 *                 invalid_refresh_token:
 *                   summary: Refresh token invalide
 *                   value:
 *                     error: "Erreur lors de la déconnexion"
 *       403:
 *         description: Accès refusé - token d'accès manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token d'authentification manquant"
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur lors de la déconnexion"
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     description: |
 *       Retourne la liste complète des utilisateurs enregistrés dans le système.
 *       Cette route est strictement réservée aux administrateurs.
 *
 *       **Permissions requises :** Rôle admin
 *       **Authentification :** Token Bearer obligatoire
 *
 *       Les mots de passe ne sont jamais inclus dans la réponse pour des raisons de sécurité.
 *     tags: [Utilisateur]
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
 *         description: Nombre d'utilisateurs par page (optionnel)
 *       - in: query
 *         name: permissions
 *         schema:
 *           type: string
 *           enum: [admin, client]
 *         description: Filtrer par rôle (optionnel)
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   description: Liste des utilisateurs
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Identifiant unique de l'utilisateur
 *                         example: "usr_123456789"
 *                       permissions:
 *                         type: string
 *                         enum: [admin, client]
 *                         description: Rôle de l'utilisateur
 *                         example: "client"
 *                       name:
 *                         type: string
 *                         description: Nom complet de l'utilisateur
 *                         example: "Jean Dupont"
 *                       email:
 *                         type: string
 *                         format: email
 *                         description: Adresse email de l'utilisateur
 *                         example: "jean.dupont@example.com"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date de création du compte
 *                         example: "2024-01-15T10:30:00.000Z"
 *                       lastLogin:
 *                         type: string
 *                         format: date-time
 *                         description: Dernière connexion (peut être null)
 *                         example: "2024-01-20T09:15:00.000Z"
 *                 metadata:
 *                   type: object
 *                   description: Métadonnées de pagination
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Nombre total d'utilisateurs
 *                       example: 150
 *                     page:
 *                       type: integer
 *                       description: Page actuelle
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       description: Nombre total de pages
 *                       example: 3
 *                     hasNext:
 *                       type: boolean
 *                       description: Indique s'il y a une page suivante
 *                       example: true
 *             examples:
 *               users_list:
 *                 summary: Liste d'utilisateurs
 *                 value:
 *                   users:
 *                     - id: "usr_123456789"
 *                       permissions: "admin"
 *                       name: "Admin Système"
 *                       email: "admin@orientys.com"
 *                       createdAt: "2024-01-01T00:00:00.000Z"
 *                       lastLogin: "2024-01-20T08:00:00.000Z"
 *                     - id: "usr_987654321"
 *                       permissions: "client"
 *                       name: "Marie Martin"
 *                       email: "marie.martin@student.fr"
 *                       createdAt: "2024-01-15T10:30:00.000Z"
 *                       lastLogin: "2024-01-19T14:20:00.000Z"
 *                   metadata:
 *                     total: 2
 *                     page: 1
 *                     totalPages: 1
 *                     hasNext: false
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
 *                   example: "Erreur lors de la récupération des utilisateurs"
 */
router.get('/users', authMiddleware, requirePermissions('admin'), authController.getAllUsers);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par ID
 *     description: |
 *       Retourne les informations détaillées d'un utilisateur spécifique.
 *       Cette route est strictement réservée aux administrateurs.
 *
 *       **Permissions requises :** Rôle admin
 *       **Authentification :** Token Bearer obligatoire
 *
 *       Le mot de passe n'est jamais inclus dans la réponse pour des raisons de sécurité.
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant unique de l'utilisateur
 *         example: "usr_123456789"
 *     responses:
 *       200:
 *         description: Utilisateur trouvé et récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Identifiant unique de l'utilisateur
 *                       example: "usr_123456789"
 *                     permissions:
 *                       type: string
 *                       enum: [admin, client]
 *                       description: Rôle de l'utilisateur dans le système
 *                       example: "client"
 *                     name:
 *                       type: string
 *                       description: Nom complet de l'utilisateur
 *                       example: "Jean Dupont"
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: Adresse email de l'utilisateur
 *                       example: "jean.dupont@example.com"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date de création du compte
 *                       example: "2024-01-15T10:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date de dernière modification
 *                       example: "2024-01-18T15:45:00.000Z"
 *                     lastLogin:
 *                       type: string
 *                       format: date-time
 *                       description: Dernière connexion (peut être null)
 *                       example: "2024-01-20T09:15:00.000Z"
 *                     isActive:
 *                       type: boolean
 *                       description: Statut actif/inactif du compte
 *                       example: true
 *             examples:
 *               admin_user:
 *                 summary: Utilisateur administrateur
 *                 value:
 *                   user:
 *                     id: "usr_admin_001"
 *                     permissions: "admin"
 *                     name: "Admin Système"
 *                     email: "admin@orientys.com"
 *                     createdAt: "2024-01-01T00:00:00.000Z"
 *                     updatedAt: "2024-01-01T00:00:00.000Z"
 *                     lastLogin: "2024-01-20T08:00:00.000Z"
 *                     isActive: true
 *               client_user:
 *                 summary: Utilisateur client
 *                 value:
 *                   user:
 *                     id: "usr_123456789"
 *                     permissions: "client"
 *                     name: "Marie Martin"
 *                     email: "marie.martin@student.fr"
 *                     createdAt: "2024-01-15T10:30:00.000Z"
 *                     updatedAt: "2024-01-18T15:45:00.000Z"
 *                     lastLogin: "2024-01-19T14:20:00.000Z"
 *                     isActive: true
 *       400:
 *         description: ID utilisateur invalide ou malformé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID utilisateur invalide"
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
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la récupération de l'utilisateur"
 */
router.get('/users/:id', authMiddleware, authController.getUserById);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur (Admin uniquement)
 *     description: |
 *       Permet à un administrateur de modifier les informations d'un utilisateur existant.
 *       Tous les champs sont optionnels - seuls les champs fournis seront mis à jour.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant unique de l'utilisateur à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nouvelle adresse email (optionnel)
 *               password:
 *                 type: string
 *                 description: Nouveau mot de passe (optionnel)
 *               permissions:
 *                 type: string
 *                 enum: [admin, client]
 *                 description: Nouveau rôle (optionnel)
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Données de requête invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur interne
 */
router.put('/users/:id', authMiddleware, requirePermissions('admin'), authController.updateUserById);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     description: |
 *       Supprime définitivement un utilisateur du système.
 *       Cette route est strictement réservée aux administrateurs.
 *
 *       **⚠️ ATTENTION :** Cette opération est irréversible !
 *
 *       **Permissions requises :** Rôle admin
 *       **Authentification :** Token Bearer obligatoire
 *
 *       **Effets de la suppression :**
 *       - Suppression définitive du compte utilisateur
 *       - Révocation de tous les tokens actifs
 *       - Suppression en cascade des données liées (recommandations, notes, etc.)
 *       - Impossibilité de récupérer les données après suppression
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant unique de l'utilisateur à supprimer
 *         example: "usr_123456789"
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur supprimé avec succès"
 *                 deletedUser:
 *                   type: object
 *                   description: Informations de l'utilisateur supprimé (pour confirmation)
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "usr_123456789"
 *                     name:
 *                       type: string
 *                       example: "Jean Dupont"
 *                     email:
 *                       type: string
 *                       example: "jean.dupont@example.com"
 *                     permissions:
 *                       type: string
 *                       example: "client"
 *                 deletedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Horodatage de la suppression
 *                   example: "2024-01-20T16:45:00.000Z"
 *             examples:
 *               client_deleted:
 *                 summary: Suppression d'un client
 *                 value:
 *                   message: "Utilisateur supprimé avec succès"
 *                   deletedUser:
 *                     id: "usr_123456789"
 *                     name: "Marie Martin"
 *                     email: "marie.martin@student.fr"
 *                     permissions: "client"
 *                   deletedAt: "2024-01-20T16:45:00.000Z"
 *       400:
 *         description: ID utilisateur invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 invalid_id:
 *                   summary: ID invalide
 *                   value:
 *                     error: "ID utilisateur invalide"
 *                 self_deletion:
 *                   summary: Auto-suppression interdite
 *                   value:
 *                     error: "Vous ne pouvez pas supprimer votre propre compte"
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
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la suppression de l'utilisateur"
 */
router.delete('/users/:id', authMiddleware, requirePermissions('admin'), authController.deleteUserById);

module.exports = router;