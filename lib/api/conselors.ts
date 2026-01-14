import { apiClient } from "./client";
import type * as T from "../types/conselors";

// ============= COUNSELORS API =============
export class CounselorsApi {
  async getAll(specialty?: string) {
    const query = specialty
      ? `?specialty=${encodeURIComponent(specialty)}`
      : "";
    return apiClient.get<{
      success: boolean;
      counselors: T.Counselor[];
      count: number;
    }>(`/counselors${query}`);
  }

  async getAllAdmin() {
    return apiClient.get<{
      success: boolean;
      counselors: T.Counselor[];
      count: number;
    }>("/counselors/all");
  }

  async getById(id: string) {
    return apiClient.get<{ success: boolean; counselor: T.Counselor }>(
      `/counselors/${id}`
    );
  }

  async create(data: T.CreateCounselorRequest) {
    return apiClient.post<{
      success: boolean;
      message: string;
      counselor: T.Counselor;
    }>("/counselors", data);
  }

  async update(id: string, data: T.UpdateCounselorRequest) {
    return apiClient.put<{
      success: boolean;
      message: string;
      counselor: T.Counselor;
    }>(`/counselors/${id}`, data);
  }

  async delete(id: string) {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/counselors/${id}`
    );
  }

  async activate(id: string) {
    return apiClient.patch<{ success: boolean; message: string }>(
      `/counselors/${id}/activate`,
      {}
    );
  }

  async deactivate(id: string) {
    return apiClient.patch<{ success: boolean; message: string }>(
      `/counselors/${id}/deactivate`,
      {}
    );
  }
}

export const counselorsApi = new CounselorsApi();
