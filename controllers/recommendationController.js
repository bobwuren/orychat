const RecommendationModel = require("../models/recommendationModel");
const aiService = require("../services/aiService");
const { Parser } = require("json2csv");

exports.generateRecommendation = async (req, res) => {
  const { serieId, notes } = req.body;
  const userId = req.user.id;
  console.log("🤖 [Reco] Generate recommendation:", { userId, serieId, notes });
  if (!serieId || !Array.isArray(notes)) {
    console.log("❗ [Reco] Invalid input data:", { serieId, notes });
    return res
      .status(400)
      .json({ error: "Invalid input data. Please provide serieId and notes." });
  }
  try {
    // 1. Sauvegarder les notes en base et récupérer leurs ids
    const NoteModel = require("../models/noteModel");
    const savedNoteIds = [];
    for (const note of notes) {
      const { userId: nUserId, subjectId, serieId: nSerieId, value } = note;
      // On utilise l'userId du token si non fourni
      const noteId = await NoteModel.save({
        userId: nUserId || userId,
        subjectId,
        serieId: nSerieId || serieId,
        value,
      });
      savedNoteIds.push(noteId);
    }
    // 2. Reconstituer les notes avec leurs ids
    const notesWithIds = notes.map((note, idx) => ({ ...note, id: savedNoteIds[idx] }));
    // 3. Générer la recommandation avec les notes sauvegardées
    const recommendation = await aiService.getRecommendation({
      userId,
      serieId,
      notes: notesWithIds,
    });
    // 4. Sauvegarder la recommandation
    const recommendationId = await RecommendationModel.save({
      userId: recommendation.userId,
      serieId: recommendation.serieId,
      orientations: recommendation.orientations,
      noteIds: recommendation.noteIds,
    });
    const allSeries = await require("../models/serieModel").getAll();
    const serieCode = allSeries.find(
      (s) => s.id === recommendation.serieId
    )?.code;
    console.warn("\n💾💾Saved Recommendation: ", recommendationId);
    // On récupère la recommandation complète pour la réponse
    const savedReco = await RecommendationModel.getById(recommendationId);
    console.log(
      "✅ [Reco] Recommendation generated & saved:",
      recommendationId
    );

    return res.status(200).json({
      message: "Recommendation generated successfully",
      recommendation: {
        ...savedReco,
        serieCode,
      },
    });
  } catch (error) {
    console.error("❌ [Reco] Error generating recommendation:", error);
    return res.status(500).json({
      error: `An error occurred while generating the recommendation: ${error.message}`,
    });
  }
};

exports.saveRecommendation = async (req, res) => {
  try {
    const { serieId, orientations, noteIds } = req.body;
    console.log("💾 [Reco] Save recommendation:", {
      userId: req.user.id,
      serieId,
      orientations,
      noteIds,
    });
    if (!serieId || !orientations || !Array.isArray(noteIds))
      return res.status(400).json({
        error:
          "Invalid input data. Please provide serieId, orientations, and noteIds.",
      });
    const userId = req.user.id;
    const recommendationId = await RecommendationModel.save({
      userId,
      serieId,
      orientations,
      noteIds,
    });
    console.log("✅ [Reco] Recommendation saved:", recommendationId);
    return res.status(201).json({
      message: "Recommendation saved successfully",
      id: recommendationId,
    });
  } catch (error) {
    console.error("❌ [Reco] Error saving recommendation:", error);
    return res.status(500).json({
      error: `An error occurred while saving the recommendation: ${error.message}`,
    });
  }
};

exports.getUserRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔎 [Reco] Get recommendations for user:", userId);
    const recommendations = await RecommendationModel.getByUserId(userId);
    const SerieModel = require("../models/serieModel");
    const allSeries = await SerieModel.getAll();
    const mapped = recommendations.map((r) => {
      const serie = allSeries.find((s) => s.id === r.serieId);
      return {
        ...r,
        serieCode: serie ? serie.code : null,
      };
    });
    console.log("✅ [Reco] User recommendations fetched:", mapped.length);
    return res.status(200).json({ recommendations: mapped });
  } catch (error) {
    console.error("❌ [Reco] Error fetching user recommendations:", error);
    return res.status(500).json({
      error: `An error occurred while fetching recommendations: ${error.message}`,
    });
  }
};

// Exporter toutes les recommandations (CSV ou JSON)
exports.exportRecommendations = async (req, res) => {
  try {
    const format = req.query.format || "json";
    const recos = await RecommendationModel.getAll();
    if (format === "csv") {
      const parser = new Parser({
        fields: [
          "id",
          "userId",
          "serieId",
          "orientations",
          "noteIds",
          "createdAt",
        ],
      });
      const csv = parser.parse(
        recos.map((r) => ({
          ...r,
          orientations: JSON.stringify(r.orientations),
          noteIds: r.noteIds ? JSON.stringify(r.noteIds) : null,
        }))
      );
      res.header("Content-Type", "text/csv");
      res.attachment("recommendations.csv");
      return res.send(csv);
    } else {
      res.header("Content-Type", "application/json");
      return res.json({ recommendations: recos });
    }
  } catch (error) {
    console.log("❌ [Reco] Erreur export:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getAllRecommendations = async (req, res) => {
  try {
    console.log("🔎 [Reco] Récupération de toutes les recommandations");
    const recos = await RecommendationModel.getAll();
    console.log("✅ [Reco] Recommandations récupérées:", recos.length);
    return res.status(200).json({ recommendations: recos });
  } catch (error) {
    console.log(
      "❌ [Reco] Erreur lors de la récupération de toutes les recommandations:",
      error
    );
    return res.status(500).json({ error: error.message });
  }
};

exports.getRecommendationById = async (req, res) => {
  try {
    console.log(
      `🔎 [Reco] Récupération de la recommandation ID: ${req.params.id}`
    );
    const reco = await RecommendationModel.getById(req.params.id);
    if (!reco) {
      console.log("⚠️ [Reco] Recommendation non trouvée");
      return res.status(404).json({ error: "Recommendation non trouvée" });
    }
    console.log("✅ [Reco] Recommendation trouvée");
    return res.status(200).json(reco);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};