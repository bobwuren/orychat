const UserModel = require('../models/userModel');
const AuthService = require('../services/authService');
const validator = require('validator');
const generatePassword = require('generate-password');

exports.register = async (req, res) => {
    const {email, password, role} = req.body;
    console.log('📝 [Auth] Tentative inscription:', {email, password, role});

    if (!email || !password) {
        console.log('⚠️ [Auth] Échec inscription: champs manquants');
        return res.status(400).json({error: 'Tous les champs sont requis'});
    }

    if (!validator.isEmail(email)) {
        console.log('⚠️ [Auth] Échec inscription: email invalide');
        return res.status(400).json({error: 'Format d\'email invalide'});
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        console.log('⚠️ [Auth] Échec inscription: mot de passe faible');
        return res.status(400).json({error: 'Le mot de passe doit faire au moins 8 caractères, contenir une majuscule, une minuscule et un chiffre'});
    }

    // Vérification du rôle si fourni
    const allowedRoles = ['admin', 'client'];
    if (role && !allowedRoles.includes(role)) {
        console.log('⚠️ [Auth] Échec inscription: rôle non autorisé');
        return res.status(400).json({error: 'Rôle non autorisé'});
    }

    try {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            console.log('⚠️ [Auth] Échec inscription: utilisateur existe déjà:', email);
            return res.status(409).json({error: 'Utilisateur déjà existant'});
        }

        const userRole = role ? role : 'client'; // Par défaut, le rôle est 'client'
        const response = await AuthService.register({email, password, role: userRole});
        console.log('✅ [Auth] Utilisateur inscrit:', response.user.email);
        return res.status(201).json({
            message: 'Utilisateur inscrit avec succès',
            user: {
                id: response.user.id,
                email: response.user.email,
                role: response.user.role
            },
            refreshToken: response.refreshToken,
            accessToken: response.accessToken,
        });
    } catch (e) {
        console.log("❌ [Auth] Erreur inscription:", e.message);
        return res.status(500).json({error: 'Erreur interne du serveur'});
    }
};

exports.login = async (req, res) => {
    const {email, password} = req.body;
    console.log('🔑 [Auth] Tentative connexion:', email);

    if (!email || !password) {
        console.log('⚠️ [Auth] Échec connexion: champs manquants');
        return res.status(400).json({error: 'Email et mot de passe requis'});
    }

    try {
        const response = await AuthService.login({email, password});
        console.log('✅ [Auth] Utilisateur connecté:', response.user.email);
        return res.status(200).json({
            message: 'Connexion réussie',
            user: {
                id: response.user.id,
                email: response.user.email,
                role: response.user.role
            },
            refreshToken: response.refreshToken,
            accessToken: response.accessToken,
        });
    } catch (e) {
        console.log('❌ [Auth] Erreur connexion:', e.message);
        return res.status(401).json({error: 'Identifiants invalides'});
    }
};

exports.logout = async (req, res) => {
    const {refreshToken} = req.body;
    console.log('🚪 [Auth] Tentative déconnexion');

    if (!refreshToken) {
        console.log('⚠️ [Auth] Échec déconnexion: token manquant');
        return res.status(400).json({error: 'Token requis'});
    }

    try {
        const decoded = require('../config/tokens/jwt').verifyRefreshToken(refreshToken);
        const user = await UserModel.findById(decoded.uid);
        console.log('🔍 [Auth] Vérification token:', user && user.refreshToken === refreshToken ? '✅ Les tokens concordent' : '❌ Les tokens ne concordent pas 💀');
        if (!user || user.refreshToken !== refreshToken) {
            console.log('⚠️ [Auth] Déconnexion: utilisateur introuvable ou token non concordant');
            return res.status(200).json({message: 'Utilisateur déconnecté'});
        }

        await UserModel.updateRefreshToken(user.id, null);
        console.log('✅ [Auth] Utilisateur déconnecté:', user.id);
        return res.status(200).json({message: 'Déconnexion réussie'});
    } catch (e) {
        console.log('❌ [Auth] Erreur déconnexion:', e.message);
        return res.status(401).json({error: 'Erreur lors de la déconnexion'});
    }
};

exports.refresh = async (req, res) => {
    const {refreshToken} = req.body;
    console.log('🔄 [Auth] Tentative refresh token');

    if (!refreshToken) {
        console.log('⚠️ [Auth] Refresh: token manquant');
        return res.status(400).json({error: 'Token requis'});
    }

    try {
        const tokens = await AuthService.refreshAccessToken(refreshToken);
        console.log('✅ [Auth] Token rafraîchi');
        return res.status(200).json(tokens);
    } catch (err) {
        console.log('❌ [Auth] Erreur refresh token:', err.message);
        return res.status(401).json({error: 'Token invalide ou expiré'});
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        console.log('🔎 [User] Récupération de tous les utilisateurs');
        const users = await UserModel.getAll();
        console.log('✅ [User] Utilisateurs récupérés');
        return res.status(200).json({
            users: users.map(user => ({
                id: user.id,
                role: user.role,
                email: user.email
            }))
        });
    } catch (error) {
        console.error('❌ [User] Erreur récupération utilisateurs:', error);
        return res.status(500).json({error: 'Erreur lors de la récupération des utilisateurs'});
    }
};

exports.getUserById = async (req, res) => {
    try {
        console.log('🔎 [User] Récupération utilisateur par ID:', req.params.id);
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            console.log('⚠️ [User] Utilisateur non trouvé:', req.params.id);
            return res.status(404).json({error: 'Utilisateur non trouvé'});
        }
        console.log('✅ [User] Utilisateur trouvé:', user.id);
        return res.status(200).json({
            user: {
                id: user.id,
                role: user.role,
                email: user.email
            }
        });
    } catch (error) {
        console.error('❌ [User] Erreur récupération utilisateur:', error);
        return res.status(500).json({error: 'Erreur lors de la récupération de l\'utilisateur'});
    }
};

exports.updateUserById = async (req, res) => {
    try {
        const {email, role, password} = req.body;
        console.log('🛠️ [User] Mise à jour utilisateur:', req.params.id, {email, role, password: password ? '[HIDDEN]' : 'none'});
        
        // Vérifier qu'au moins un champ est fourni
        if (!email && !role && !password) {
            console.log('⚠️ [User] Aucun champ à mettre à jour');
            return res.status(400).json({error: 'Aucun champ à mettre à jour fourni'});
        }
        
        const updateData = {};
        
        // Validation et ajout de l'email
        if (email) {
            if (!validator.isEmail(email)) {
                console.log('⚠️ [User] Email invalide:', email);
                return res.status(400).json({error: 'Format d\'email invalide'});
            }
            updateData.email = email;
        }
        
        // Validation et ajout du rôle
        if (role) {
            const allowedRoles = ['admin', 'client'];
            if (!allowedRoles.includes(role)) {
                console.log('⚠️ [User] Rôle non autorisé:', role);
                return res.status(400).json({error: 'Rôle non autorisé'});
            }
            updateData.role = role;
        }
        
        // Validation et ajout du mot de passe
        if (password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(password)) {
                console.log('⚠️ [User] Mot de passe faible');
                return res.status(400).json({error: 'Le mot de passe doit faire au moins 8 caractères, contenir une majuscule, une minuscule et un chiffre'});
            }
            // Hasher le nouveau mot de passe
            const bcrypt = require('bcrypt');
            updateData.password = await bcrypt.hash(password, 10);
        }
        
        const updated = await UserModel.updateById(req.params.id, updateData);
        if (!updated) {
            console.log('⚠️ [User] Utilisateur non trouvé ou rien à mettre à jour:', req.params.id);
            return res.status(404).json({error: 'Utilisateur non trouvé ou aucun champ à mettre à jour'});
        }
        
        console.log('✅ [User] Utilisateur mis à jour:', req.params.id);
        const updatedUser = await UserModel.findById(req.params.id);
        return res.status(200).json({
            message: 'Utilisateur mis à jour', 
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error('❌ [User] Erreur mise à jour utilisateur:', error);
        return res.status(500).json({error: 'Erreur lors de la mise à jour de l\'utilisateur'});
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        console.log('🗑️ [User] Suppression utilisateur:', req.params.id);
        const deleted = await UserModel.deleteById(req.params.id);
        if (!deleted) {
            console.log('⚠️ [User] Utilisateur non trouvé pour suppression:', req.params.id);
            return res.status(404).json({error: 'Utilisateur non trouvé'});
        }
        console.log('✅ [User] Utilisateur supprimé:', req.params.id);
        return res.status(200).json({message: 'Utilisateur supprimé'});
    } catch (error) {
        console.error('❌ [User] Erreur suppression utilisateur:', error);
        return res.status(500).json({error: 'Erreur lors de la suppression de l\'utilisateur'});
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const {role} = req.body;
        console.log('🛡️ [User] Mise à jour rôle utilisateur:', req.params.id, role);
        if (!role) {
            console.log('⚠️ [User] Rôle manquant pour mise à jour');
            return res.status(400).json({error: 'Rôle requis'});
        }
        const allowedRoles = ['admin', 'client'];
        if (!allowedRoles.includes(role)) {
            console.log('⚠️ [User] Rôle non autorisé:', role);
            return res.status(400).json({error: 'Rôle non autorisé'});
        }
        const updated = await UserModel.updateRole(req.params.id, role);
        if (!updated) {
            console.log('⚠️ [User] Utilisateur non trouvé pour mise à jour rôle:', req.params.id);
            return res.status(404).json({error: 'Utilisateur non trouvé'});
        }
        console.log('✅ [User] Rôle utilisateur mis à jour:', req.params.id, role);
        return res.status(200).json({message: 'Rôle utilisateur mis à jour'});
    } catch (error) {
        console.error('❌ [User] Erreur mise à jour rôle utilisateur:', error);
        return res.status(500).json({error: 'Erreur lors de la mise à jour du rôle utilisateur'});
    }
};

// Créer un utilisateur admin (route protégée admin)
exports.createAdminUser = async (req, res) => {
    const {email} = req.body;
    console.log('👑 [Auth] Tentative création utilisateur admin:', {email});

    if (!email) {
        console.log('⚠️ [Auth] Échec création admin: email manquant');
        return res.status(400).json({error: 'Email requis'});
    }

    if (!validator.isEmail(email)) {
        console.log('⚠️ [Auth] Échec création admin: email invalide');
        return res.status(400).json({error: 'Format d\'email invalide'});
    }

    try {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            console.log('⚠️ [Auth] Échec création admin: utilisateur existe déjà:', email);
            return res.status(409).json({error: 'Utilisateur déjà existant'});
        }

        // Générer un mot de passe sécurisé automatiquement
        const generatedPassword = generatePassword.generate({
            length: 12,
            numbers: true,
            symbols: false,
            lowercase: true,
            uppercase: true,
            excludeSimilarCharacters: true
        });

        const response = await AuthService.register({email, password: generatedPassword, role: 'admin'});
        console.log('✅ [Auth] Utilisateur admin créé:', response.user.email);
        
        return res.status(201).json({
            message: 'Utilisateur admin créé avec succès',
            user: {
                id: response.user.id,
                email: response.user.email,
                role: response.user.role
            },
            credentials: {
                email: response.user.email,
                password: generatedPassword
            }
        });
    } catch (error) {
        console.error('❌ [Auth] Erreur création admin:', error);
        return res.status(500).json({error: 'Erreur lors de la création de l\'utilisateur admin'});
    }
};
