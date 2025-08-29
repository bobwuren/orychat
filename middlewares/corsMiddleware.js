const cors = require("cors");

const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL];

const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin || req.headers.referer || "inconnue";

  // Log seulement si l'origine n'est pas autorisée
  if (!allowedOrigins.includes(origin)) {
    console.warn(`❗ Tentative d'accès non autorisée: IP=${req.ip}, URL=${req.originalUrl}, Origin=${origin}`);
  }

  // Configuration CORS selon l'environnement
  if (process.env.NODE_ENV === "production") {
    return cors({
      origin: allowedOrigins,
      credentials: true
    })(req, res, next);
  } else {
    return cors({
      origin: true,
      credentials: true
    })(req, res, next);
  }
};

module.exports = corsMiddleware;