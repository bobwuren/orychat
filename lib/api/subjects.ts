import { apiClient } from "./client";
import type * as T from "../types/subjects";

// ============= SUBJECTS API =============
export class SubjectsApi {
  async getAll() {
    return apiClient.get<{ subjects: T.SubjectWithCoefficients[] }>(
      "/subjects"
    );
  }

  async getById(id: string) {
    return apiClient.get<{ subject: T.SubjectWithCoefficients }>(
      `/subjects/${id}`
    );
  }

  async getBySerie(serieId: string) {
    return apiClient.get<T.Subject[]>(`/subjects/serie/${serieId}`);
  }

  async create(data: T.CreateSubjectRequest) {
    return apiClient.post<{
      message: string;
      subject: T.SubjectWithCoefficients;
    }>("/subjects", data);
  }

  async update(id: string, data: T.UpdateSubjectRequest) {
    return apiClient.put<{
      message: string;
      subject: T.SubjectWithCoefficients;
    }>(`/subjects/${id}`, data);
  }

  async delete(id: string) {
    return apiClient.delete<{ message: string }>(`/subjects/${id}`);
  }

  async export(format: "csv" | "json" = "json") {
    return apiClient.get(`/subjects/export?format=${format}`);
  }
}

export const subjectsApi = new SubjectsApi();
