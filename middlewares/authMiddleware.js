const {verifyAccessToken} = require('../config/tokens/jwt');
const UserModel = require('../models/userModel');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('❕ [Auth Middleware] Incoming request:', req.method, req.originalUrl);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❗ [Auth Middleware] No or malformed token:', authHeader);
        return res.status(401).json({
            error: 'Unauthorized access: Token missing or malformed'
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyAccessToken(token);
        //On recupere le role de l'utilisateur
        const user = await UserModel.findById(decoded.userId);
        if (!user) return res.status(401).json({
            error: 'Unauthorized access: User not found'
        })
        req.user = {id: decoded.userId, role: user.role};
        console.log(`✅ [Auth Middleware] Token OK for user: ${decoded.userId}`);
        next();
    } catch (error) {
        console.log('[Auth Middleware Error]:', error);
        return res.status(403).json({error: "Invalid token or expired"});
    }
}