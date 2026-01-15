const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require('cors');

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
const counselorRoutes = require('./routes/counselorRoutes');
const questionnaireRoutes = require('./routes/questionnaireRoutes');
const consultationRoutes = require('./routes/consultationRoutes'); // AJOUTER

const app = express();

// CORS: autoriser le frontend (NEXT_PUBLIC_API_URL ou FRONTEND_URL)
const allowedOrigin = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL || `http://localhost:${process.env.PORT || 3000}`;
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));
// Répondre aux préflights globalement
app.options('*', cors());

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
app.use('/api/counselors', counselorRoutes);
app.use('/api/consultations', consultationRoutes);

// Gestion d'erreurs globale
app.use(notFoundHandler);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Serveur running on port ${PORT}`);
  console.log(`📖 Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;