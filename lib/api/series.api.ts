/**
 * =====================================================
 * API Client - Séries - CORRIGÉ
 * =====================================================
 * Client pour les endpoints des séries éducatives
 *
 * @module lib/api/series.api
 * @version 1.1
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
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<SeriesListResponse> {
    return this.client.get<SeriesListResponse>("/series", params);
  }

  /**
   * Récupérer une série par ID
   * GET /api/series/:id
   */
  async getById(
    serieId: string,
    params?: {
      includeStats?: boolean;
    },
  ): Promise<SerieResponse> {
    return this.client.get<SerieResponse>(`/series/${serieId}`, params);
  }

  /**
   * Créer une nouvelle série (Admin uniquement)
   * POST /api/series
   */
  async create(data: CreateSerieRequest): Promise<CreateSerieResponse> {
    return this.client.post<CreateSerieResponse, CreateSerieRequest>(
      "/series",
      data,
    );
  }

  /**
   * Mettre à jour une série (Admin uniquement)
   * PUT /api/series/:id
   */
  async update(
    serieId: string,
    data: UpdateSerieRequest,
  ): Promise<UpdateSerieResponse> {
    return this.client.put<UpdateSerieResponse, UpdateSerieRequest>(
      `/series/${serieId}`,
      data,
    );
  }

  /**
   * Supprimer une série (Admin uniquement)
   * DELETE /api/series/:id
   */
  async delete(
    serieId: string,
    params?: {
      force?: boolean;
      cascade?: boolean;
    },
  ): Promise<DeleteSerieResponse> {
    return this.client.delete<DeleteSerieResponse>(
      `/series/${serieId}`,
      params as any,
    );
  }

  /**
   * Exporter toutes les séries (Admin uniquement)
   * GET /api/series/export
   */
  async export(params: {
    format: "csv" | "json";
    includeSubjects?: boolean;
    dateRange?: string;
  }): Promise<Blob> {
    const filename = `series_export_${new Date().toISOString().split("T")[0]}.${
      params.format
    }`;
    return this.client.download("/series/export", params, filename);
  }
}

// Instance singleton exportée
export const seriesApi = new SeriesApi();
