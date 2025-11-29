const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const notFoundHandler = require("./middlewares/notFoundHandler");
const healthCheck = require("./middlewares/healthCheck");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const timerMiddleware = require("./middlewares/timerMiddleware");
const bruteForce = require("./middlewares/bruteForce");
const {generalLimiter} = require("./middlewares/rateLimiter");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const serieRoutes = require("./routes/serieRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const universityRoutes = require("./routes/universityRoutes");
const degreeRoutes = require("./routes/degreeRoutes");
const questionnaireRoutes = require('./routes/questionnaireRoutes');

const app = express();

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Orientys API",
      version: "1.0.0",
      description: "API pour l'application d'orientation scolaire Orientys",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Cors configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, permissions');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Répondre immédiatement aux requêtes OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});


// Middleware de sécurité basique
app.use(express.json({limit: '10mb'})); // Limiter la taille des requêtes

// Middleware de limitation de requêtes
app.use(generalLimiter);

// Middleware de protection contre les attaques par force brute
app.use(bruteForce);

// Timer middleware
app.use(timerMiddleware);

// Documentation SEULEMENT en développement et PROTÉGÉE
if (process.env.NODE_ENV !== "production") app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/health", healthCheck);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/series", serieRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/degrees", degreeRoutes);
app.use('/api/questionnaire', questionnaireRoutes);

// Gestion d'erreurs globale
app.use(notFoundHandler);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Serveur running on port ${PORT}`);
  console.log(`📖 Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;