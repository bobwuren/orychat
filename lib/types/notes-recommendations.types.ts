/**
 * =====================================================
 * Types - Notes & Recommandations
 * =====================================================
 * Définitions TypeScript pour notes et recommandations
 *
 * @module lib/types/notes-recommendations.types
 * @version 1.0
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
  createdAt: string;
}

// ========== RECOMMENDATION ==========
interface Degree {
  name: string;
  articleLink?: string;
}

interface University {
  name: string;
  site?: string;
  website?: string;
}

export interface Orientation {
  name: string;
  why: string;
  degrees: Degree[];
  universities: University[];
}

export interface Recommendation {
  id: string;
  userId: string;
  serieId: string;
  serieCode?: string;
  orientations: Orientation[];
  noteIds?: string[];
  createdAt: string;
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
