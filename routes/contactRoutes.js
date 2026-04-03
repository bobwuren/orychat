const express = require("express");
const router = express.Router();
const contactController = require('../controllers/contactController');
const { contactLimiter } = require('../middlewares/rateLimiter');

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Envoyer un message de contact
 *     description: |
 *       Permet aux utilisateurs non authentifiés de soumettre un formulaire de contact.
 *       Envoie un email à l'équipe Orientys avec le message.
 *       Limite de requêtes: 5 par heure par IP.
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Nom complet du contact
 *                 example: "Jean Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email de contact
 *                 example: "jean.dupont@example.com"
 *               subject:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 description: Sujet du message
 *                 example: "Question sur les formations"
 *               message:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 5000
 *                 description: Corps du message
 *                 example: "J'aimerais avoir plus d'informations sur votre plateforme..."
 *     responses:
 *       200:
 *         description: Message envoyé avec succès
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
 *                   example: "Message envoyé avec succès. Nous vous répondrons bientôt."
 *       400:
 *         description: Validation échouée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Tous les champs sont obligatoires."
 *       429:
 *         description: Trop de requêtes - Rate limit atteint
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Trop de requêtes. Essayez plus tard."
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur lors du traitement de votre demande."
 */
router.post('/', contactLimiter, contactController.sendContactMessage);

module.exports = router;
