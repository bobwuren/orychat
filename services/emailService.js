/**
 * =====================================================
 * Email Service
 * =====================================================
 * Service d'envoi d'emails via Nodemailer
 * Gère l'envoi des emails aux conseillers lors d'assignation
 *
 * @module services/emailService
 * @version 2.0
 */
const nodemailer = require('nodemailer');
// Configuration du transporteur SMTP
let transporter;
try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        console.log('✅ [Email] Transporteur SMTP initialisé');
    } else {
        console.warn('⚠️ [Email] Configuration SMTP manquante - Service désactivé');
    }
} catch (error) {
    console.error('❌ [Email] Erreur initialisation SMTP:', error.message);
}

/**
 * Envoie un email au conseiller lors de l'assignation
 *
 * @param {Object} data - Données complètes de la consultation
 * @param {Object} data.consultation - Infos consultation
 * @param {Object} data.student - Profil étudiant
 * @param {Object} data.serie - Série académique
 * @param {Array} data.notes - Notes détaillées
 * @param {Object} data.questionnaire - Réponses questionnaire
 * @param {Object} data.recommendation - Recommandations IA
 * @param {Object} data.counselor - Infos conseiller
 * @returns {Promise<Object>} Résultat de l'envoi
 */
exports.sendCounselorAssignment = async (data) => {
    console.log('📧 [Email] Envoi assignation au conseiller:', data.counselor.email);

    if (!transporter) {
        console.error('❌ [Email] Transporteur non initialisé');
        throw new Error('Service email non disponible - Vérifier configuration SMTP');
    }

    // Construction du template HTML
    const htmlContent = buildCounselorEmailTemplate(data);

    // Configuration de l'email
    const mailOptions = {
        from: `Orientys - Plateforme d'Orientation ${process.env.SMTP_USER}`,
        to: data.counselor.email,
        subject: `🎓 Nouvelle Assignation - ${data.student.name || 'Étudiant'}`,
        html: htmlContent
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ [Email] Email envoyé, Message ID:', info.messageId);

        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('❌ [Email] Erreur envoi:', error.message);
        throw new Error(`Échec envoi email: ${error.message}`);
    }
};

/**
 * Construit le template HTML de l'email pour le conseiller
 *
 * @param {Object} data - Données complètes
 * @returns {string} HTML formaté
 */
function buildCounselorEmailTemplate(data) {
    const {
        consultation,
        student,
        serie,
        notes,
        questionnaire,
        recommendation,
        counselor
    } = data;

    // Formatage des notes avec coefficients - CORRECTION ICI
    const notesHtml = notes.map(note =>
        `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #252426;">
                ${note.subjectName}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #252426; text-align: center;">
                <span style="color: ${note.value >= 10 ? '#7c3aed' : '#ea7845'}; font-weight: bold;">
                    ${note.value}/20
                </span>
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #252426; text-align: center;">
                ${note.coefficient}
            </td>
        </tr>`
    ).join('');

    // Calcul de la moyenne
    const moyenne = notes.length > 0
        ? (notes.reduce((acc, n) => acc + n.value, 0) / notes.length).toFixed(2)
        : 'N/A';

    // Formatage des recommandations IA
    const recommendationsHtml = recommendation.orientations.map((orientation, index) => `
<div style="background-color: #18151c; border-left: 3px solid #7c3aed; padding: 20px; margin-bottom: 16px; border-radius: 6px;">
    <h4 style="margin: 0 0 12px; color: #7c3aed; font-size: 16px;">
        ${index + 1}. ${orientation.name}
    </h4>
    <p style="margin: 0 0 16px; color: #b8b8ba; font-size: 14px; line-height: 1.6;">
        ${orientation.why}
    </p>
    ${orientation.degrees && orientation.degrees.length > 0 ? `
        <div style="margin-bottom: 12px;">
            <strong style="color: #f7f7f8; font-size: 13px;">Diplômes requis :</strong>
            <ul style="margin: 8px 0; padding-left: 20px; color: #b8b8ba; font-size: 13px;">
                ${orientation.degrees.map(d => `<li>${d.name}</li>`).join('')}
            </ul>
        </div>
    ` : ''}
    
    ${orientation.universities && orientation.universities.length > 0 ? `
        <div>
            <strong style="color: #f7f7f8; font-size: 13px;">Universités recommandées :</strong>
            <ul style="margin: 8px 0; padding-left: 20px; color: #b8b8ba; font-size: 13px;">
                ${orientation.universities.map(u => `<li>${u.name}</li>`).join('')}
            </ul>
        </div>
    ` : ''}
</div>
`).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvelle Assignation - Orientys</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0a0615; color: #f7f7f8;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0a0615;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="700" style="max-width: 700px; background-color: #0a0615; border: 1px solid #252426; border-radius: 12px;">
                <!-- Header -->
                <tr>
                    <td style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                            🎓 ORIENTYS
                        </h1>
                        <p style="color: #ffffff; margin: 10px 0 0; font-size: 14px; opacity: 0.9;">
                            Nouvelle Assignation de Consultation
                        </p>
                    </td>
                </tr>
                
                <!-- Contenu -->
                <tr>
                    <td style="padding: 40px;">
                        
                        <!-- Salutation -->
                        <div style="margin-bottom: 32px;">
                            <h2 style="margin: 0 0 16px; color: #f7f7f8; font-size: 20px;">
                                Bonjour ${counselor.name},
                            </h2>
                            <p style="margin: 0; color: #b8b8ba; font-size: 15px; line-height: 1.6;">
                                Une nouvelle demande de consultation vous a été assignée. Voici le profil complet de l'étudiant pour vous permettre de préparer au mieux votre entretien.
                            </p>
                        </div>
                        
                        <!-- Section 1: Profil Académique -->
                        <div style="background-color: #18151c; border: 1px solid #252426; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                            <h3 style="margin: 0 0 20px; color: #7c3aed; font-size: 18px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">
                                📊 Profil Académique
                            </h3>
                            
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                                <tr>
                                    <td style="padding: 8px 0; width: 150px;">
                                        <strong style="color: #f7f7f8;">Série :</strong>
                                    </td>
                                    <td style="padding: 8px 0; color: #b8b8ba;">
                                        ${serie.code} - ${serie.description}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;">
                                        <strong style="color: #f7f7f8;">Moyenne générale :</strong>
                                    </td>
                                    <td style="padding: 8px 0;">
                                        <span style="color: ${parseFloat(moyenne) >= 10 ? '#7c3aed' : '#ea7845'}; font-weight: bold; font-size: 18px;">
                                            ${moyenne}/20
                                        </span>
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="margin-top: 20px;">
                                <strong style="color: #f7f7f8; display: block; margin-bottom: 12px;">Notes détaillées :</strong>
                                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0a0615; border-radius: 6px; overflow: hidden;">
                                    <thead>
                                        <tr style="background-color: #7c3aed;">
                                            <th style="padding: 12px; text-align: left; color: #ffffff; font-size: 13px;">Matière</th>
                                            <th style="padding: 12px; text-align: center; color: #ffffff; font-size: 13px;">Note</th>
                                            <th style="padding: 12px; text-align: center; color: #ffffff; font-size: 13px;">Coeff.</th>
                                        </tr>
                                    </thead>
                                    <tbody style="color: #b8b8ba; font-size: 14px;">
                                        ${notesHtml}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <!-- Section 2: Questionnaire d'Orientation -->
                        ${questionnaire ? `
                        <div style="background-color: #18151c; border: 1px solid #252426; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                            <h3 style="margin: 0 0 20px; color: #7c3aed; font-size: 18px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">
                                📝 Questionnaire d'Orientation
                            </h3>
                            
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                ${questionnaire.visionProfessionnelle ? `
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #252426;">
                                        <strong style="color: #f7f7f8; display: block; margin-bottom: 4px;">Vision professionnelle (5-10 ans) :</strong>
                                        <span style="color: #b8b8ba;">${questionnaire.visionProfessionnelle}</span>
                                    </td>
                                </tr>
                                ` : ''}
                                
                                ${questionnaire.styleApprentissage ? `
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #252426;">
                                        <strong style="color: #f7f7f8; display: block; margin-bottom: 4px;">Style d'apprentissage :</strong>
                                        <span style="color: #b8b8ba;">${questionnaire.styleApprentissage}</span>
                                    </td>
                                </tr>
                                ` : ''}
                                
                                ${questionnaire.domaineNumerique ? `
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #252426;">
                                        <strong style="color: #f7f7f8; display: block; margin-bottom: 4px;">Domaine numérique d'intérêt :</strong>
                                        <span style="color: #b8b8ba;">${questionnaire.domaineNumerique}</span>
                                    </td>
                                </tr>
                                ` : ''}
                                
                                ${questionnaire.prioriteFormation ? `
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #252426;">
                                        <strong style="color: #f7f7f8; display: block; margin-bottom: 4px;">Priorité dans la formation :</strong>
                                        <span style="color: #b8b8ba;">${questionnaire.prioriteFormation}</span>
                                    </td>
                                </tr>
                                ` : ''}
                                
                                ${questionnaire.modeTravail ? `
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #252426;">
                                        <strong style="color: #f7f7f8; display: block; margin-bottom: 4px;">Mode de travail préféré :</strong>
                                        <span style="color: #b8b8ba;">${questionnaire.modeTravail}</span>
                                    </td>
                                </tr>
                                ` : ''}
                                
                                ${questionnaire.matieresPreferees ? `
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #252426;">
                                        <strong style="color: #f7f7f8; display: block; margin-bottom: 4px;">Matières préférées et forces :</strong>
                                        <p style="color: #b8b8ba; margin: 8px 0 0; line-height: 1.6;">${questionnaire.matieresPreferees}</p>
                                    </td>
                                </tr>
                                ` : ''}
                                
                                ${questionnaire.passionsExtraScolaires ? `
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #252426;">
                                        <strong style="color: #f7f7f8; display: block; margin-bottom: 4px;">Passions extra-scolaires :</strong>
                                        <p style="color: #b8b8ba; margin: 8px 0 0; line-height: 1.6;">${questionnaire.passionsExtraScolaires}</p>
                                    </td>
                                </tr>
                                ` : ''}
                                
                                ${questionnaire.messageLibre ? `
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <strong style="color: #f7f7f8; display: block; margin-bottom: 4px;">Message libre :</strong>
                                        <p style="color: #b8b8ba; margin: 8px 0 0; line-height: 1.6;">${questionnaire.messageLibre}</p>
                                    </td>
                                </tr>
                                ` : ''}
                            </table>
                        </div>
                        ` : ''}
                        
                        <!-- Section 3: Recommandations IA -->
                        <div style="background-color: #18151c; border: 1px solid #252426; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                            <h3 style="margin: 0 0 20px; color: #7c3aed; font-size: 18px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">
                                🤖 Recommandations IA
                            </h3>
                            ${recommendationsHtml}
                        </div>
                        
                        <!-- Section 4: Commentaire Additionnel -->
                        ${consultation.additionalComment ? `
                        <div style="background-color: #2a1810; border: 1px solid #d96c34; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                            <h3 style="margin: 0 0 12px; color: #ea7845; font-size: 16px;">
                                💬 Message de l'étudiant
                            </h3>
                            <p style="margin: 0; color: #b8b8ba; font-size: 14px; line-height: 1.6;">
                                "${consultation.additionalComment}"
                            </p>
                        </div>
                        ` : ''}
                        
                        <!-- Section 5: Coordonnées -->
                        <div style="background-color: #18151c; border: 1px solid #252426; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                            <h3 style="margin: 0 0 20px; color: #7c3aed; font-size: 18px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">
                                📞 Coordonnées de l'Étudiant
                            </h3>
                            
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 8px 0; width: 150px;">
                                        <strong style="color: #f7f7f8;">Nom :</strong>
                                    </td>
                                    <td style="padding: 8px 0; color: #b8b8ba;">
                                        ${student.name || 'Non renseigné'}
                                    </td>
                                </tr>
                                ${consultation.studentEmail ? `
                                <tr>
                                    <td style="padding: 8px 0;">
                                        <strong style="color: #f7f7f8;">Email :</strong>
                                    </td>
                                    <td style="padding: 8px 0;">
                                        <a href="mailto:${consultation.studentEmail}" style="color: #7c3aed; text-decoration: none;">
                                            ${consultation.studentEmail}
                                        </a>
                                    </td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td style="padding: 8px 0;">
                                        <strong style="color: #f7f7f8;">Téléphone :</strong>
                                    </td>
                                    <td style="padding: 8px 0;">
                                        <a href="tel:${consultation.studentPhone}" style="color: #7c3aed; text-decoration: none;">
                                            ${consultation.studentPhone}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        
                        <!-- Instructions -->
                        <div style="background-color: #18151c; border: 1px solid #7c3aed; border-radius: 8px; padding: 24px;">
                            <h3 style="margin: 0 0 16px; color: #7c3aed; font-size: 16px;">
                                📋 Prochaines étapes
                            </h3>
                            <ol style="margin: 0; padding-left: 20px; color: #b8b8ba; font-size: 14px; line-height: 1.8;">
                                <li>Contactez l'étudiant dans les plus brefs délais</li>
                                <li>Proposez vos créneaux de disponibilité</li>
                                <li>Organisez l'entretien d'orientation (visio ou présentiel)</li>
                                <li>Préparez vos conseils en vous basant sur ce profil complet</li>
                            </ol>
                        </div>
                        
                    </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                    <td style="background-color: #18151c; padding: 24px; text-align: center; border-top: 1px solid #252426; border-radius: 0 0 12px 12px;">
                        <p style="margin: 0 0 8px; color: #b8b8ba; font-size: 12px;">
                            Email envoyé automatiquement le ${new Date().toLocaleString('fr-FR')}
                        </p>
                        <p style="margin: 0; color: #b8b8ba; font-size: 12px;">
                            © ${new Date().getFullYear()} Orientys - Tous droits réservés
                        </p>
                    </td>
                </tr>
                
            </table>
        </td>
    </tr>
</table>
</body>
</html>
    `;
}

/**
 * Envoie un email de confirmation à l'étudiant
 *
 * @param {Object} data - Données de l'étudiant et du conseiller
 * @param {string} data.studentEmail - Email de l'étudiant
 * @param {string} data.studentName - Nom de l'étudiant
 * @param {Object} data.counselor - Infos du conseiller
 * @returns {Promise<Object>} Résultat de l'envoi
 */
exports.sendStudentConfirmation = async (data) => {
    console.log('📧 [Email] Envoi confirmation à l\'étudiant:', data.studentEmail);

    if (!transporter) {
        console.error('❌ [Email] Transporteur non initialisé');
        throw new Error('Service email non disponible');
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de Consultation - Orientys</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0a0615; color: #f7f7f8;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #18151c; border-radius: 12px; border: 1px solid #252426;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                                ✅ Consultation Confirmée
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Contenu -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #f7f7f8; margin: 0 0 20px; font-size: 20px;">
                                Bonjour ${data.studentName},
                            </h2>
                            
                            <p style="color: #b8b8ba; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                                Votre demande de consultation a été traitée et un conseiller vous a été assigné !
                            </p>
                            
                            <div style="background-color: #0a0615; border: 1px solid #7c3aed; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                <h3 style="color: #7c3aed; margin: 0 0 16px; font-size: 18px;">
                                    👤 Votre Conseiller
                                </h3>
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 8px 0; width: 120px;">
                                            <strong style="color: #f7f7f8;">Nom :</strong>
                                        </td>
                                        <td style="padding: 8px 0; color: #b8b8ba;">
                                            ${data.counselor.name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <strong style="color: #f7f7f8;">Spécialité :</strong>
                                        </td>
                                        <td style="padding: 8px 0; color: #b8b8ba;">
                                            ${data.counselor.specialty}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <strong style="color: #f7f7f8;">Expérience :</strong>
                                        </td>
                                        <td style="padding: 8px 0; color: #b8b8ba;">
                                            ${data.counselor.experience}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background-color: #0a0615; border: 1px solid #252426; border-radius: 8px; padding: 24px;">
                                <h3 style="color: #7c3aed; margin: 0 0 16px; font-size: 18px;">
                                    📋 Prochaines Étapes
                                </h3>
                                <ol style="color: #b8b8ba; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                    <li>Votre conseiller vous contactera sous peu par email ou téléphone</li>
                                    <li>Il vous proposera des créneaux pour l'entretien d'orientation</li>
                                    <li>Préparez vos questions et documents pertinents</li>
                                    <li>L'entretien aura lieu en visioconférence ou en présentiel</li>
                                </ol>
                            </div>
                            
                            <p style="color: #b8b8ba; font-size: 14px; line-height: 1.6; margin-top: 24px;">
                                Si vous avez des questions, vous pouvez répondre à cet email.
                                <br>
                                <strong>L'équipe Orientys 🚀</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0a0615; padding: 24px; text-align: center; border-top: 1px solid #252426; border-radius: 0 0 12px 12px;">
                            <p style="color: #b8b8ba; font-size: 12px; margin: 0 0 8px;">
                                Email envoyé automatiquement le ${new Date().toLocaleString('fr-FR')}
                            </p>
                            <p style="color: #b8b8ba; font-size: 12px; margin: 0;">
                                © ${new Date().getFullYear()} Orientys - Tous droits réservés
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    const mailOptions = {
        from: `Orientys - Plateforme d'Orientation ${process.env.SMTP_USER}`,
        to: data.studentEmail,
        subject: '✅ Votre conseiller Orientys vous a été assigné',
        html: htmlContent
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ [Email] Confirmation envoyée à l\'étudiant');
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('❌ [Email] Erreur envoi confirmation étudiant:', error.message);
        throw new Error(`Échec envoi confirmation: ${error.message}`);
    }
};

/**
 * Envoie un email pour une demande de contact du formulaire public
 *
 * @param {Object} data - Données du contact
 * @param {string} data.name - Nom du contact
 * @param {string} data.email - Email du contact
 * @param {string} data.subject - Sujet du message
 * @param {string} data.message - Corps du message
 * @returns {Promise<Object>} Résultat de l'envoi
 */
exports.sendContactMessage = async (data) => {
    console.log('📧 [Email] Processus demande de contact:', data.email);

    if (!transporter) {
        console.error('❌ [Email] Transporteur non initialisé');
        throw new Error('Service email non disponible - Vérifier configuration SMTP');
    }

    const { name, email, subject, message } = data;
    const teamEmail = process.env.SMTP_USER;

    // Email à l'équipe Orientys
    const teamEmailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvelle Demande de Contact - Orientys</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0a0615; color: #f7f7f8;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #18151c; border-radius: 12px; border: 1px solid #252426;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                                📬 Nouvelle Demande de Contact
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Contenu -->
                    <tr>
                        <td style="padding: 40px;">
                            <div style="background-color: #0a0615; border: 1px solid #7c3aed; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                <h3 style="color: #7c3aed; margin: 0 0 16px; font-size: 18px;">
                                    👤 Profil du Contact
                                </h3>
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 8px 0; width: 100px;">
                                            <strong style="color: #f7f7f8;">Nom :</strong>
                                        </td>
                                        <td style="padding: 8px 0; color: #b8b8ba;">
                                            ${name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <strong style="color: #f7f7f8;">Email :</strong>
                                        </td>
                                        <td style="padding: 8px 0;">
                                            <a href="mailto:${email}" style="color: #7c3aed; text-decoration: none;">
                                                ${email}
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background-color: #0a0615; border: 1px solid #252426; border-radius: 8px; padding: 24px;">
                                <h3 style="color: #7c3aed; margin: 0 0 16px; font-size: 18px;">
                                    📝 Message
                                </h3>
                                <div style="background-color: #18151c; border-left: 3px solid #7c3aed; padding: 16px; border-radius: 4px;">
                                    <h4 style="margin: 0 0 12px; color: #f7f7f8; font-size: 16px;">
                                        Sujet : ${subject}
                                    </h4>
                                    <p style="margin: 0; color: #b8b8ba; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                                        ${message}
                                    </p>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0a0615; padding: 24px; text-align: center; border-top: 1px solid #252426; border-radius: 0 0 12px 12px;">
                            <p style="color: #b8b8ba; font-size: 12px; margin: 0 0 8px;">
                                Reçu le ${new Date().toLocaleString('fr-FR')}
                            </p>
                            <p style="color: #b8b8ba; font-size: 12px; margin: 0;">
                                © ${new Date().getFullYear()} Orientys - Tous droits réservés
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    // Email de confirmation à l'utilisateur
    const userEmailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de Contact - Orientys</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0a0615; color: #f7f7f8;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #18151c; border-radius: 12px; border: 1px solid #252426;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                                ✅ Message Reçu
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Contenu -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #f7f7f8; margin: 0 0 20px; font-size: 20px;">
                                Bonjour ${name},
                            </h2>
                            
                            <p style="color: #b8b8ba; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                                Merci de nous avoir contactés. Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.
                            </p>
                            
                            <div style="background-color: #0a0615; border: 1px solid #7c3aed; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                <h3 style="color: #7c3aed; margin: 0 0 16px; font-size: 18px;">
                                    📋 Récapitulatif
                                </h3>
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 8px 0; width: 100px;">
                                            <strong style="color: #f7f7f8;">Email :</strong>
                                        </td>
                                        <td style="padding: 8px 0; color: #b8b8ba;">
                                            ${email}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <strong style="color: #f7f7f8;">Sujet :</strong>
                                        </td>
                                        <td style="padding: 8px 0; color: #b8b8ba;">
                                            ${subject}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background-color: #0a0615; border: 1px solid #252426; border-radius: 8px; padding: 24px;">
                                <h3 style="color: #7c3aed; margin: 0 0 16px; font-size: 18px;">
                                    ⏱️ Délai de Réponse
                                </h3>
                                <p style="color: #b8b8ba; font-size: 14px; line-height: 1.6; margin: 0;">
                                    L'équipe Orientys répondra à votre message sous 48 heures ouvrables.
                                </p>
                            </div>
                            
                            <p style="color: #b8b8ba; font-size: 14px; line-height: 1.6; margin-top: 24px;">
                                Cordialement,
                                <br>
                                <strong>L'équipe Orientys 🚀</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0a0615; padding: 24px; text-align: center; border-top: 1px solid #252426; border-radius: 0 0 12px 12px;">
                            <p style="color: #b8b8ba; font-size: 12px; margin: 0 0 8px;">
                                © ${new Date().getFullYear()} Orientys - Tous droits réservés
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    try {
        // Envoi de l'email à l'équipe
        await transporter.sendMail({
            from: `Orientys - Contact ${process.env.SMTP_USER}`,
            to: teamEmail,
            subject: `📬 Nouvelle Demande de Contact: ${subject}`,
            html: teamEmailContent,
            replyTo: email
        });

        // Envoi de la confirmation à l'utilisateur
        await transporter.sendMail({
            from: `Orientys - Support ${process.env.SMTP_USER}`,
            to: email,
            subject: '✅ Nous avons reçu votre message',
            html: userEmailContent
        });

        console.log('✅ [Email] Emails de contact envoyés avec succès');
        return {
            success: true,
            message: 'Message envoyé avec succès'
        };
    } catch (error) {
        console.error('❌ [Email] Erreur envoi contact:', error.message);
        throw new Error(`Échec envoi email contact: ${error.message}`);
    }
};

/**
 * Vérifie si le service email est disponible
 *
 * @returns {boolean} True si disponible
 */
exports.isAvailable = () => {
    return transporter !== null;
};

/**
 * Teste la connexion SMTP
 *
 * @returns {Promise<boolean>} True si connexion OK
 */
exports.testConnection = async () => {
    if (!transporter) {
        return false;
    }
    try {
        await transporter.verify();
        console.log('✅ [Email] Connexion SMTP OK');
        return true;
    } catch (error) {
        console.error('❌ [Email] Test connexion échoué:', error.message);
        return false;
    }
};