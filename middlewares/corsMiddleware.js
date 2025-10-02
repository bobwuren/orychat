const cors = require("cors");

const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // En développement, tout autoriser
    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    
    // En production, vérifier les origines autorisées
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❗ Tentative d'accès non autorisée: Origin=${origin}`);
      callback(new Error("Accès interdit: origine non autorisée"), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'], // Toutes les méthodes
  allowedHeaders: ['*'] // ← Autorise TOUS les headers
};

module.exports = cors(corsOptions);