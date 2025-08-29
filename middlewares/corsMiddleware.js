const cors = require("cors");

const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL];

const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin || req.headers.referer || "inconnue";

  if (process.env.NODE_ENV === "production") {
    if (!allowedOrigins.includes(origin)) {
      console.warn(`❗ Tentative d'accès non autorisée: IP=${req.ip}, URL=${req.originalUrl}, Origin=${origin}`);
      return res.status(403).json({error: "Accès interdit: origine non autorisée"});
    }
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