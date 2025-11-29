/**
 * =====================================================
 * WhatsApp Service
 * =====================================================
 * Service d'envoi de messages WhatsApp automatiques
 * Utilise Twilio WhatsApp API
 *
 * @module services/whatsappService
 * @version 2.0
 */

const twilio = require('twilio');

// Configuration Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

// Initialiser le client Twilio
let client;
try {
    if (accountSid && authToken) {
        client = twilio(accountSid, authToken);
        console.log('✅ [WhatsApp] Client Twilio initialisé');
    } else {
        console.warn('⚠️ [WhatsApp] Credentials Twilio manquants - Service désactivé');
    }
} catch (error) {
    console.error('❌ [WhatsApp] Erreur initialisation Twilio:', error.message);
}

/**
 * Envoie un message WhatsApp de confirmation de demande de consultation
 *
 * @param {Object} params - Paramètres du message
 * @param {string} params.studentPhone - Numéro de téléphone de l'étudiant (format international)
 * @param {string} params.studentName - Nom de l'étudiant
 * @returns {Promise<Object>} Résultat de l'envoi
 * @throws {Error} Si l'envoi échoue
 */
exports.sendConsultationConfirmation = async ({studentPhone, studentName}) => {
    console.log('📱 [WhatsApp] Envoi confirmation consultation à:', studentPhone);

    // Vérifier que le client Twilio est initialisé
    if (!client) {
        console.error('❌ [WhatsApp] Client Twilio non initialisé');
        throw new Error('Service WhatsApp non disponible - Vérifier les credentials Twilio');
    }

    // Formatage du numéro (ajouter whatsapp: prefix si nécessaire)
    const formattedPhone = studentPhone.startsWith('whatsapp:')
        ? studentPhone
        : `whatsapp:${studentPhone}`;

    // Récupération des modalités de paiement depuis les variables d'environnement
    const paymentAmount = process.env.PAYMENT_AMOUNT || '5000';
    const paymentTmoney = process.env.PAYMENT_TMONEY || '+228 XX XX XX XX';
    const paymentFlooz = process.env.PAYMENT_FLOOZ || '+228 XX XX XX XX';
    const paymentWave = process.env.PAYMENT_WAVE || '+228 XX XX XX XX';

    // Construction du message
    const message = `🎓 *ORIENTYS - Demande de Consultation Reçue*

Bonjour ${studentName},

Votre demande de consultation a été enregistrée avec succès ! ✅

💰 *MODALITÉS DE PAIEMENT*
━━━━━━━━━━━━━━━━━━━━━━
Montant : *${paymentAmount} FCFA*
Méthodes acceptées :
• T-Money : ${paymentTmoney}
• Flooz : ${paymentFlooz}
• Wave : ${paymentWave}

📝 *PROCHAINES ÉTAPES*
━━━━━━━━━━━━━━━━━━━━━━
1️⃣ Effectuez le paiement
2️⃣ Envoyez la preuve de paiement sur ce WhatsApp
3️⃣ Notre équipe validera et assignera un conseiller
4️⃣ Vous recevrez les coordonnées du conseiller par email

⏱️ *Délai de traitement : 24-48h*

Des questions ? Répondez à ce message.

L'équipe Orientys 🚀`;

    try {
        // Envoi du message via Twilio
        const result = await client.messages.create({
            body: message,
            from: whatsappNumber,
            to: formattedPhone
        });

        console.log('✅ [WhatsApp] Message envoyé, SID:', result.sid);

        return {
            success: true,
            messageSid: result.sid,
            status: result.status
        };

    } catch (error) {
        console.error('❌ [WhatsApp] Erreur envoi message:', error.message);
        throw new Error(`Échec envoi WhatsApp: ${error.message}`);
    }
};

/**
 * Vérifie si le service WhatsApp est disponible
 *
 * @returns {boolean} True si disponible
 */
exports.isAvailable = () => {
    return client !== undefined && client !== null;
};

/**
 * Teste la connexion au service WhatsApp
 *
 * @returns {Promise<boolean>} True si connexion OK
 */
exports.testConnection = async () => {
    if (!client) {
        return false;
    }

    try {
        // Test de connexion simple
        await client.api.accounts(accountSid).fetch();
        console.log('✅ [WhatsApp] Connexion Twilio OK');
        return true;
    } catch (error) {
        console.error('❌ [WhatsApp] Test connexion échoué:', error.message);
        return false;
    }
};