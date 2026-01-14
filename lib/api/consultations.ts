import { apiClient } from "./client";
import type * as T from "../types/consultations";

// ============= CONSULTATIONS API =============
export class ConsultationsApi {
  async request(data: T.RequestConsultationRequest) {
    return apiClient.post<T.RequestConsultationResponse>(
      "/consultations/request",
      data
    );
  }

  async getAll(params?: {
    status?: T.ConsultationStatus;
    counselorId?: string;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get<{
      success: boolean;
      consultations: T.Consultation[];
      count: number;
    }>(`/consultations${query ? `?${query}` : ""}`);
  }

  async getById(id: string) {
    return apiClient.get<{
      success: boolean;
      consultation: T.ConsultationDetails;
    }>(`/consultations/${id}`);
  }

  async getUserConsultations(userId: string) {
    return apiClient.get<{
      success: boolean;
      consultations: T.Consultation[];
      count: number;
    }>(`/consultations/user/${userId}`);
  }

  async assignCounselor(id: string, data: T.AssignCounselorRequest) {
    return apiClient.put<T.AssignCounselorResponse>(
      `/consultations/${id}/assign`,
      data
    );
  }

  async updateStatus(id: string, data: T.UpdateConsultationStatusRequest) {
    return apiClient.patch<{
      success: boolean;
      message: string;
      consultation: T.Consultation;
    }>(`/consultations/${id}/status`, data);
  }

  async getStats() {
    return apiClient.get<{ success: boolean; stats: T.ConsultationStats }>(
      "/consultations/stats"
    );
  }
}

export const consultationsApi = new ConsultationsApi();
