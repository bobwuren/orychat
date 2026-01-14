/**
 * =====================================================
 * API Client - Séries
 * =====================================================
 * Client pour les endpoints des séries éducatives
 *
 * @module lib/api/series.api
 * @version 1.0
 */

import { apiClient } from "./client";
import type {
  CreateSerieRequest,
  UpdateSerieRequest,
  SeriesListResponse,
  SerieResponse,
  CreateSerieResponse,
  UpdateSerieResponse,
  DeleteSerieResponse,
} from "../types";

export class SeriesApi {
  private client = apiClient;

  /**
   * Récupérer toutes les séries
   * GET /api/series
   * Requiert: Bearer token
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<SeriesListResponse> {
    return this.client.get<SeriesListResponse>("/api/series", params);
  }

  /**
   * Récupérer une série par ID
   * GET /api/series/:id
   * Requiert: Bearer token
   */
  async getById(
    serieId: string,
    params?: {
      includeStats?: boolean;
    }
  ): Promise<SerieResponse> {
    return this.client.get<SerieResponse>(`/api/series/${serieId}`, params);
  }

  /**
   * Créer une nouvelle série (Admin uniquement)
   * POST /api/series
   * Requiert: Bearer token + admin
   */
  async create(data: CreateSerieRequest): Promise<CreateSerieResponse> {
    return this.client.post<CreateSerieResponse>("/api/series", data);
  }

  /**
   * Mettre à jour une série (Admin uniquement)
   * PUT /api/series/:id
   * Requiert: Bearer token + admin
   */
  async update(
    serieId: string,
    data: UpdateSerieRequest
  ): Promise<UpdateSerieResponse> {
    return this.client.put<UpdateSerieResponse>(`/api/series/${serieId}`, data);
  }

  /**
   * Supprimer une série (Admin uniquement)
   * DELETE /api/series/:id
   * Requiert: Bearer token + admin
   */
  async delete(
    serieId: string,
    params?: {
      force?: boolean;
      cascade?: boolean;
    }
  ): Promise<DeleteSerieResponse> {
    return this.client.delete<DeleteSerieResponse>(`/api/series/${serieId}`);
  }

  /**
   * Exporter toutes les séries (Admin uniquement)
   * GET /api/series/export
   * Requiert: Bearer token + admin
   */
  async export(params: {
    format: "csv" | "json";
    includeSubjects?: boolean;
    dateRange?: string;
  }): Promise<Blob> {
    const filename = `series_export_${new Date().toISOString().split("T")[0]}.${
      params.format
    }`;
    return this.client.download("/api/series/export", params, filename);
  }
}

// Instance singleton exportée
export const seriesApi = new SeriesApi();
