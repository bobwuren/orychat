/**
 * =====================================================
 * API Client - Recommandations
 * =====================================================
 * Client pour les endpoints des recommandations
 *
 * @module lib/api/recommendations.api
 * @version 1.0
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
   * Requiert: Bearer token
   */
  async generate(
    data: GenerateRecommendationRequest
  ): Promise<GenerateRecommendationResponse> {
    return this.client.post<GenerateRecommendationResponse>(
      "/api/recommendations/generate",
      data
    );
  }

  /**
   * Sauvegarder une recommandation manuelle
   * POST /api/recommendations/save
   * Requiert: Bearer token
   */
  async save(
    data: SaveRecommendationRequest
  ): Promise<SaveRecommendationResponse> {
    return this.client.post<SaveRecommendationResponse>(
      "/api/recommendations/save",
      data
    );
  }

  /**
   * Récupérer l'historique des recommandations de l'utilisateur
   * GET /api/recommendations
   * Requiert: Bearer token
   */
  async getUserRecommendations(): Promise<RecommendationsListResponse> {
    return this.client.get<RecommendationsListResponse>("/api/recommendations");
  }

  /**
   * Récupérer toutes les recommandations (Admin uniquement)
   * GET /api/recommendations/all
   * Requiert: Bearer token + admin
   */
  async getAll(): Promise<RecommendationsListResponse> {
    return this.client.get<RecommendationsListResponse>(
      "/api/recommendations/all"
    );
  }

  /**
   * Récupérer une recommandation par ID (Admin uniquement)
   * GET /api/recommendations/:id
   * Requiert: Bearer token + admin
   */
  async getById(recommendationId: string): Promise<RecommendationResponse> {
    return this.client.get<RecommendationResponse>(
      `/api/recommendations/${recommendationId}`
    );
  }

  /**
   * Exporter toutes les recommandations (Admin uniquement)
   * GET /api/recommendations/export
   * Requiert: Bearer token + admin
   */
  async export(params?: { format?: "csv" | "json" }): Promise<Blob> {
    const format = params?.format || "csv";
    const filename = `recommendations_export_${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    return this.client.download(
      "/api/recommendations/export",
      { format },
      filename
    );
  }
}

// Instance singleton exportée
export const recommendationsApi = new RecommendationsApi();
