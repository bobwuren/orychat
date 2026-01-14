/**
 * =====================================================
 * API Client - Matières
 * =====================================================
 * Client pour les endpoints des matières
 *
 * @module lib/api/subjects.api
 * @version 1.0
 */

import { apiClient } from "./client";
import type {
  CreateSubjectRequest,
  UpdateSubjectRequest,
  SubjectsListResponse,
  SubjectResponse,
  CreateSubjectResponse,
  UpdateSubjectResponse,
  DeleteSubjectResponse,
} from "../types";

export class SubjectsApi {
  private client = apiClient;

  /**
   * Récupérer toutes les matières
   * GET /api/subjects
   * Requiert: Bearer token
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<SubjectsListResponse> {
    return this.client.get<SubjectsListResponse>("/api/subjects", params);
  }

  /**
   * Récupérer une matière par ID
   * GET /api/subjects/:id
   * Requiert: Bearer token
   */
  async getById(subjectId: string): Promise<SubjectResponse> {
    return this.client.get<SubjectResponse>(`/api/subjects/${subjectId}`);
  }

  /**
   * Récupérer les matières d'une série
   * GET /api/subjects/serie/:serieId
   * Requiert: Bearer token
   */
  async getBySerie(serieId: string): Promise<SubjectsListResponse> {
    return this.client.get<SubjectsListResponse>(
      `/api/subjects/serie/${serieId}`
    );
  }

  /**
   * Créer une nouvelle matière (Admin uniquement)
   * POST /api/subjects
   * Requiert: Bearer token + admin
   */
  async create(data: CreateSubjectRequest): Promise<CreateSubjectResponse> {
    return this.client.post<CreateSubjectResponse>("/api/subjects", data);
  }

  /**
   * Mettre à jour une matière (Admin uniquement)
   * PUT /api/subjects/:id
   * Requiert: Bearer token + admin
   */
  async update(
    subjectId: string,
    data: UpdateSubjectRequest
  ): Promise<UpdateSubjectResponse> {
    return this.client.put<UpdateSubjectResponse>(
      `/api/subjects/${subjectId}`,
      data
    );
  }

  /**
   * Supprimer une matière (Admin uniquement)
   * DELETE /api/subjects/:id
   * Requiert: Bearer token + admin
   */
  async delete(subjectId: string): Promise<DeleteSubjectResponse> {
    return this.client.delete<DeleteSubjectResponse>(
      `/api/subjects/${subjectId}`
    );
  }

  /**
   * Exporter toutes les matières (Admin uniquement)
   * GET /api/subjects/export
   * Requiert: Bearer token + admin
   */
  async export(params?: { format?: "csv" | "json" }): Promise<Blob> {
    const format = params?.format || "csv";
    const filename = `subjects_export_${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    return this.client.download("/api/subjects/export", { format }, filename);
  }
}

// Instance singleton exportée
export const subjectsApi = new SubjectsApi();
