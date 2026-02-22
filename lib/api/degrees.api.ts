/**
 * =====================================================
 * API Client - Diplômes - CORRIGÉ
 * =====================================================
 * Client pour les endpoints des diplômes
 *
 * @module lib/api/degrees.api
 * @version 1.1
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
   */
  async getAll(params?: {
    search?: string;
    universityId?: string;
    page?: number;
    limit?: number;
  }): Promise<DegreesListResponse> {
    return this.client.get<DegreesListResponse>("/degrees", params);
  }

  /**
   * Récupérer un diplôme par ID
   * GET /api/degrees/:id
   */
  async getById(degreeId: string): Promise<DegreeResponse> {
    return this.client.get<DegreeResponse>(`/degrees/${degreeId}`);
  }

  /**
   * Créer un diplôme (Admin uniquement)
   * POST /api/degrees
   */
  async create(data: CreateDegreeRequest): Promise<CreateDegreeResponse> {
    return this.client.post<CreateDegreeResponse, CreateDegreeRequest>(
      "/degrees",
      data,
    );
  }

  /**
   * Mettre à jour un diplôme (Admin uniquement)
   * PUT /api/degrees/:id
   */
  async update(
    degreeId: string,
    data: UpdateDegreeRequest,
  ): Promise<UpdateDegreeResponse> {
    return this.client.put<UpdateDegreeResponse, UpdateDegreeRequest>(
      `/degrees/${degreeId}`,
      data,
    );
  }

  /**
   * Supprimer un diplôme (Admin uniquement)
   * DELETE /api/degrees/:id
   */
  async delete(degreeId: string): Promise<void> {
    return this.client.delete<void>(`/degrees/${degreeId}`);
  }

  /**
   * Exporter tous les diplômes (Admin uniquement)
   * GET /api/degrees/export
   */
  async export(params?: { format?: "csv" | "json" }): Promise<Blob> {
    const format = params?.format || "csv";
    const filename = `degrees_export_${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    return this.client.download("/degrees/export", { format }, filename);
  }
}

// Instance singleton exportée
export const degreesApi = new DegreesApi();
