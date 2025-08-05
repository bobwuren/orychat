const UserModel = require('../models/userModel');
const {generateId} = require('../utils/idHelper');
const {comparePasswords, hashPassword} = require('../utils/passwordUtils');
const {generateAccessToken, generateRefreshToken, verifyRefreshToken} = require("../config/tokens/jwt");

exports.register = async ({email, password, role}) => {
    console.log('📝 [AuthService] Register user:', {email});
    const hashed = await hashPassword(password);
    const id = generateId();
    const refreshToken = generateRefreshToken({uid: id});
    const decodedRefresh = require('jsonwebtoken').decode(refreshToken);
    console.log(`🎫 [Auth Service] refreshToken: ${refreshToken}`);
    console.log(`🎫 [Auth Service] refreshToken exp: ${decodedRefresh.exp} (${new Date(decodedRefresh.exp * 1000)})`);
    const user = {
        id,
        role,
        email,
        password: hashed,
        refreshToken: refreshToken
    };

    try {
        await UserModel.create(user);
        const accessToken = generateAccessToken({uid: user.id});
        const decodedAccess = require('jsonwebtoken').decode(accessToken);
        console.log(`🎟 [Auth Service] accessToken: ${accessToken}`);
        console.log(`🎟 [Auth Service] accessToken exp: ${decodedAccess.exp} (${new Date(decodedAccess.exp * 1000)})`);
        console.log('✅ [AuthService] User registered:', user.id);
        return {user, accessToken, refreshToken};
    } catch (err) {
        console.log('❌ [AuthService] Error registering user:', err);
        throw err;
    }
};

exports.login = async ({email, password}) => {
    console.log('🔑 [AuthService] Login user:', email);
    const user = await UserModel.findByEmail(email);
    if (!user) throw new Error("Utilisateur introuvable");
    if (!password || !user.password) throw new Error("Mot de passe manquant ou invalide");
    if (!(await comparePasswords(password, user.password))) throw new Error("Identifiants invalides");
    try {
        const accessToken = generateAccessToken({uid: user.id});
        const refreshToken = generateRefreshToken({uid: user.id});

        const decodedRefresh = require('jsonwebtoken').decode(refreshToken);
        const decodedAccess = require('jsonwebtoken').decode(accessToken);
        console.log(`✨🎫 [Auth Service] refreshToken: ${refreshToken}`);
        console.log(`[Auth Service] refreshToken exp: ${decodedRefresh.exp} (${new Date(decodedRefresh.exp * 1000)})`);
        console.log(`✨🎟 [Auth Service] accessToken: ${accessToken}`);
        console.log(`[Auth Service] accessToken exp: ${decodedAccess.exp} (${new Date(decodedAccess.exp * 1000)})`);

        await UserModel.storeRefreshToken(user.id, refreshToken);

        console.log('✅ [AuthService] User logged in:', user.id);
        return {user, accessToken, refreshToken};
    } catch (err) {
        console.log('❌ [AuthService] Error logging in:', err);
        throw err;
    }
};

exports.refreshAccessToken = async (oldRefreshToken) => {
    console.log('🔄 [AuthService] Refresh token attempt');
    let decoded;
    try {
        decoded = verifyRefreshToken(oldRefreshToken);
        const decodedRefresh = require('jsonwebtoken').decode(oldRefreshToken);
        console.log(`🎫 [Auth Service] refreshToken reçu: ${oldRefreshToken}`);
        console.log(`🎫 [Auth Service] refreshToken exp: ${decodedRefresh.exp} (${new Date(decodedRefresh.exp * 1000)})`);
    } catch (err) {
        console.log('❌Error refreshing token: ', err);
        throw new Error('Refresh token expired or invalid');
    }

    const user = await UserModel.findById(decoded.uid);

    console.log(`📥 [AuthService] Token reçu: ${oldRefreshToken}`);
    console.log(`💾 [AuthService] Token en base: ${user ? user.refreshToken : 'Utilisateur non trouvé'}`);
    console.log(`📢 [AuthService] Comparaison (reçu === base):`, user ? user.refreshToken === oldRefreshToken : 'Utilisateur non trouvé');
    if (!user || user.refreshToken !== oldRefreshToken) throw new Error("Invalid or expired refresh token");

    //Rotation du refresh token
    const newRefreshToken = generateRefreshToken({uid: user.id});
    const newAccessToken = generateAccessToken({uid: user.id});
    const decodedNewRefresh = require('jsonwebtoken').decode(newRefreshToken);
    const decodedNewAccess = require('jsonwebtoken').decode(newAccessToken);
    console.log(`✨🎫 [Auth Service] newRefreshToken: ${newRefreshToken}`);
    console.log(`[Auth Service] newRefreshToken exp: ${decodedNewRefresh.exp} (${new Date(decodedNewRefresh.exp * 1000)})`);
    console.log(`✨🎟 [Auth Service] newAccessToken: ${newAccessToken}`);
    console.log(`[Auth Service] newAccessToken exp: ${decodedNewAccess.exp} (${new Date(decodedNewAccess.exp * 1000)})`);

    //Mettre à jour le refresh token en base
    try {
        await UserModel.updateRefreshToken(user.id, newRefreshToken);

        console.log('✅ [AuthService] Token refreshed for user:', user.id);
        return {refreshToken: newRefreshToken, accessToken: newAccessToken};
    } catch (err) {
        console.log('❌ [AuthService] Error refreshing token:', err);
        throw err;
    }
}