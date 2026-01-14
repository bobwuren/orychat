import { apiClient } from "./client";
import type * as T from "../types/universities";

// ============= UNIVERSITIES API =============
export class UniversitiesApi {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sponsorOnly?: boolean;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get<{
      universities: T.UniversityWithDegrees[];
      count: number;
    }>(`/universities${query ? `?${query}` : ""}`);
  }

  async getSponsors() {
    return apiClient.get<T.UniversityWithDegrees[]>("/universities/sponsors");
  }

  async getById(id: string) {
    return apiClient.get<{ university: T.UniversityWithDegrees }>(
      `/universities/${id}`
    );
  }

  async getDegrees(id: string) {
    return apiClient.get<T.UniversityDegree[]>(`/universities/${id}/degrees`);
  }

  async getByDegree(degreeId: string) {
    return apiClient.get<T.UniversityWithDegrees[]>(
      `/universities/degree/${degreeId}`
    );
  }

  async create(data: T.CreateUniversityRequest) {
    return apiClient.post<{
      message: string;
      university: T.UniversityWithDegrees;
    }>("/universities", data);
  }

  async update(id: string, data: Partial<T.CreateUniversityRequest>) {
    return apiClient.put<{
      message: string;
      university: T.UniversityWithDegrees;
    }>(`/universities/${id}`, data);
  }

  async delete(id: string) {
    return apiClient.delete(`/universities/${id}`);
  }

  async export(format: "csv" | "json" = "json") {
    return apiClient.get(`/universities/export?format=${format}`);
  }
}

export const universitiesApi = new UniversitiesApi();
