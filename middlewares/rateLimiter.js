const rateLimit = require('express-rate-limit');

// Limitation générale
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requêtes par IP toutes les 15 minutes
  message: {
    error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitation stricte pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives de connexion par IP toutes les 15 minutes
  message: {
    error: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.'
  },
  skipSuccessfulRequests: true, // Ne pas compter les connexions réussies
});

module.exports = {
  generalLimiter,
  authLimiter
};
