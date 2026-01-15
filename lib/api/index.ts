/**
 * =====================================================
 * API - Index
 * =====================================================
 * Export centralisé de tous les clients API
 *
 * @module lib/api
 * @version 1.0
 */

// Client principal
export { apiClient, ApiClient, ApiError } from "./client";
export type { ApiResponse } from "./client";

// Clients API par catégorie
export { authApi, AuthApi } from "./auth.api";
export { seriesApi, SeriesApi } from "./series.api";
export { subjectsApi, SubjectsApi } from "./subjects.api";
export { notesApi, NotesApi } from "./notes.api";
export { recommendationsApi, RecommendationsApi } from "./recommendations.api";
export { universitiesApi, UniversitiesApi } from "./universities.api";
export { degreesApi, DegreesApi } from "./degrees.api";
export { questionnaireApi, QuestionnaireApi } from "./questionnaire.api";
export { counselorsApi, CounselorsApi } from "./counselors.api";
export { consultationsApi, ConsultationsApi } from "./consultations.api";
