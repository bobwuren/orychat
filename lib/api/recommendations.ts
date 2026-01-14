import { apiClient } from "./client";
import type * as T from "../types/recommendations";

// ============= RECOMMENDATIONS API =============
export class RecommendationsApi {
  async getAll() {
    return apiClient.get<{ recommendations: T.Recommendation[] }>(
      "/recommendations/all"
    );
  }

  async getById(id: string) {
    return apiClient.get<T.Recommendation>(`/recommendations/${id}`);
  }

  async getUserRecommendations() {
    return apiClient.get<{ recommendations: T.Recommendation[] }>(
      "/recommendations"
    );
  }

  async generate(data: T.GenerateRecommendationRequest) {
    return apiClient.post<T.GenerateRecommendationResponse>(
      "/recommendations/generate",
      data
    );
  }

  async save(data: {
    serieId: string;
    orientations: T.Orientation[];
    noteIds: string[];
  }) {
    return apiClient.post<{ message: string; id: string }>(
      "/recommendations/save",
      data
    );
  }

  async export(format: "csv" | "json" = "json") {
    return apiClient.get(`/recommendations/export?format=${format}`);
  }
}

export const recommendationsApi = new RecommendationsApi();