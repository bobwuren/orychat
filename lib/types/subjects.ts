/**
 * =====================================================
 * Types Subjects - Orientys
 * =====================================================
 */

export interface SubjectCoefficient {
  serieId: string;
  seriesName: string;
  coefficient: number;
}

export interface Subject {
  id: string;
  name: string;
  coefficient: number;
  isCore?: boolean;
}

export interface SubjectBase {
  id: string;
  name: string;
  description?: string;
  code?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectWithCoefficients extends SubjectBase {
  seriesCoefficients: SubjectCoefficient[];
}

export interface CreateSubjectRequest {
  name: string;
  description?: string;
  code?: string;
  seriesCoefficients?: Array<{
    serieId: string;
    coefficient: number;
  }>;
}

export interface UpdateSubjectRequest extends CreateSubjectRequest {}
