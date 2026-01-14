/**
 * =====================================================
 * Types - Séries & Matières
 * =====================================================
 * Définitions TypeScript pour les séries et matières
 *
 * @module lib/types/academic.types
 * @version 1.0
 */

// ========== SUBJECT ==========
export interface Subject {
  id: string;
  name: string;
  description?: string;
  code?: string;
  coefficient?: number;
  isCore?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectCoefficient {
  serieId: string;
  seriesName?: string;
  coefficient: number;
}

export interface SubjectWithCoefficients extends Subject {
  serieId?: string;
  seriesName?: string;
  seriesCoefficients?: SubjectCoefficient[];
}

// ========== SERIE ==========
export interface Serie {
  id: string;
  code: string;
  description: string;
  subjects?: Subject[];
  totalSubjects?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SerieStatistics {
  totalSubjects: number;
  averageCoefficient: number;
  maxCoefficient: number;
  minCoefficient: number;
}

export interface SerieWithStatistics extends Serie {
  statistics?: SerieStatistics;
}

// ========== REQUESTS ==========
export interface CreateSubjectRequest {
  name: string;
  description?: string;
  code?: string;
  seriesCoefficients?: Array<{
    serieId: string;
    coefficient: number;
  }>;
}

export interface UpdateSubjectRequest {
  name: string;
  description?: string;
  code?: string;
  seriesCoefficients?: Array<{
    serieId: string;
    coefficient: number;
  }>;
}

export interface CreateSerieRequest {
  code: string;
  description: string;
  subjects?: Array<{
    subjectId: string;
    coefficient: number;
    isCore?: boolean;
  }>;
}

export interface UpdateSerieRequest {
  code: string;
  description: string;
  subjects?: Array<{
    subjectId: string;
    coefficient: number;
    isCore?: boolean;
  }>;
}

// ========== RESPONSES ==========
export interface SubjectsListResponse {
  success?: boolean;
  subjects: SubjectWithCoefficients[];
  count?: number;
  totalPages?: number;
  currentPage?: number;
  message?: string;
}

export interface SubjectResponse {
  success?: boolean;
  subject: SubjectWithCoefficients;
  message?: string;
}

export interface CreateSubjectResponse {
  success?: boolean;
  message: string;
  subject: SubjectWithCoefficients;
}

export interface UpdateSubjectResponse {
  success?: boolean;
  message: string;
  subject: SubjectWithCoefficients;
}

export interface DeleteSubjectResponse {
  success?: boolean;
  message: string;
  deletedSubject?: {
    id: string;
    name: string;
    deletedAt: string;
  };
  cascadeInfo?: {
    seriesAssignments: number;
    notes: number;
    recommendations: number;
  };
}

export interface SeriesListResponse {
  series: Serie[];
  metadata?: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface SerieResponse {
  serie: SerieWithStatistics;
}

export interface CreateSerieResponse {
  message: string;
  serie: Serie;
}

export interface UpdateSerieResponse {
  message: string;
  serie: Serie;
  changes?: {
    codeChanged: boolean;
    descriptionChanged: boolean;
    subjectsChanged: boolean;
    addedSubjects: number;
    removedSubjects: number;
    modifiedSubjects: number;
  };
}

export interface DeleteSerieResponse {
  message: string;
  deletedSerie?: {
    id: string;
    code: string;
    description: string;
    totalSubjects: number;
  };
  deletedAt?: string;
  deletedBy?: string;
  cascadeEffects?: {
    subjectCoefficientsDeleted: number;
    recommendationsDeleted: number;
    affectedUsers: number;
  };
}
