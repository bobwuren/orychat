import { apiClient } from "./client";
import type * as T from "../types/degrees";

// ============= DEGREES API =============
export class DegreesApi {
  async getAll() {
    return apiClient.get<T.DegreeWithUniversities[]>("/degrees");
  }

  async getById(id: string) {
    return apiClient.get<T.DegreeWithUniversities>(`/degrees/${id}`);
  }

  async create(data: T.CreateDegreeRequest) {
    return apiClient.post<T.DegreeWithUniversities>("/degrees", data);
  }

  async update(id: string, data: T.CreateDegreeRequest) {
    return apiClient.put<T.DegreeWithUniversities>(`/degrees/${id}`, data);
  }

  async delete(id: string) {
    return apiClient.delete(`/degrees/${id}`);
  }

  async export(format: "csv" | "json" = "json") {
    return apiClient.get(`/degrees/export?format=${format}`);
  }
}

export const degreesApi = new DegreesApi();
