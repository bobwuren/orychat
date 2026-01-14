/**
 * =====================================================
 * API Client - Diplômes
 * =====================================================
 * Client pour les endpoints des diplômes
 *
 * @module lib/api/degrees.api
 * @version 1.0
 */

import { apiClient } from "./client";
import type {
  CreateDegreeRequest,
  UpdateDegreeRequest,
  DegreesListResponse,
  DegreeResponse,
  CreateDegreeResponse,
  UpdateDegreeResponse,
} from "../types";

export class DegreesApi {
  private client = apiClient;

  /**
   * Récupérer tous les diplômes
   * GET /api/degrees
   * Requiert: Bearer token
   */
  async getAll(): Promise<DegreesListResponse> {
    return this.client.get<DegreesListResponse>("/api/degrees");
  }

  /**
   * Récupérer un diplôme par ID
   * GET /api/degrees/:id
   * Requiert: Bearer token
   */
  async getById(degreeId: string): Promise<DegreeResponse> {
    return this.client.get<DegreeResponse>(`/api/degrees/${degreeId}`);
  }

  /**
   * Créer un diplôme (Admin uniquement)
   * POST /api/degrees
   * Requiert: Bearer token + admin
   */
  async create(data: CreateDegreeRequest): Promise<CreateDegreeResponse> {
    return this.client.post<CreateDegreeResponse>("/api/degrees", data);
  }

  /**
   * Mettre à jour un diplôme (Admin uniquement)
   * PUT /api/degrees/:id
   * Requiert: Bearer token + admin
   */
  async update(
    degreeId: string,
    data: UpdateDegreeRequest
  ): Promise<UpdateDegreeResponse> {
    return this.client.put<UpdateDegreeResponse>(
      `/api/degrees/${degreeId}`,
      data
    );
  }

  /**
   * Supprimer un diplôme (Admin uniquement)
   * DELETE /api/degrees/:id
   * Requiert: Bearer token + admin
   */
  async delete(degreeId: string): Promise<void> {
    return this.client.delete<void>(`/api/degrees/${degreeId}`);
  }

  /**
   * Exporter tous les diplômes (Admin uniquement)
   * GET /api/degrees/export
   * Requiert: Bearer token + admin
   */
  async export(params?: { format?: "csv" | "json" }): Promise<Blob> {
    const format = params?.format || "csv";
    const filename = `degrees_export_${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    return this.client.download("/api/degrees/export", { format }, filename);
  }
}

// Instance singleton exportée
export const degreesApi = new DegreesApi();
