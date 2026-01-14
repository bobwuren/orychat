/**
 * =====================================================
 * Types Séries - Orientys
 * =====================================================
 */

import { BaseEntity, ExportParams } from "./api";
import { Subject } from "./subjects";

export interface Serie extends BaseEntity {
  code: string;
  description: string;
  subjects?: Subject[];
  totalSubjects?: number;
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
  serie: Serie;
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

export interface CreateSerieResponse {
  message: string;
  serie: Serie;
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
  deletedSerie: {
    id: string;
    code: string;
    description: string;
    totalSubjects: number;
  };
  deletedAt: string;
  cascadeEffects?: {
    subjectCoefficientsDeleted: number;
    recommendationsDeleted: number;
    affectedUsers: number;
  };
}

export type SerieExportParams = ExportParams;
