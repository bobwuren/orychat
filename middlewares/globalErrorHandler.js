const globalErrorHandler = (err, req, res, next) => {
    // Log de l'erreur
    console.error(`🔥 Erreur: ${err.message || 'Erreur inconnue'}`);
    console.error(`📍 Route: ${req.method} ${req.originalUrl}`);
    
    // En développement, on affiche la stack trace
    if (process.env.NODE_ENV === 'development') {
        console.error('Stack:', err.stack);
    }

    // Déterminer le status code
    const statusCode = err.statusCode || err.status || 500;
    
    // Message d'erreur
    const message = process.env.NODE_ENV === 'production' 
        ? (statusCode >= 500 ? 'Erreur serveur interne' : err.message)
        : err.message;

    // Réponse d'erreur standardisée
    res.status(statusCode).json({
        error: true,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = globalErrorHandler;
