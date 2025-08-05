#!/usr/bin/env node

const nodemailer = require('nodemailer');
const readline = require('readline');
const authController = require('../controllers/authController');

// Interface interactive
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Config email simple (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.GMAIL_USER}`,
        pass: process.env.GMAIL_APPLICATION_PASSWORD
    }
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function createAdminWithEmail() {
    try {
        console.log('🚀 Script de création d\'admin avec envoi d\'email\n');

        // Demander l'email de manière interactive
        const adminEmail = await askQuestion('📧 Email de l\'admin à créer: ');
        
        if (!adminEmail || !adminEmail.includes('@')) {
            console.log('❌ Email invalide!');
            rl.close();
            return;
        }

        console.log(`\n⏳ Création de l'admin pour: ${adminEmail}`);

        // Simuler une requête HTTP pour appeler le controller
        const mockReq = {
            body: { email: adminEmail }
        };

        let adminData = null;
        const mockRes = {
            status: (code) => ({
                json: (data) => {
                    if (code === 201) {
                        adminData = data;
                        console.log('✅ Admin créé avec succès!');
                        console.log(`👤 ID: ${data.user.id}`);
                        console.log(`📧 Email: ${data.user.email}`);
                        console.log(`🔐 Password: ${data.credentials.password}`);
                    } else {
                        console.log(`❌ Erreur (${code}):`, data);
                        throw new Error(data.error || 'Erreur inconnue');
                    }
                }
            })
        };

        // Appeler directement le controller
        await authController.createAdminUser(mockReq, mockRes);

        if (!adminData) {
            throw new Error('Échec de la création admin');
        }

        // Envoyer l'email
        console.log('\n📬 Envoi de l\'email...');
        
        await transporter.sendMail({
            from: process.env.GMAIL_USER, // ⬅️ MÊME EMAIL QUE CI-DESSUS
            to: adminEmail,
            subject: '🔑 Vos identifiants administrateur - Orientys',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Identifiants Administrateur Orientys</title>
                    <!--[if mso]>
                    <noscript>
                        <xml>
                            <o:OfficeDocumentSettings>
                                <o:PixelsPerInch>96</o:PixelsPerInch>
                            </o:OfficeDocumentSettings>
                        </xml>
                    </noscript>
                    <![endif]-->
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0a0615; color: #f7f7f8; line-height: 1.6; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0a0615; margin: 0; padding: 0;">
                        <tr>
                            <td align="center" style="padding: 40px 20px;">
                                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #0a0615; border: 1px solid #252426; border-radius: 12px;">
                                    
                                    <!-- Header -->
                                    <tr>
                                        <td style="background-color: #7c3aed; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                <tr>
                                                    <td style="text-align: center;">
                                                        <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 1px;">ORIENTYS</h1>
                                                        <p style="color: #ffffff; margin: 10px 0 0; font-size: 16px; font-weight: normal; opacity: 0.9;">Plateforme d'orientation scolaire</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <!-- Contenu principal -->
                                    <tr>
                                        <td style="padding: 50px 40px; background-color: #0a0615;">
                                            
                                            <!-- Titre principal -->
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 40px;">
                                                <tr>
                                                    <td style="text-align: center;">
                                                        <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px; background-color: #18151c; border: 1px solid #7c3aed; border-radius: 50px; padding: 15px;">
                                                            <tr>
                                                                <td style="text-align: center; font-size: 32px;">🔐</td>
                                                            </tr>
                                                        </table>
                                                        <h2 style="margin: 0; color: #f7f7f8; font-size: 24px; font-weight: bold;">Compte Administrateur Créé</h2>
                                                        <p style="margin: 12px 0 0; color: #b8b8ba; font-size: 16px;">Bienvenue dans l'interface d'administration Orientys</p>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Boîte des identifiants -->
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18151c; border: 1px solid #252426; border-radius: 8px; margin: 32px 0;">
                                                <tr>
                                                    <td style="padding: 30px; border-left: 3px solid #7c3aed;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td>
                                                                    <h3 style="margin: 0 0 25px; color: #f7f7f8; font-size: 18px; font-weight: bold;">
                                                                        🔑 Vos identifiants de connexion
                                                                    </h3>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        
                                                        <!-- Email -->
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
                                                            <tr>
                                                                <td style="padding: 8px 0; width: 120px; vertical-align: top;">
                                                                    <span style="font-weight: bold; color: #b8b8ba; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">EMAIL</span>
                                                                </td>
                                                                <td style="padding: 8px 0;">
                                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                                        <tr>
                                                                            <td style="background-color: #0a0615; border: 1px solid #252426; border-radius: 6px; padding: 12px 16px;">
                                                                                <span style="color: #7c3aed; font-weight: 500; font-size: 14px; font-family: 'Courier New', monospace;">${adminData.credentials.email}</span>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        
                                                        <!-- Mot de passe -->
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="padding: 8px 0; width: 120px; vertical-align: top;">
                                                                    <span style="font-weight: bold; color: #b8b8ba; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">MOT DE PASSE</span>
                                                                </td>
                                                                <td style="padding: 8px 0; position: relative;">
                                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                                        <tr>
                                                                            <td style="background-color: #0a0615; border: 1px solid #252426; border-radius: 6px; padding: 12px 16px; position: relative;">
                                                                                <span style="color: #7c3aed; font-weight: bold; font-size: 16px; font-family: 'Courier New', monospace; letter-spacing: 1px;">${adminData.credentials.password}</span>
                                                                                <span style="background-color: #7c3aed; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-left: 10px;">TEMP</span>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Alerte sécurité -->
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #2a1810; border: 1px solid: #d96c34; border-radius: 8px; margin: 24px 0;">
                                                <tr>
                                                    <td style="padding: 20px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="width: 40px; vertical-align: top; text-align: center;">
                                                                    <span style="font-size: 20px;">⚠️</span>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <h4 style="margin: 0 0 8px; color: #ea7845; font-size: 16px; font-weight: bold;">Sécurité importante</h4>
                                                                    <p style="margin: 0; color: #b8b8ba; font-size: 14px; line-height: 1.5;">
                                                                        Pour votre sécurité, <strong style="color: #f7f7f8;">changez immédiatement</strong> ce mot de passe temporaire lors de votre première connexion.
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Étapes suivantes -->
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18151c; border: 1px solid #252426; border-radius: 8px; margin: 24px 0;">
                                                <tr>
                                                    <td style="padding: 24px;">
                                                        <h4 style="margin: 0 0 20px; color: #f7f7f8; font-size: 16px; font-weight: bold;">
                                                            🚀 Prochaines étapes
                                                        </h4>
                                                        
                                                        <!-- Étape 1 -->
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 12px;">
                                                            <tr>
                                                                <td style="width: 30px; vertical-align: top;">
                                                                    <table cellpadding="0" cellspacing="0" border="0">
                                                                        <tr>
                                                                            <td style="background-color: #7c3aed; color: white; width: 20px; height: 20px; border-radius: 50%; text-align: center; font-size: 12px; font-weight: bold; line-height: 20px;">1</td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <td style="vertical-align: top; padding-left: 12px;">
                                                                    <span style="color: #b8b8ba; font-size: 14px;">Connectez-vous à l'interface d'administration</span>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        
                                                        <!-- Étape 2 -->
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 12px;">
                                                            <tr>
                                                                <td style="width: 30px; vertical-align: top;">
                                                                    <table cellpadding="0" cellspacing="0" border="0">
                                                                        <tr>
                                                                            <td style="background-color: #7c3aed; color: white; width: 20px; height: 20px; border-radius: 50%; text-align: center; font-size: 12px; font-weight: bold; line-height: 20px;">2</td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <td style="vertical-align: top; padding-left: 12px;">
                                                                    <span style="color: #b8b8ba; font-size: 14px;">Modifiez votre mot de passe et profil</span>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        
                                                        <!-- Étape 3 -->
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="width: 30px; vertical-align: top;">
                                                                    <table cellpadding="0" cellspacing="0" border="0">
                                                                        <tr>
                                                                            <td style="background-color: #7c3aed; color: white; width: 20px; height: 20px; border-radius: 50%; text-align: center; font-size: 12px; font-weight: bold; line-height: 20px;">3</td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <td style="vertical-align: top; padding-left: 12px;">
                                                                    <span style="color: #b8b8ba; font-size: 14px;">Explorez les fonctionnalités d'administration</span>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Contact -->
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #252426;">
                                                <tr>
                                                    <td style="text-align: center;">
                                                        <p style="margin: 0 0 8px; color: #b8b8ba; font-size: 14px;">
                                                            Besoin d'aide ? Contactez notre équipe technique
                                                        </p>
                                                        <p style="margin: 0; color: #f7f7f8; font-size: 14px; font-weight: bold;">
                                                            L'équipe Orientys
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #18151c; padding: 24px 40px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #252426;">
                                            <p style="margin: 0 0 8px; color: #b8b8ba; font-size: 12px;">
                                                Email généré automatiquement le ${new Date().toLocaleString('fr-FR')}
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
            `
        });

        console.log('✅ Email envoyé avec succès!');
        console.log('\n🎉 Processus terminé avec succès!');

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
    } finally {
        rl.close();
    }
}

// Lancer le script
createAdminWithEmail();
