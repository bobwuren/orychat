/**
 * =====================================================
 * API - Index - CORRIGÉ
 * =====================================================
 * Export centralisé de tous les clients API
 *
 * @module lib/api
 * @version 1.1
 */

// Client principal
export { ApiClient, ApiError, apiClient } from "./client";
export type { ApiResponse, ApiSuccess, ApiFailure } from "./client";

// Exports des fonctions d'authentification
export * from "./auth.api";

// Exports des classes et instances
export { seriesApi, SeriesApi } from "./series.api";
export { subjectsApi, SubjectsApi } from "./subjects.api";
export { notesApi, NotesApi } from "./notes.api";
export { recommendationsApi, RecommendationsApi } from "./recommendations.api";
export { universitiesApi, UniversitiesApi } from "./universities.api";
export { degreesApi, DegreesApi } from "./degrees.api";
export { questionnaireApi, QuestionnaireApi } from "./questionnaire.api";
export { counselorsApi, CounselorsApi } from "./counselors.api";
export { consultationsApi, ConsultationsApi } from "./consultations.api";
