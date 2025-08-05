const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const notFoundHandler = require("./middlewares/notFoundHandler");
const healthCheck = require("./middlewares/healthCheck");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const timerMiddleware = require("./middlewares/timerMiddleware");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const serieRoutes = require("./routes/serieRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const universityRoutes = require("./routes/universityRoutes");
const degreeRoutes = require("./routes/degreeRoutes");

const app = express();
dotenv.config();

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

// CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.CLIENT_URL, process.env.ADMIN_URL]
        : true,
    credentials: true,
  })
);

app.use(express.json());

// Timer middleware
app.use(timerMiddleware);

// Documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

// Gestion d'erreurs globale
app.use(notFoundHandler);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`✅ Serveur running on port ${PORT}`);
  console.log(`📖 Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;