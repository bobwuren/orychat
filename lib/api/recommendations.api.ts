/**
 * =====================================================
 * API Client - Recommandations - CORRIGÉ
 * =====================================================
 * Client pour les endpoints des recommandations
 *
 * @module lib/api/recommendations.api
 * @version 1.1
 */

import { apiClient } from "./client";
import type {
  SaveRecommendationRequest,
  GenerateRecommendationRequest,
  SaveRecommendationResponse,
  GenerateRecommendationResponse,
  RecommendationsListResponse,
  RecommendationResponse,
} from "../types";

export class RecommendationsApi {
  private client = apiClient;

  /**
   * Générer une recommandation avec IA
   * POST /api/recommendations/generate
   */
  async generate(
    data: GenerateRecommendationRequest,
  ): Promise<GenerateRecommendationResponse> {
    return this.client.post<
      GenerateRecommendationResponse,
      GenerateRecommendationRequest
    >("/recommendations/generate", data);
  }

  /**
   * Sauvegarder une recommandation manuelle
   * POST /api/recommendations/save
   */
  async save(
    data: SaveRecommendationRequest,
  ): Promise<SaveRecommendationResponse> {
    return this.client.post<
      SaveRecommendationResponse,
      SaveRecommendationRequest
    >("/recommendations/save", data);
  }

  /**
   * Récupérer l'historique des recommandations de l'utilisateur
   * GET /api/recommendations
   */
  async getUserRecommendations(): Promise<RecommendationsListResponse> {
    return this.client.get<RecommendationsListResponse>("/recommendations");
  }

  /**
   * Récupérer toutes les recommandations (Admin uniquement)
   * GET /api/recommendations/all
   */
  async getAll(params?: {
    isManual?: boolean;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<RecommendationsListResponse> {
    return this.client.get<RecommendationsListResponse>(
      "/recommendations/all",
      params,
    );
  }

  /**
   * Récupérer une recommandation par ID (Admin uniquement)
   * GET /api/recommendations/:id
   */
  async getById(recommendationId: string): Promise<RecommendationResponse> {
    return this.client.get<RecommendationResponse>(
      `/recommendations/${recommendationId}`,
    );
  }

  /**
   * Exporter toutes les recommandations (Admin uniquement)
   * GET /api/recommendations/export
   */
  async export(params?: {
    format?: "csv" | "json";
    isManual?: boolean;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const format = params?.format || "csv";
    const filename = `recommendations_export_${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    return this.client.download(
      "/recommendations/export",
      { ...params, format },
      filename,
    );
  }
}

// Instance singleton exportée
export const recommendationsApi = new RecommendationsApi();
