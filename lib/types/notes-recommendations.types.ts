/**
 * Types - Notes & Recommandations
 * @module lib/types/notes-recommendations.types
 */

// ========== NOTE ==========

export interface Note {
  id: string;
  userId: string;
  subjectId: string;
  serieId: string;
  value: number;
  coefficient?: number;
  subjectName?: string;
  createdAt: string; // ISO 8601
}

// ========== ORIENTATION ==========

/**
 * Diplôme simplifié dans une orientation IA.
 * ⚠️ Distinct de l'entité Degree de universities.types.ts
 */
export interface OrientationDegree {
  name: string;
  articleLink?: string;
}

/**
 * Université simplifiée dans une orientation IA.
 * ⚠️ Distinct de l'entité University de universities.types.ts
 */
export interface OrientationUniversity {
  name: string;
  site?: string;
  website?: string;
}

export interface Orientation {
  name: string;
  why: string;
  degrees: OrientationDegree[];
  universities: OrientationUniversity[];
}

// ========== RECOMMENDATION ==========

export interface Recommendation {
  id: string;
  userId: string;
  serieId: string;
  serieCode?: string;
  orientations: Orientation[];
  noteIds?: string[];
  createdAt: string; // ISO 8601
}

// ========== REQUESTS ==========

export interface SaveNotesRequest {
  notes: Array<{
    userId: string;
    subjectId: string;
    serieId: string;
    value: number;
  }>;
}

export interface CreateNoteRequest {
  userId: string;
  subjectId: string;
  serieId: string;
  value: number;
}

export interface SaveRecommendationRequest {
  serieId: string;
  orientations: Orientation[];
  noteIds: string[];
}

// moyenne des notes doit être ≥ 10/20
export interface GenerateRecommendationRequest {
  serieId: string;
  notes: Array<{
    id?: string;
    subjectId: string;
    value: number;
  }>;
  questionnaireId?: string;
}

// ========== RESPONSES ==========

export interface SaveNotesResponse {
  message: string;
  noteIds: string[];
}

export interface NotesListResponse {
  notes: Note[];
  count?: number;
}

export interface NoteResponse {
  note: Note;
  message?: string;
}

export interface CreateNoteResponse {
  message: string;
  noteId: string;
}

export interface SaveRecommendationResponse {
  message: string;
  id: string;
}

export interface GenerateRecommendationResponse {
  message: string;
  recommendation: Recommendation;
}

export interface RecommendationsListResponse {
  recommendations: Recommendation[];
  count?: number;
}

export interface RecommendationResponse {
  recommendation: Recommendation;
  message?: string;
}
