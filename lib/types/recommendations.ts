/* ======================== Types recommendations - Orientys ======================== */

export interface Degree {
  name: string;
  articleLink: string;
}

export interface University {
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

export interface GenerateRecommendationRequest {
  serieId: string;
  notes: Array<{
    id?: string;
    userId?: string;
    subjectId: string;
    serieId?: string;
    value: number;
  }>;
  questionnaireId?: string;
}

export interface GenerateRecommendationResponse {
  message: string;
  recommendation: Recommendation;
}
