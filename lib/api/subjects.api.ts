/**
 * =====================================================
 * API Client - Matières - CORRIGÉ
 * =====================================================
 * Client pour les endpoints des matières
 *
 * @module lib/api/subjects.api
 * @version 1.1
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
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<SubjectsListResponse> {
    return this.client.get<SubjectsListResponse>("/subjects", params);
  }

  /**
   * Récupérer une matière par ID
   * GET /api/subjects/:id
   */
  async getById(subjectId: string): Promise<SubjectResponse> {
    return this.client.get<SubjectResponse>(`/subjects/${subjectId}`);
  }

  /**
   * Récupérer les matières d'une série
   * GET /api/subjects/serie/:serieId
   */
  async getBySerie(serieId: string): Promise<SubjectsListResponse> {
    return this.client.get<SubjectsListResponse>(`/subjects/serie/${serieId}`);
  }

  /**
   * Créer une nouvelle matière (Admin uniquement)
   * POST /api/subjects
   */
  async create(data: CreateSubjectRequest): Promise<CreateSubjectResponse> {
    return this.client.post<CreateSubjectResponse, CreateSubjectRequest>(
      "/subjects",
      data,
    );
  }

  /**
   * Mettre à jour une matière (Admin uniquement)
   * PUT /api/subjects/:id
   */
  async update(
    subjectId: string,
    data: UpdateSubjectRequest,
  ): Promise<UpdateSubjectResponse> {
    return this.client.put<UpdateSubjectResponse, UpdateSubjectRequest>(
      `/subjects/${subjectId}`,
      data,
    );
  }

  /**
   * Supprimer une matière (Admin uniquement)
   * DELETE /api/subjects/:id
   */
  async delete(subjectId: string): Promise<DeleteSubjectResponse> {
    return this.client.delete<DeleteSubjectResponse>(`/subjects/${subjectId}`);
  }

  /**
   * Exporter toutes les matières (Admin uniquement)
   * GET /api/subjects/export
   */
  async export(params?: { format?: "csv" | "json" }): Promise<Blob> {
    const format = params?.format || "csv";
    const filename = `subjects_export_${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    return this.client.download("/subjects/export", { format }, filename);
  }
}

// Instance singleton exportée
export const subjectsApi = new SubjectsApi();
