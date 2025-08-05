module.exports = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) {
        console.log('❗ Accès non autorisé: rôle insuffisant');
        return res.status(403).json({error: 'Accès non autorisé: rôle insuffisant'});
    }
    next();
};