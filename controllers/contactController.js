/**
 * =====================================================
 * Contact Controller
 * =====================================================
 * Gère les demandes de contact du formulaire public
 *
 * @module controllers/contactController
 * @version 1.0
 */

const validator = require('validator');
const EmailService = require('../services/emailService');

/**
 * POST /api/contact
 * Traite un message de contact provenant du formulaire public
 * Valide les données et envoie un email à l'équipe Orientys
 *
 * @param {Object} req - Requête Express
 * @param {string} req.body.name - Nom du contact
 * @param {string} req.body.email - Email du contact
 * @param {string} req.body.subject - Sujet du message
 * @param {string} req.body.message - Corps du message
 * @param {Object} res - Réponse Express
 * @returns {Object} Message de succès ou erreur
 */
exports.sendContactMessage = async (req, res) => {
    const { name, email, subject, message } = req.body;

    console.log('📧 [Contact] Nouvelle demande de contact:', { name, email, subject });

    try {
        // Validation des champs obligatoires
        if (!name || !email || !subject || !message) {
            console.log('⚠️ [Contact] Échec: champs manquants');
            return res.status(400).json({
                error: 'Tous les champs sont obligatoires.'
            });
        }

        // Validation du format email
        if (!validator.isEmail(email)) {
            console.log('⚠️ [Contact] Échec: email invalide');
            return res.status(400).json({
                error: 'Adresse email invalide.'
            });
        }

        // Validation de la longueur des champs
        if (name.length < 2 || name.length > 100) {
            return res.status(400).json({
                error: 'Le nom doit faire entre 2 et 100 caractères.'
            });
        }

        if (subject.length < 5 || subject.length > 200) {
            return res.status(400).json({
                error: 'Le sujet doit faire entre 5 et 200 caractères.'
            });
        }

        if (message.length < 10 || message.length > 5000) {
            return res.status(400).json({
                error: 'Le message doit faire entre 10 et 5000 caractères.'
            });
        }

        // Sanitization basique contre les injections
        const sanitizedName = validator.trim(name);
        const sanitizedEmail = validator.trim(email).toLowerCase();
        const sanitizedSubject = validator.trim(subject);
        const sanitizedMessage = validator.trim(message);

        // Envoi de l'email
        const result = await EmailService.sendContactMessage({
            name: sanitizedName,
            email: sanitizedEmail,
            subject: sanitizedSubject,
            message: sanitizedMessage
        });

        console.log('✅ [Contact] Message envoyé avec succès');
        return res.status(200).json({
            success: true,
            message: 'Message envoyé avec succès. Nous vous répondrons bientôt.'
        });

    } catch (error) {
        console.error('❌ [Contact] Erreur:', error.message);
        return res.status(500).json({
            error: 'Erreur serveur lors du traitement de votre demande.'
        });
    }
};
